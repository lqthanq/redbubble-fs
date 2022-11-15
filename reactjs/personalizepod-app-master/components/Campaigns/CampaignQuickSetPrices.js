import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, InputNumber, Select, Table } from "antd";
import { find, intersectionWith, sum } from "lodash";
import { useAppValue } from "context";
import { CAMPAIGN } from "actions";
import styled from "styled-components";

const Container = styled.div`
  .ant-table-tbody > tr > td {
    z-index: 0;
  }
`;

const CampaignQuickSetPrices = ({ clearTypeName, baseSelected }) => {
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases } = campaign;
  const [pricesByAttribute, setPricesByAttribute] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
        init[key].push({
          ...el,
          checked: !!attributeChecked,
        });
        return init;
      }, {});
      return variantAttributes;
    }
    return {};
  }, [baseSelected.variants]);

  // Update attribute when disable variants
  useEffect(() => {
    const newAttributeSelected = find(
      newVariantAttributes,
      (attri, key) => key === pricesByAttribute.attributeSlug
    );
    if (newAttributeSelected) {
      const getAttributeSelected = newAttributeSelected.filter(
        (el) => el.checked === true
      );
      const attributeSelected = getAttributeSelected.map((el) => el.value);
      const newAttributes = attributeSelected.map((a) => {
        const sameAttribute = pricesByAttribute.attributeValues.find(
          (el) => el.attributeValue === a
        );
        if (sameAttribute) {
          return {
            attributeValue: a,
            regularPrice: sameAttribute.regularPrice,
            salePrice: sameAttribute.salePrice,
          };
        }
        return {
          attributeValue: a,
          regularPrice: 0,
          salePrice: 0,
        };
      });
      setPricesByAttribute({
        ...pricesByAttribute,
        attributeValues: newAttributes,
      });
    } else {
      setPricesByAttribute({
        ...pricesByAttribute,
        attributeValues: [],
      });
    }
  }, [baseSelected?.variants]);

  useEffect(() => {
    setPricesByAttribute({});
  }, [baseSelected.id]);

  const filterVariantByAttribute = () => {
    return baseSelected.variants.map((varri) => {
      const matchVariant = pricesByAttribute.attributeValues.find(
        (v) =>
          intersectionWith(
            clearTypeName(varri.attributes),
            [
              {
                slug: pricesByAttribute.attributeSlug,
                value: v.attributeValue,
              },
            ],
            _.isEqual
          ).length
      );
      if (matchVariant && varri.active === true) {
        return {
          ...varri,
          regularPrice: matchVariant.regularPrice,
          salePrice: matchVariant.salePrice,
        };
      }
      return { ...varri };
    });
  };

  const hanldeChangePrices = () => {
    const getNewVariants = filterVariantByAttribute();
    const newproductBases = productBases.map((base) => {
      if (base.id === baseSelected.id) {
        return { ...baseSelected, variants: getNewVariants };
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
    setUpdateSuccess(true);
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);
    return;
  };

  const passValidatePrice = () => {
    const errorVariant = pricesByAttribute?.attributeValues?.find(
      (vari) =>
        !vari.salePrice ||
        vari.salePrice < 1 ||
        vari.regularPrice < 1 ||
        !vari.regularPrice ||
        vari.regularPrice < vari.salePrice
    );
    return !!errorVariant;
  };

  const columns = [
    {
      title: pricesByAttribute?.attributeName,
      width: 100,
      className: "drag-visible",
      key: "attribute",
      render: (record) => record.attributeValue,
    },
    {
      title: "Regular Price",
      width: 100,
      className: "drag-visible",
      key: "regularPrice",
      render: (record, _, index) => (
        <InputNumber
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          max={10000000}
          onChange={(value) => {
            let a = { ...pricesByAttribute };
            a.attributeValues[index].regularPrice = value;
            a.attributeValues[index].salePrice = value;
            setPricesByAttribute(a);
          }}
        />
      ),
    },
    {
      title: "Sale Price",
      className: "drag-visible",
      width: 100,
      key: "salePrice",
      render: (record, _, index) => (
        <InputNumber
          value={record.salePrice}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={(value) => {
            let a = { ...pricesByAttribute };
            a.attributeValues[index].salePrice = value;
            setPricesByAttribute(a);
          }}
        />
      ),
    },
  ];

  const tableWidth = sum(columns.map((c) => c.width));

  return (
    <Container>
      <div
        className="ml-15 mb-15"
        style={{ marginTop: 10 }}
        hidden={!baseSelected.attributes}
      >
        <span>By attribute</span>
        <Select
          size="small"
          placeholder="Select attribute"
          className="ml-15"
          style={{ width: 150 }}
          value={pricesByAttribute?.attributeSlug}
          onChange={(value, option) => {
            if (value && option) {
              const newAttributeSelected = find(
                newVariantAttributes,
                (attri, key) => key === value
              );
              if (newAttributeSelected) {
                const getAttributeSelected = newAttributeSelected.filter(
                  (el) => el.checked === true
                );
                const attributeSelected = getAttributeSelected.map(
                  (el) => el.value
                );
                setPricesByAttribute({
                  attributeSlug: value,
                  attributeName: option.children,
                  attributeValues: attributeSelected.map((a) => {
                    return {
                      attributeValue: a,
                      regularPrice: null,
                      salePrice: null,
                    };
                  }),
                });
              } else {
                setPricesByAttribute({
                  attributeSlug: value,
                  attributeName: option.children,
                  attributeValues: [],
                });
              }
            } else {
              setPricesByAttribute({});
            }
          }}
          allowClear
        >
          {baseSelected.attributes?.map((attri) => (
            <Select.Option key={attri.slug} value={attri.slug}>
              {attri.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      {pricesByAttribute?.attributeSlug && (
        <Table
          rowKey={(record) => record.attributeValue}
          scroll={{ x: tableWidth }}
          pagination={false}
          dataSource={pricesByAttribute.attributeValues}
          columns={columns}
          footer={() => (
            <div
              hidden={!pricesByAttribute.attributeValues.length}
              className="flex item-center"
              style={{ justifyContent: "flex-end" }}
            >
              <p
                hidden={!updateSuccess}
                style={{
                  color: "var(--success-color)",
                  animation: "fadeOut 2.3s ease-in",
                  animationDelay: "1s",
                  marginBottom: "unset",
                  marginRight: 10,
                }}
              >
                *Prices updated
              </p>
              <Button
                type="primary"
                size="small"
                onClick={() => hanldeChangePrices()}
                disabled={passValidatePrice()}
              >
                Update Prices
              </Button>
            </div>
          )}
        />
      )}
      {passValidatePrice() && (
        <Alert
          message="Sale price has to is equal or smaller than regular!"
          type="warning"
          closable
        />
      )}
    </Container>
  );
};

export default CampaignQuickSetPrices;
