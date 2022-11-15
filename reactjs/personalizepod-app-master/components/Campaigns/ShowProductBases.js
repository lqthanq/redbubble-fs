import { CAMPAIGN } from "actions";
import { Button, Card, Divider, Input, Select, Form, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import { ColorsComponent } from "components/Utilities/ColorComponent";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import EmptyData from "components/Utilities/EmptyData";
import Scrollbars from "components/Utilities/Scrollbars";
import { useAppValue } from "context";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import productBase from "graphql/queries/productBase/productBase";
import { debounce, findIndex, get, map } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { cloneDeep } from "@apollo/client/utilities";

const Container = styled.div`
  background: #f4f6f8;
  h3 {
    line-height: 21px;
    margin-bottom: 0;
  }
  .ant-card-cover img {
    border-radius: 4px 0 0 4px;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .base-filter-header {
    padding: 15px 15px 0 15px;
    display: flex;
    .ant-select {
      width: 150px;
    }
    .ant-select-selector {
      border-radius: 4px 0 0 4px !important;
      border-right: 0 none !important;
    }
    input {
      border-radius: 0 4px 4px 0;
    }
  }
  .productbases {
    .ant-card {
      display: grid;
      grid-template-columns: 120px calc(100% - 120px);
    }
    .ant-card-cover {
      width: 120px;
    }
    .ant-card-body {
      width: 100%;
      background: white;
    }
  }

  .ant-card-bordered .ant-card-cover {
    margin: 0;
    transform: inherit;
  }
`;

const ShowProductBases = () => {
  const [{ campaign, sellerId }, dispatch] = useAppValue();
  const router = useRouter();
  const id = get(router, "query.id", null);
  const { productBases, productInput } = campaign;
  const [filter, setFilter] = useState({
    search: null,
    pageSize: 400,
    page: 1,
    fulfillmentId: null,
    attributes: [],
  });
  const { data: fulfillmentData } = useQuery(FULFILLMENTS, {
    variables: {
      filter: { search: "", page: 1, pageSize: 20, sellerId },
    },
    fetchPolicy: "network-only",
  });
  const { data, loading } = useQuery(productBase, {
    variables: {
      filter: {
        ...filter,
        attributes: campaign.productBases.length
          ? campaign.productBases[0].attributes?.map((el) => el.slug)
          : null,
        sellerId,
      },
    },
    fetchPolicy: "no-cache",
  });

  const onChangeFilter = (valuesChange, values) => {
    setFilter({
      ...filter,
      ...valuesChange,
    });
  };
  const fulfillments = fulfillmentData?.fulfillments;
  const bases = data?.productBases?.hits;

  const makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const newVariantAttributes = (variants) => {
    const allVariants = variants;
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
        if (attributeChecked) {
          init[key].push({
            ...el,
            checked: !!attributeChecked,
          });
        }
        return init;
      }, {});
      return variantAttributes;
    }
    return {};
  };

  const getActiveValue = (productBases) => {
    let productBasesNew = cloneDeep(productBases);
    productBasesNew.map((item) => {
      if (item.sku) {
        item.variants = item.variants.filter((variant) => variant.active);
      }
      return item;
    });
    return productBasesNew;
  };

  return (
    <Container>
      <h3 className="p-15">Product bases</h3>
      <Divider type="horizontal" />
      <Form onValuesChange={debounce(onChangeFilter, 300)}>
        <div className="base-filter-header">
          <Form.Item name="fulfillmentId">
            <Select value={filter.fulfillmentId} placeholder="Fulfillment">
              <Select.Option value={null}>All</Select.Option>
              {fulfillments?.map((fulfill) => (
                <Select.Option key={fulfill.id} value={fulfill.id}>
                  {fulfill.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item initialValue={filter.search ?? ""} name="search">
            <Input.Search placeholder="Search product base..." />
          </Form.Item>
        </div>
      </Form>
      <Divider type="horizontal" />
      {loading ? (
        <CustomizeLoadingCard times={3} height={300} />
      ) : !bases?.length ? (
        <EmptyData />
      ) : (
        <div className="productbases mt-15 ml-15">
          <Scrollbars
            style={{
              width: "auto",
              height: `calc(100vh - ${productInput ? "195px" : "135px"})`,
            }}
          >
            {bases?.map((base) => (
              <div key={base.id} className="mb-15 mr-15">
                <Card
                  cover={
                    <img
                      style={{
                        height: "100%",
                        objectFit: "contain",
                        borderRight: "1px solid #e6e6e6",
                      }}
                      alt="example"
                      src={
                        base.image
                          ? `${process.env.CDN_URL}/300x300/${base.image.key}`
                          : "/no-preview.jpg"
                      }
                    />
                  }
                >
                  <Meta
                    title={<Tooltip title={base.title}>{base.title}</Tooltip>}
                  />
                  <div className="pt-15">
                    {map(newVariantAttributes(base.variants), (item, key) => (
                      <div key={key} className="flex">
                        <strong style={{ marginRight: 10 }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>
                        <div>
                          {key.toLowerCase() === "color" ||
                          key.toLowerCase() === "color" ? (
                            <div>
                              {item.map((el) => (
                                <ColorsComponent
                                  fulfillmentSlug={
                                    base?.fulfillment?.type == "Custom"
                                      ? null
                                      : base?.fulfillment?.slug
                                  }
                                  fulfillmentId={base?.fulfillment?.id}
                                  key={el.value}
                                  value={el.value}
                                />
                              ))}
                            </div>
                          ) : (
                            item.map((el) => el.value).join(", ")
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      className="mt-15"
                      disabled={
                        findIndex(
                          productBases,
                          (product) => product.id === base.id
                        ) !== -1
                      }
                      onClick={() => {
                        const newproductBases = getActiveValue(
                          productBases && productBases.length
                            ? [...productBases, base]
                            : [base]
                        );
                        dispatch({
                          type: CAMPAIGN.SET,
                          payload: {
                            campaign: {
                              ...campaign,
                              productBases: newproductBases,
                              productInput:
                                id || productInput?.campaignId
                                  ? productInput
                                  : productBases?.length
                                  ? {
                                      ...productBases[0],
                                      excludeMockups: [],
                                      productId: makeid(9),
                                    }
                                  : newproductBases?.length
                                  ? {
                                      ...newproductBases[0],
                                      excludeMockups: [],
                                      productId: makeid(9),
                                    }
                                  : null,
                            },
                          },
                        });
                      }}
                    >
                      Add base
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </Scrollbars>
        </div>
      )}
    </Container>
  );
};

export default ShowProductBases;
