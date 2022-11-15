import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { AiFillCreditCard } from "react-icons/ai";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
  FaCcVisa,
} from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  .card-detail {
    font-size: 12px;
  }
  .suffix-icon {
    color: rgba(0, 0, 0, 0.27);
  }
  .ant-radio-group {
    .anticon {
      font-size: 25px;
      margin-right: 5px;
    }
  }
  .ant-radio-wrapper {
    display: inline-flex;
    align-items: center;
  }
`;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const PaymentMethod = () => {
  const [form] = Form.useForm();
  const [editPayment, setEditPayment] = useState(false);
  const item = {
    plan: "free",
    paymentMethod: "credit card",
    cardDetail: {},
  };

  useEffect(() => {
    form.setFieldsValue({
      ...item,
    });
  }, [item]);

  return (
    <Container>
      <Card className="padding-card" title="Payment method">
        {item.paymentMethod && !editPayment ? (
          <div>
            <div>
              <div className="cap-text">
                Current payment method: {item.paymentMethod}
              </div>
              <span className="card-detail">
                Card ending in 6868, expires 11/2020
              </span>
            </div>
            <Button className="mt-15" onClick={() => setEditPayment(true)}>
              Update Payment Method
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            {...layout}
            onValuesChange={(vchanges, v) => {
              console.log(vchanges);
              form.setFieldsValue({
                ...v,
                ...vchanges,
              });
            }}
          >
            <Form.Item
              label="Select payment method"
              initialValue={item.paymentMethod ?? "credit card"}
              name="paymentMethod"
            >
              <Radio.Group className="w-100">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Radio value={"credit card"}>
                      <FaCcVisa className="anticon" />
                      <FaCcMastercard className="anticon" />
                      <FaCcStripe className="anticon" />
                    </Radio>
                  </Col>
                  <Col span={12}>
                    <Radio value={"e wallet"}>
                      <FaCcPaypal className="anticon" />
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
            {console.log(form.getFieldsValue().paymentMethod)}
            <Form.List name="method">
              {(fields, { add, remove }) => (
                <>
                  <Form.Item
                    hidden={
                      form.getFieldsValue().paymentMethod !== "credit card"
                    }
                    rules={[
                      {
                        required: true,
                        message: "Enter a valid card number",
                      },
                    ]}
                    label="Card Info"
                    name="cardNumber"
                  >
                    <InputNumber
                      className="w-100"
                      prefix={<AiFillCreditCard />}
                      min={1}
                      placeholder="Card number"
                    />
                  </Form.Item>
                  <Form.Item
                    hidden={
                      form.getFieldsValue().paymentMethod !== "credit card"
                    }
                    rules={[
                      {
                        required: true,
                        message:
                          "Enter your name exactly as it’s written on your card",
                      },
                    ]}
                    label="Cardholder Name"
                    name="cardName"
                  >
                    <Input placeholder="Name in card" />
                  </Form.Item>
                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <Form.Item
                        hidden={
                          form.getFieldsValue().paymentMethod !== "credit card"
                        }
                        rules={[
                          {
                            required: true,
                            message: "Enter a valid card number",
                          },
                        ]}
                        label="Expiration Date"
                        name="expirationDate"
                      >
                        <Input
                          suffix={<span className="suffix-icon">MM/YY</span>}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        hidden={
                          form.getFieldsValue().paymentMethod !== "credit card"
                        }
                        rules={[
                          {
                            required: true,
                            message: "Enter a valid card number",
                          },
                        ]}
                        label="Security code"
                        name="securityCode"
                      >
                        <Input
                          suffix={<span className="suffix-icon">CVC</span>}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
            <Form.Item name="termAccept" valuePropName="checked">
              <Checkbox>
                I have read and accept the terms of use and privacy policy.
              </Checkbox>
            </Form.Item>
            <Button className="w-100" type="primary">
              Save changes
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default PaymentMethod;
