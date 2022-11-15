import { useState } from "react";
import {
  Button,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Skeleton,
} from "antd";
import styled from "styled-components";
import Scrollbars from "components/Utilities/Scrollbars";
import SortProductBasesList from "./SortProductBasesList";
import {
  CREATE_CAMPAIGN,
  CREATE_COLLECTION,
  UPDATE_CAMPAIGN,
} from "graphql/mutate/campaign/campaignAction";
import { useMutation, useQuery } from "@apollo/client";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";
import Editor from "components/Utilities/Editor";
import { messageSave } from "components/Utilities/message";
import { CAMPAIGN } from "actions";
import { debounce, get } from "lodash";
import { PRODUCT_COLLECTION } from "graphql/queries/product/products";

const Container = styled.div`
  height: 100%;
  .ant-table-tbody > tr > td {
    padding: 5px 10px;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-collapse-header {
    height: 51px !important;
  }
  .ant-collapse-content-box {
    padding: 15px !important;
  }
  .ant-form-item {
    margin-bottom: 15px;
  }
`;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const CampaignGeneralSettingsForm = (props) => {
  const { setAddMorePage, addMorePage, storesData } = props;
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases, productInput, settings } = campaign;
  const router = useRouter();
  const id = get(router, "query.id", null);
  const [form] = Form.useForm();
  const [createCampaign, { loading: createLoading }] = useMutation(
    CREATE_CAMPAIGN
  );
  const [updateCampaign, { loading: updateLoading }] = useMutation(
    UPDATE_CAMPAIGN
  );
  const [createCollection] = useMutation(CREATE_COLLECTION);
  const [name, setName] = useState();
  const [search, setSearch] = useState("");
  const freshCategory = (value) => {
    setSearch(value);
  };
  const { data: dataCollections, refetch } = useQuery(PRODUCT_COLLECTION, {
    variables: { search },
  });

  const variantsByProductBases = (productBases, variants, printAreas) => {
    let newProductBases =
      productBases && !productBases.includes(null) && productBases.length
        ? productBases.map((base) => {
            const newVariants = [];
            variants?.forEach((vari) => {
              if (vari.productBaseId === base.id) {
                base.variants?.forEach((variant) => {
                  if (vari.productBaseVariantId === variant.id) {
                    newVariants.push({
                      ...vari,
                      attributes: variant.attributes,
                      cost: variant.cost,
                    });
                  }
                });
              }
            });
            base.variants = newVariants;
            base.printAreas = base.printAreas?.map((printFile) => {
              const matchPrintFile = printAreas?.find(
                (printItem) => printItem.productBasePrintAreaId === printFile.id
              );
              if (matchPrintFile) {
                return matchPrintFile;
              }
              return printFile;
            });
            return base;
          })
        : [];
    return newProductBases;
  };

  const handleResetForm = (result) => {
    messageSave("Campaign");
    dispatch({
      type: CAMPAIGN.SET,
      payload: {
        campaign: {
          ...campaign,
          productBases: variantsByProductBases(
            result.products[0]?.productBases,
            result.products[0]?.variants,
            result.products[0]?.printAreas
          ),
          productInput: {
            ...result.products[0],
            productId: result.products[0].id,
            campaignStores: result.campaignStores,
            campaignId: result.id,
            updatedAt: result.updatedAt,
          },
        },
      },
    });
    if (!id) {
      window.history.pushState({}, "", `/campaigns/${result.id}`);
    }
  };

  const checkVariants = (variants) => {
    const activeVariants = variants.filter((vari) => vari.active === true);
    return activeVariants.length >= 100;
  };

  const variantWarning = () => {
    Modal.error({
      title: "Error",
      content: "Active variant must be between 1 and 100!",
    });
  };

  const handleSaveCampaign = (values) => {
    const storeIDs = values.storeIDs;
    delete values.storeIDs;
    const variants = productBases?.reduce((init, base) => {
      let baseVariants = base.variants.map((variant, index) => {
        const matchVariant = productInput?.variants?.find(
          (va) =>
            va.productBaseVariantId === variant.productBaseVariantId ||
            va.productBaseVariantId === variant.id
        );
        return {
          ID:
            (id || productInput?.campaignId) && matchVariant
              ? matchVariant.id
              : null,
          productBaseId:
            (id || productInput?.campaignId) && variant.productBaseId
              ? variant.productBaseId
              : base.id,
          productBaseVariantId:
            (id || productInput?.campaignId) && variant.productBaseVariantId
              ? variant.productBaseVariantId
              : variant.id,
          sorting: index,
          regularPrice: variant.regularPrice,
          salePrice: variant.salePrice,
          active: variant.active,
          sku:
            variant.sku && variant.sku !== ""
              ? variant.sku
              : variant.attributes.map((el) => el.value).join("-"),
        };
      });
      return [...init, ...baseVariants];
    }, []);
    const printAreas = productBases?.reduce((init, base) => {
      if (base.printAreas) {
        let pr = base.printAreas?.map((el) => {
          if (el.artwork) {
            return {
              productBaseId: base.id,
              name: el.name,
              productBasePrintAreaId:
                (id || productInput?.campaignId) && el.productBasePrintAreaId
                  ? el.productBasePrintAreaId
                  : el.id,
              artworkId: el.artwork.id,
              id:
                (id || productInput?.campaignId) && el.id !== "" ? el.id : null,
            };
          }
          return {
            productBaseId: base.id,
            name: el.name,
            productBasePrintAreaId:
              (id || productInput?.campaignId) && el.productBasePrintAreaId
                ? el.productBasePrintAreaId
                : el.id,
            artworkId: null,
            id: (id || productInput?.campaignId) && el.id !== "" ? el.id : null,
          };
        });
        return [...init, ...pr];
      }
      return init;
    }, []);
    if (checkVariants(variants)) {
      variantWarning();
    } else {
      if (id || productInput?.campaignId) {
        updateCampaign({
          variables: {
            id: id ?? productInput?.campaignId,
            input: {
              products: [
                {
                  ...values,
                  id: productInput.productId,
                  hasVariant: true,
                  status: "Available",
                  productBases: productBases?.map((el) => el.id),
                  variants,
                  printAreas: printAreas?.length ? printAreas : null,
                  excludeMockups: productInput.excludeMockups,
                },
              ],
              settings,
              storeIDs,
            },
          },
        })
          .then((res) => handleResetForm(res.data.updateCampaign))
          .catch((err) => notification.error({ message: err.message }));
      } else {
        createCampaign({
          variables: {
            input: {
              products: [
                {
                  ...values,
                  id: productInput.productId,
                  hasVariant: true,
                  status: "Available",
                  productBases: productBases?.map((el) => el.id),
                  variants,
                  printAreas: printAreas.length ? printAreas : null,
                  excludeMockups: productInput.excludeMockups,
                },
              ],
              settings,
              storeIDs,
            },
          },
        })
          .then((res) => {
            handleResetForm(res.data.createCampaign);
          })
          .catch((err) => notification.error({ message: err.message }));
      }
    }
  };

  const handleAddCollection = () => {
    const collectionsTitle = dataCollections?.productCollections.map(
      (el) => el.title
    );
    if (!collectionsTitle.includes(name) && name) {
      createCollection({
        variables: {
          title: name,
        },
      })
        .then((res) => {
          refetch();
          setName();
        })
        .catch((err) => notification.error({ message: err.message }));
    }
  };

  const onChangeTitle = ({ title }) => {
    if (title) {
      dispatch({
        type: CAMPAIGN.SET,
        payload: {
          campaign: {
            ...campaign,
            productInput: {
              ...productInput,
              title,
            },
          },
        },
      });
    }
  };

  if (id && !productInput?.productId) return [<Skeleton active={true} />];

  return [
    <Container>
      <div>
        <Scrollbars style={{ width: "auto", height: "calc(100vh - 60px)" }}>
          <Form
            id="campaign-form"
            initialValues={{
              title: productInput?.title ?? "",
              description: productInput ? productInput.description : "",
              collections: productInput?.collections?.map((el) => el.id) ?? [],
              tags: productInput?.tags ? productInput?.tags : [],
              storeIDs: storesData?.map((el) => el.id) ?? [],
            }}
            {...formLayout}
            form={form}
            onFinish={handleSaveCampaign}
            onValuesChange={debounce(onChangeTitle, 300)}
          >
            <Collapse
              style={{ borderTop: "1px solid #d9d9d9" }}
              defaultActiveKey={["info", "general", "stores"]}
              expandIconPosition="right"
              bordered={false}
            >
              <Collapse.Panel
                collapsible="disabled"
                header="General Setting"
                key="general"
                showArrow={false}
              >
                <SortProductBasesList
                  setAddMorePage={setAddMorePage}
                  addMorePage={addMorePage}
                />
              </Collapse.Panel>
              <Collapse.Panel key="info" header="Grouping info">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input campaign title!",
                    },
                  ]}
                  label="Title"
                  name="title"
                >
                  <Input placeholder="Example Mug" />
                </Form.Item>
                <Form.Item label="Collections" name="collections">
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select collection..."
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    tokenSeparators={[","]}
                    onSearch={debounce(freshCategory, 300)}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: "4px 0" }} />
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 8,
                          }}
                        >
                          <Input
                            size="small"
                            style={{ flex: "auto" }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <Button
                            disabled={!name}
                            type="link"
                            onClick={handleAddCollection}
                          >
                            <FaPlus className="anticon" /> Add collection
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {dataCollections?.productCollections?.map((collection) => (
                      <Select.Option key={collection.id} value={collection.id}>
                        {collection.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Tags" name="tags">
                  <Select
                    tokenSeparators={[","]}
                    showSearch
                    mode="tags"
                    placeholder="Search tags..."
                  />
                </Form.Item>
                <Form.Item
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please input campaign description!",
                    },
                  ]}
                  label="Description"
                  name="description"
                >
                  <Editor />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>
          </Form>
        </Scrollbars>
      </div>
    </Container>,
    { form, loading: createLoading || updateLoading },
  ];
};

export default CampaignGeneralSettingsForm;
