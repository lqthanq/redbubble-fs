import { CAMPAIGN } from "actions";
import { Button, Card, Collapse, Modal, Tag } from "antd";
import { useAppValue } from "context";
import _, { omit } from "lodash";
import Scrollbars from "react-custom-scrollbars";
import styled from "styled-components";
import Attributes from "./CampaignForm-Attributes";
import CampaignQuickSetPrices from "./CampaignQuickSetPrices";
import CampaignVariant from "./CampaignVariant";
import CampaignArtwork from "./CampaignArtwork";
import { useEffect, useMemo, useState } from "react";

const Container = styled.div`
  height: 100%;
  .ant-card {
    height: 100%;
  }
  .ant-card-body {
    padding: 0;
  }
  .quick-set-prices {
    .ant-collapse-content-box {
      padding: 0;
    }
  }
  .ant-modal-body {
    padding: 10px;
  }
  .ant-collapse-item .ant-collapse-header {
    height: 51px;
  }
  .ant-collapse-item-active .ant-collapse-header {
    height: 52px;
  }
`;

const CampaignPrintAreas = () => {
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases, baseSelected, productInput } = campaign;
  const [showVariants, setShowVariants] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    setVariants(baseSelected.variants);
  }, []);

  const onClose = () => {
    setSelectedRowKeys([]);
    setVariants(baseSelected.variants);
    setShowVariants(false);
  };

  const clearTypeName = (array) => {
    return array?.map((el) => omit(el, ["__typename", "checked", "name"]));
  };

  const dispatchCampaign = (productBases) => {
    dispatch({
      type: CAMPAIGN.SET,
      payload: {
        campaign: {
          ...campaign,
          productBases,
        },
      },
    });
  };

  const newVariantAttributes = useMemo(() => {
    const allVariants = baseSelected?.variants;
    if (allVariants?.length) {
      let allAttributesFromVariant = _.concat(
        ...allVariants.map((item) => item.attributes)
      );
      // unique attributes
      allAttributesFromVariant = _.uniqWith(
        allAttributesFromVariant,
        _.isEqual
      );
      const variantAttributes = allAttributesFromVariant.reduce((init, el) => {
        const key = el.slug;
        if (!init[key]) {
          init[key] = [];
        }
        // get variants with the same attribute
        const variantContainAttributes = allVariants.filter(
          (varr) =>
            _.differenceWith([el], varr.attributes, _.isEqual)?.length === 0
        );
        // checked tag if one or multiple variants variantContainAttributes contain status is true
        const attributeChecked = variantContainAttributes.find(
          (v) => v.active === true
        );
        const disabled = _.find(
          productInput?.variants,
          (vari) =>
            vari.id === attributeChecked?.id &&
            vari.active === true &&
            vari.productBaseVariantId
        );
        init[key].push({
          ...el,
          checked: !!attributeChecked,
          disabled: !!disabled,
        });
        return init;
      }, {});
      return variantAttributes;
    }
    return {};
  }, [baseSelected.variants]);

  const changeVariant = (variant) => {
    let disableValue = [];
    Object.keys(variant).map((v) => {
      variant[v].map((el) => {
        if (!el.checked) {
          disableValue.push(el.value);
        }
      });
    });
    let newBase = { ...baseSelected };
    newBase.variants = newBase.variants.map((v) => {
      let value = v.attributes.map((a) => a.value);
      if (_.difference(value, disableValue).length < value.length) {
        return { ...v, active: false };
      }
      return {
        ...v,
        active: true,
      };
    });
    dispatchCampaign(
      productBases.map((el) => {
        if (el.id === newBase.id) {
          return newBase;
        } else {
          return el;
        }
      })
    );
  };

  const variantsActive = productBases?.reduce((init, base) => {
    let baseVariants = base.variants.filter(
      (variant) => variant.active === true
    );
    return [...init, ...baseVariants];
  }, []);

  const handleChangeActive = (value) => {
    setVariants(
      variants.map((el) => {
        return { ...el, active: value };
      })
    );
    // if (value === false) {
    //   setVariants(disableMultiple(value, true));
    // } else {
    //   setVariants(
    //     variants.map((el) => {
    //       return { ...el, active: value };
    //     })
    //   );
    // }
  };

  const handleChangeVariants = (baseSelected) => {
    const newproductBases = productBases.map((base) => {
      if (baseSelected.id === base.id) {
        return {
          ...base,
          variants,
        };
      }
      return { ...base };
    });
    dispatch({
      type: CAMPAIGN.SET,
      payload: {
        campaign: {
          ...campaign,
          productBases: newproductBases,
        },
      },
    });
  };

  return (
    <Container>
      <Card bordered={false}>
        <Scrollbars style={{ width: "auto", height: "calc(100vh - 62px)" }}>
          <Collapse
            defaultActiveKey={["printAreas", "variants", "quickSetPrices"]}
            expandIconPosition="right"
            bordered={false}
          >
            <Collapse.Panel
              key="printAreas"
              className="grid"
              header="Print areas"
              //style={{ height: 50 }}
            >
              <CampaignArtwork dispatchCampaign={dispatchCampaign} />
            </Collapse.Panel>
            <Collapse.Panel key="variants" header="Variants">
              <h4>Attributes</h4>
              <Attributes
                attributes={newVariantAttributes}
                showVariant={() => setShowVariants(true)}
                onChange={(v) => changeVariant(v)}
              />
            </Collapse.Panel>
            <Collapse.Panel
              key="quickSetPrices"
              className="quick-set-prices"
              header="Quick set prices"
            >
              <CampaignQuickSetPrices
                clearTypeName={clearTypeName}
                baseSelected={baseSelected}
              />
            </Collapse.Panel>
          </Collapse>
          <Tag
            className="flex item-center m-15"
            style={{ minWidth: 150, height: 30, fontSize: 14 }}
            color={
              variantsActive.length >= 100
                ? "red"
                : variantsActive.length >= 80
                ? "warning"
                : "green"
            }
          >
            {variantsActive.length}{" "}
            {variantsActive.length === 1 ? "variant" : "variants"} enabled.
          </Tag>
        </Scrollbars>
      </Card>
      <Modal
        title="All Variants"
        visible={showVariants}
        onCancel={onClose}
        width={800}
        footer={[
          <div key="campaignPrintAreas" className="flex space-between">
            <div className="flex item-center">
              <Button onClick={() => handleChangeActive(true)}>
                Enable All
              </Button>
              <Button onClick={() => handleChangeActive(false)}>
                Disable All
              </Button>
              {disabled && (
                <p
                  style={{
                    color: "var(--error-color)",
                    marginBottom: "unset",
                    marginLeft: 15,
                  }}
                >
                  {disabled === "count"
                    ? "*You must keep at least one variant"
                    : "*Sale price has to is equal or smaller than regular!"}
                </p>
              )}
            </div>
            <div>
              <Button key="back" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button
                disabled={disabled}
                key="submit"
                type="primary"
                onClick={() => {
                  handleChangeVariants({ ...baseSelected, variants });
                  setSelectedRowKeys([]);
                  setShowVariants(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>,
        ]}
      >
        <CampaignVariant
          variants={variants}
          setVariants={setVariants}
          setDisabled={setDisabled}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </Modal>
    </Container>
  );
};

export default CampaignPrintAreas;
