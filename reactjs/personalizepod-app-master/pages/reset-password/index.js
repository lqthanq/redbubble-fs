import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  PageHeader,
  Row,
  Col,
  notification,
  Card,
} from "antd";
import styled from "styled-components";
import RegisterLayout from "../../layouts/register";
import resetPassByOTT from "graphql/mutate/resetPassByOTT";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";

const Container = styled.div`
  max-width: calc(100vw - 30px);
  width: 1000px;
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
  @media (max-width: 1000px) {
    .p-row {
      .register-left {
        display: none;
      }
    }
  }

  .register-right {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #f9f9f9;
    margin: auto 0;
    width: 100%;
    padding: 42px 0;
    text-align: center;
    .p-header {
      display: inline-block;
    }
  }
`;
const Register = () => {
  const [form] = Form.useForm();
  const [ResetPassByOTT, { loading }] = useMutation(resetPassByOTT);
  const router = useRouter();
  return (
    <Container>
      <Card bodyStyle={{ padding: 0 }}>
        <Row type="flex">
          <Col
            span={0}
            md={12}
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/952357/pexels-photo-952357.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          />
          <Col span={24} md={12} className="register-right">
            <div className="p-header">
              <PageHeader title="Reset Your Password!" />
            </div>
            <Form
              layout="vertical"
              style={{ width: "100%", padding: "0px 30px" }}
              form={form}
              onFinish={(values) => {
                if (values.confirm) {
                  delete values.confirm;
                }
                ResetPassByOTT({
                  variables: {
                    oneTimeToken: router?.query?.token,
                    pass: values.pass,
                  },
                })
                  .then(() => {
                    notification.success({
                      message: "The Password Reset Successfully",
                    });
                    router.push("/", "/");
                  })
                  .catch((err) => {
                    notification.error({ message: err.message });
                  });
              }}
            >
              <Form.Item
                name="pass"
                label="New password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="*************" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["pass"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("pass") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "The two passwords that you entered do not match!"
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="*************" />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};
Register.Layout = RegisterLayout;

export default Register;
