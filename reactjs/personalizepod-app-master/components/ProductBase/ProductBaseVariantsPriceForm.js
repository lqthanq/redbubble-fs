import React, { useState } from "react";
import { InputNumber, Form, Button, Input, Modal, notification } from "antd";
import { useAppValue } from "context";
import { cloneDeep } from "lodash";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const getBulkModelTitle = (mode) => {
  switch (mode) {
    case "regularPrice":
      return "Regular price";
    case "salePrice":
      return "Sale price";
    case "cost":
      return "Base cost";
    case "fulfillmentProductId":
      return "Fulfillment Product";
    default:
      return "All prices";
  }
};
const ProductBaseVariantsPriceForm = (props) => {
  const [form] = Form.useForm();
  const [{ baseVariants }, dispatch] = useAppValue();
  const {
    getAttributeKey,
    selectedRowKeys,
    setSelectedRowKeys,
    setBulkEditMode,
    bulkEditMode,
    setCheckAll,
    productBaseImport,
    productBase,
  } = props;
  const [regular, setRegular] = useState();
  const [sale, setSale] = useState();
  const [baseCost, setBaseCost] = useState();
  const dispatchVariants = (variants) => {
    dispatch({
      type: "changeActiveVariant",
      payload: {
        baseVariants: variants,
      },
    });
  };
  const handleCancel = (e) => {
    setBulkEditMode();
  };

  const handleChangeVariant = (price) => {
    let newBaseVariants = cloneDeep(baseVariants);
    newBaseVariants = newBaseVariants.map((v) => {
      const originKey = getAttributeKey(v.attributes);
      if (selectedRowKeys.includes(originKey)) {
        return {
          ...v,
          [bulkEditMode?.key]: price,
        };
      }
      return v;
    });
    dispatchVariants(newBaseVariants);
  };
  return (
    bulkEditMode?.key !== "enable" &&
    bulkEditMode?.key !== "disable" && (
      <Modal
        title={getBulkModelTitle(bulkEditMode?.key)}
        visible={!!bulkEditMode}
        onCancel={handleCancel}
        footer={null}
      >
        {(() => {
          switch (bulkEditMode?.key) {
            case "regularPrice":
            case "salePrice":
            case "cost":
              return (
                <Form
                  form={form}
                  {...layout}
                  onFinish={(values) => {
                    const price = values.price;
                    if (price) {
                      handleChangeVariant(price);
                    }
                    form.resetFields();
                    setSelectedRowKeys([]);
                    setBulkEditMode();
                    setCheckAll(false);
                  }}
                >
                  <Form.Item
                    name={"price"}
                    label={getBulkModelTitle(bulkEditMode?.key)}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        form.setFieldsValue({
                          [bulkEditMode?.key]: value,
                        })
                      }
                      min={1}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{ textAlign: "right", marginBottom: 0 }}
                    {...tailLayout}
                  >
                    <Button
                      type="primary"
                      style={{ marginRight: 10 }}
                      htmlType="submit"
                    >
                      OK
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Form.Item>
                </Form>
              );
            case "fulfillmentProductId":
              return (
                <Form
                  form={form}
                  {...layout}
                  onFinish={(values) => {
                    const price = values.price;
                    handleChangeVariant(price);
                    form.resetFields();
                    setSelectedRowKeys([]);
                    setBulkEditMode();
                    setCheckAll(false);
                  }}
                >
                  <Form.Item
                    name={"price"}
                    label={getBulkModelTitle(bulkEditMode?.key)}
                  >
                    <Input placeholder="Fulfillment product" />
                  </Form.Item>
                  <Form.Item
                    style={{ textAlign: "right", marginBottom: 0 }}
                    {...tailLayout}
                  >
                    <Button
                      type="primary"
                      style={{ marginRight: 10 }}
                      htmlType="submit"
                    >
                      OK
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Form.Item>
                </Form>
              );
            default:
              return (
                <Form
                  form={form}
                  {...layout}
                  onFinish={(values) => {
                    if (
                      values?.regularPrice >= values?.salePrice ||
                      values?.salePrice >= values?.cost
                    ) {
                      let newBaseVariants = cloneDeep(baseVariants);
                      newBaseVariants = newBaseVariants.map((v) => {
                        const originKey = getAttributeKey(v.attributes);
                        if (selectedRowKeys.includes(originKey)) {
                          return {
                            ...v,
                            ...values,
                          };
                        }
                        return v;
                      });
                      dispatchVariants(newBaseVariants);
                    } else {
                      if (
                        values?.regularPrice < values?.salePrice ||
                        values?.salePrice < values?.cost
                      ) {
                        notification.error({ message: "Error" });
                      }
                    }
                    form.resetFields();
                    setSelectedRowKeys([]);
                    setBulkEditMode();
                    setCheckAll(false);
                  }}
                >
                  <Form.Item
                    name="regularPrice"
                    label="Regular Price"
                    rules={[
                      { required: true, message: "Please input regular price" },
                    ]}
                    shouldUpdate={(prevValues, currentValues) => {
                      setRegular(prevValues?.regularPrice);
                      setSale(prevValues?.salePrice);
                      setBaseCost(prevValues?.cost);
                    }}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        form.setFieldsValue({
                          regularPrice: value,
                          salePrice: value,
                        });
                      }}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="salePrice"
                    label="Sale Price"
                    validateStatus={sale > regular ? "error" : ""}
                    help={sale > regular ? "Sale price is smaller regular" : ""}
                  >
                    <InputNumber
                      value={regular}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        form.setFieldsValue({
                          salePrice: value,
                        })
                      }
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  {productBaseImport ||
                  productBase?.fulfillmentType === "Builtin" ? null : (
                    <Form.Item
                      className="abc"
                      style={{ marginBottom: 0 }}
                      name="cost"
                      label="Base Cost"
                      rules={[
                        { required: true, message: "Please input base cost" },
                      ]}
                      validateStatus={sale && baseCost > sale ? "error" : ""}
                      help={
                        sale && baseCost > sale ? "Base cost is smaller" : ""
                      }
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          form.setFieldsValue({
                            cost: value,
                          })
                        }
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    style={{ textAlign: "right", marginBottom: 0 }}
                    {...tailLayout}
                  >
                    {productBaseImport ||
                    productBase?.fulfillmentType === "Builtin" ? (
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        htmlType="submit"
                        disabled={
                          regular > sale || regular === sale || regular !== null
                            ? false
                            : true
                        }
                      >
                        OK
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        htmlType="submit"
                        disabled={
                          sale
                            ? regular < sale || sale < baseCost
                            : regular > baseCost
                        }
                      >
                        OK
                      </Button>
                    )}
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Form.Item>
                </Form>
              );
          }
        })()}
      </Modal>
    )
  );
};
export default ProductBaseVariantsPriceForm;
