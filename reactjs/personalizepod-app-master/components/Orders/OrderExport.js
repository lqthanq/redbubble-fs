import { Button, Card, Checkbox, Form, notification, Select } from "antd";
import React, { createRef, useState } from "react";
import styled from "styled-components";
import { statusColor } from "./StatusOrder";
import { EXPORT_TEMPLATES } from "graphql/queries/exportTemplates/exportQuery";
import { EXPORT_ORDERS } from "graphql/mutate/order/orderAction";
import { useMutation, useQuery } from "@apollo/client";
const Container = styled.div`
  .ant-card-body {
    padding: 18px;
  }
  .ant-form-item {
    margin-bottom: 18px;
  }
  .ant-card-head {
    padding: 0px 18px;
  }
  width: 340px;
`;
const OrderExport = ({
  selectedRowKeys,
  refetch,
  setSelectedRowKeys,
  exportAny,
  filter,
}) => {
  const [form] = Form.useForm();
  const [selectStatus, setSelectStatus] = useState(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState();
  const { data } = useQuery(EXPORT_TEMPLATES);
  const templates = data?.exportTemplates;
  const [ExportOrder, { loading }] = useMutation(EXPORT_ORDERS);
  const onExport = (values) => {
    if (exportAny) {
      ExportOrder({
        variables: {
          input: {
            ...values,
            type: "",
            isChangeStatus: checked,
            orderFilter: filter,
          },
        },
      })
        .then((res) => {
          refetch();
          if (res) {
            window.location = res.data.exportOrders;
          }
          form.resetFields();
          setSelectedRowKeys([]);
        })
        .catch((err) => {
          setError(err.message);
          if (err.message === "Status is required") {
            notification.error({
              message: "Status is required. Please select status.",
            });
          } else {
            notification.error({ message: err.message });
          }
        });
    } else {
      ExportOrder({
        variables: {
          input: {
            ...values,
            orderIds: selectedRowKeys,
            type: "",
            isChangeStatus: checked,
          },
        },
      })
        .then((res) => {
          refetch();
          if (res) {
            window.location = res.data.exportOrders;
          }
          form.resetFields();
          setSelectedRowKeys([]);
        })
        .catch((err) => {
          setError(err.message);
          if (err.message === "Status is required") {
            notification.error({
              message: "Status is required. Please select status.",
            });
          } else {
            notification.error({ message: err.message });
          }
        });
    }
  };
  return (
    <Container>
      <Card title="Export template">
        <Form
          form={form}
          onFinish={onExport}
          layout="vertical"
          name="control-ref"
        >
          {/* <Form.Item label="Type" name="type">
            <Select>
              <Select.Option>For builtin fulfillment service</Select.Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            rules={[{ required: true, message: "Please select template! " }]}
            label="Template"
            name="templateId"
          >
            <Select placeholder="Select template">
              {templates?.map((template) => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            name="isChangeStatus"
            onChange={(e) => {
              setChecked(e.target.checked);
              setError();
            }}
          >
            <Checkbox>Also change order(s) status</Checkbox>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isChangeStatus !== currentValues.isChangeStatus
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue("isChangeStatus") === true ? (
                <Form.Item
                  label="New status"
                  name="status"
                  validateStatus={
                    getFieldValue("isChangeStatus") === true &&
                    selectStatus == null &&
                    error
                      ? "error"
                      : null
                  }
                  help={
                    getFieldValue("isChangeStatus") === true &&
                    selectStatus == null &&
                    error
                      ? "Status is required. Please select status."
                      : null
                  }
                >
                  <Select
                    placeholder="Select status"
                    onChange={(e) => setSelectStatus(e)}
                  >
                    {statusColor
                      ?.filter((el) => el.value !== null)
                      .map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <div className="align-right">
            <Button loading={loading} type="primary" htmlType="submit">
              Export
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default OrderExport;
