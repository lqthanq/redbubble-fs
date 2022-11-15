import React from "react";
import { InputNumber, Form, Button, Modal } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const QuickEditVariantPrice = (props) => {
  const [form] = Form.useForm();
  const {
    setVariants,
    selectedRowKeys,
    setSelectedRowKeys,
    setBulkEditMode,
    bulkEditMode,
  } = props;

  const handleCancel = () => {
    setBulkEditMode();
  };

  const validatorSalePrice = (value) => {
    return (
      value !== 0 &&
      form.getFieldValue("regularPrice") !== 0 &&
      value <= form.getFieldValue("regularPrice")
    );
  };

  return (
    <Modal
      // className="no-margin-form-item"
      title="Quick Edit Prices"
      visible={bulkEditMode === "editPrice"}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Set Prices
        </Button>,
      ]}
    >
      <Form
        form={form}
        {...layout}
        onFinish={(values) => {
          setVariants((prevState) => {
            return prevState.map((v) => {
              if (selectedRowKeys.includes(v.id)) {
                return {
                  ...v,
                  ...values,
                };
              }
              return v;
            });
          });
          form.resetFields();
          setSelectedRowKeys([]);
          setBulkEditMode();
        }}
        // className="flex"
      >
        <Form.Item
          className="mr-15"
          name="regularPrice"
          label="Regular Price"
          rules={[
            {
              required: true,
              message: "Please input regular price!",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
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
        <Form.Item
          name="salePrice"
          label="Sale Price"
          rules={[
            {
              validator: (_, value) =>
                validatorSalePrice(value)
                  ? Promise.resolve()
                  : Promise.reject(
                      "Sale price has to is equal or smaller than regular!"
                    ),
            },
            {
              required: true,
              message: "Please input sale price!",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
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
      </Form>
    </Modal>
  );
};
export default QuickEditVariantPrice;
