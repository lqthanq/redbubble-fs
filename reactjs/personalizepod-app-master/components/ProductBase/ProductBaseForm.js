import {
  Form,
  PageHeader,
  Button,
  Row,
  Col,
  Input,
  Card,
  Select,
  Collapse,
} from "antd";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import ProductBaseVariants from "./ProductBaseVariants";
import Editor from "../Utilities/Editor";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import PrintFile from "./PrintFile";
import ProductBaseAttribute from "./ProductBaseAttribute";
import { useRouter } from "next/router";
import ProductBaseMockup from "./ProductBaseMockup";
import _ from "lodash";
import ProductBaseImage from "./ProductBaseImage";
import ProductBaseCategory from "./ProductBaseCategory";
import { COLOR_MANAGEMENT } from "graphql/queries/productBase/colorManagementQuery";
import { useAppValue } from "context";
import { clearTypeName } from "components/Utilities/ClearTypeName";
import { permissions } from "../Utilities/Permissions";
import AuthElement from "components/User/AuthElement";

const Container = styled.div`
  .layout-space-between {
    display: flex;
    flex-wrap: wrap;
  }
  .ant-page-header {
    padding: 18px 0px;
  }
  .mt-24 {
    margin-top: 24px;
  }
`;
const FormProductBase = ({
  productBase,
  onSubmit,
  loading,
  form,
  productBaseImport,
}) => {
  const [{ sellerId }, dispatch] = useAppValue();
  const { data: fulfillment } = useQuery(FULFILLMENTS, {
    variables: {
      type: "Custom",
      sellerId,
    },
    fetchPolicy: "network-only",
  });
  const dataFulfillmentServicesCustom = fulfillment
    ? fulfillment.fulfillments
    : [];
  const router = useRouter();
  const [showGen, setShowGen] = useState(false);
  const [fulfillmentDataColor, setFulfillmentDataColor] = useState([]);
  const [fulfillmentSelected, setFulfillmentSlected] = useState([]);
  const [attributes, setAttributes] = useState(
    productBase ? productBase.attributes : []
  );
  const [{ baseVariants }] = useAppValue();
  const { data: dataColor, refetch } = useQuery(COLOR_MANAGEMENT, {
    variables: {
      filter: {
        pageSize: -1,
        fulfillmentSlug: productBaseImport
          ? [productBaseImport?.fulfillmentSlug]
          : productBase && productBase?.fulfillment?.type == "Custom"
          ? null
          : productBase && productBase?.fulfillment?.type == "BuiltIn"
          ? [productBase?.fulfillment?.slug]
          : null,
        fulfillmentId:
          fulfillmentSelected?.length > 0
            ? [fulfillmentSelected]
            : productBase && productBase?.fulfillment?.type == "Custom"
            ? [productBase?.fulfillment?.id]
            : null,
      },
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const obj = [
        ...new Map(
          data?.colors?.hits
            ?.filter((el) => el?.fulfillment?.type === "Custom")
            .map((item) => [JSON.stringify(item.fulfillment.title), item])
        ).values(),
      ];
      setFulfillmentDataColor(
        obj?.map((fulfill) => {
          if (
            data?.colors?.hits?.filter(
              (el) => el?.fulfillment?.title === fulfill?.fulfillment?.title
            ).length
          ) {
            const a = [];
            a.push(
              ...data?.colors?.hits
                ?.filter(
                  (el) => el?.fulfillment?.title === fulfill?.fulfillment?.title
                )
                .map((i) => {
                  return {
                    title: i.name,
                    id: i.id,
                  };
                })
            );
            return {
              id: fulfill.fulfillment.id,
              title: fulfill.fulfillment.title,
              children: a,
            };
          }
        })
      );
    },
  });

  const resetBaseImport = () =>
    dispatch({
      type: "setProductBaseImport",
      payload: {
        productBaseImport: null,
      },
    });

  const toSlug = (text) => {
    if (!text) {
      return "";
    }
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };
  const newVariantAttributes = useMemo(() => {
    if (baseVariants?.length) {
      let allAttributesFromVariant = _.concat(
        ...baseVariants.map((item) => item.attributes)
      );
      // unique attributes
      allAttributesFromVariant = _.uniqWith(
        allAttributesFromVariant,
        _.isEqual
      );
      const variantAttributes = allAttributesFromVariant.reduce((init, el) => {
        const key = el?.slug;
        if (!init[key]) {
          init[key] = [];
        }
        // get variants with the same attribute
        const variantContainAttributes = baseVariants.filter(
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
  }, [baseVariants]);

  const extraButton = (
    <div>
      <Button
        style={{ marginRight: 15 }}
        onClick={() => {
          form.resetFields();
          router.push("/product-bases");
          resetBaseImport();
        }}
      >
        Cancel
      </Button>
      <AuthElement name={permissions.UpdateProductBase}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Product Base
        </Button>
      </AuthElement>
    </div>
  );

  return (
    <Container
      className="p-form-base"
      style={{ overflow: "hidden", padding: "0 24px" }}
    >
      <Form
        scrollToFirstError={true}
        form={form}
        layout="vertical"
        initialValues={{
          attributes: clearTypeName(productBase?.attributes),
          fulfillmentProductId:
            productBaseImport?.fulfillment?.productTitle === null
              ? productBaseImport?.fulfillment?.productId
              : productBase
              ? productBase?.fulfillmentProductId
              : productBaseImport?.fulfillment?.productTitle,
          designs: clearTypeName(productBase?.designs),
          printAreas: productBaseImport
            ? clearTypeName(productBaseImport.printAreas)
            : clearTypeName(productBase?.printAreas),
          productCatalog: productBase ? productBase.productCatalog : null,
          categoryId: productBase ? productBase.category?.id : null,
          fulfillmentType: productBaseImport
            ? "Builtin"
            : productBase
            ? productBase.fulfillmentType
            : "Custom",
          fulfillmentId: productBase ? productBase?.fulfillment?.id : null,
        }}
        onFinish={(values) => onSubmit(values)}
      >
        <div>
          <PageHeader
            title={productBase ? "Edit product base" : "Add product base"}
            onBack={() => {
              router.back();
              resetBaseImport();
            }}
            extra={[extraButton]}
          />
        </div>
        <div>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={24} md={24} lg={14}>
              <Card>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[
                    { required: true, message: "Please input your Title!" },
                  ]}
                  initialValue={
                    productBaseImport
                      ? productBaseImport?.title
                      : productBase
                      ? productBase.title
                      : null
                  }
                >
                  <Input
                    placeholder="Product base title"
                    onChange={(e) => {
                      if (!productBase) {
                        form.setFieldsValue({
                          sku: toSlug(e.target.value),
                        });
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="sku"
                  label="SKU"
                  initialValue={
                    productBaseImport && productBaseImport?.sku
                      ? productBaseImport?.sku
                      : productBaseImport?.title
                      ? toSlug(productBaseImport?.title)
                      : productBase
                      ? productBase.sku
                      : null
                  }
                  rules={[
                    { required: true, message: "Please input your SKU!" },
                  ]}
                >
                  <Input placeholder="Product base SKU" />
                </Form.Item>
                <Form.Item
                  name="fulfillmentType"
                  label="Fulfillment service type"
                >
                  <Select disabled={true} placeholder="Select a fulfillment">
                    <Select.Option value="Custom">Custom</Select.Option>
                    <Select.Option value="Builtin">Built in</Select.Option>
                  </Select>
                </Form.Item>
                {productBaseImport ||
                productBase?.fulfillmentType === "Builtin" ? (
                  <Form.Item label="Fulfillment service name">
                    <Input
                      value={
                        productBaseImport?.fulfillment?.fulfillmentTitle ||
                        productBase?.fulfillment?.title
                      }
                      disabled={true}
                    />
                  </Form.Item>
                ) : null}
                {productBase?.fulfillmentType === "Builtin" ||
                productBaseImport ? null : (
                  <Form.Item
                    name="fulfillmentId"
                    label="Custom Fulfillment"
                    rules={[
                      {
                        required: true,
                        message: "Please select fulfillment",
                      },
                    ]}
                  >
                    <Select
                      disabled={productBase || productBaseImport ? true : false}
                      placeholder="Select a fulfillment"
                      onChange={(value, a) => {
                        setFulfillmentSlected(value);
                      }}
                    >
                      {dataFulfillmentServicesCustom?.map((el) => (
                        <Select.Option value={el.id} key={el.id}>
                          {el.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
                {productBaseImport || productBase?.fulfillmentProductId ? (
                  <Form.Item
                    label="Fulfillment product Id"
                    name="fulfillmentProductId"
                  >
                    <Input disabled={true} />
                  </Form.Item>
                ) : null}
                <Form.Item
                  name="categoryId"
                  label="Fulfillment service category"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Category!",
                    },
                  ]}
                >
                  <ProductBaseCategory
                    dataFulfillmentServices={dataFulfillmentServicesCustom}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your description!",
                    },
                  ]}
                  initialValue={
                    productBaseImport
                      ? productBaseImport?.description
                      : productBase
                      ? productBase.description
                      : null
                  }
                >
                  <Editor />
                </Form.Item>
              </Card>
              <Card title="Attributes" className="form-base-card mt-24">
                <Form.Item name="attributes">
                  <ProductBaseAttribute
                    newVariantAttributes={newVariantAttributes}
                    refetch={refetch}
                    fulfillmentSelected={fulfillmentSelected}
                    dataFulfillmentServicesCustom={
                      dataFulfillmentServicesCustom
                    }
                    fulfillmentDataColor={fulfillmentDataColor}
                    dataColors={dataColor?.colors?.hits}
                    productBaseImport={productBaseImport}
                    base={true}
                    isUsed={productBase?.isUsed}
                    checkAttributes={clearTypeName(productBase?.attributes)}
                    productBase={productBase}
                    setShowGen={setShowGen}
                    onChange={(v) => setAttributes(v)}
                    toSlug={toSlug}
                  />
                </Form.Item>
              </Card>
              <Collapse
                defaultActiveKey={["variant"]}
                expandIconPosition="right"
                className="mt-24"
              >
                <Collapse.Panel
                  key="variant"
                  header={<h3 style={{ marginBottom: 0 }}>Variants</h3>}
                  style={{ background: "#fff", borderRadius: 4 }}
                >
                  <ProductBaseVariants
                    newVariantAttributes={newVariantAttributes}
                    productBase={productBase}
                    productBaseImport={productBaseImport}
                    setShowGen={setShowGen}
                    showGen={showGen}
                    attributes={attributes}
                  />
                </Collapse.Panel>
              </Collapse>
            </Col>
            <Col span={24} sm={24} md={24} lg={10}>
              <Card title="Print Areas" className="form-base-card">
                <Form.Item name="printAreas">
                  <PrintFile
                    productBase={productBase}
                    productBaseImport={productBaseImport}
                  />
                </Form.Item>
              </Card>
              <Form.Item name="mockups" className="mt-24">
                <ProductBaseMockup productBase={productBase} type="base" />
              </Form.Item>
              <Card title="Image">
                <Form.Item noStyle name="imageId">
                  <ProductBaseImage image={productBase?.image} />
                </Form.Item>
              </Card>
            </Col>
          </Row>
          <Form.Item className="mt-24" style={{ textAlign: "right" }}>
            {extraButton}
          </Form.Item>
        </div>
      </Form>
    </Container>
  );
};
export default FormProductBase;
