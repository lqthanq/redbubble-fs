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
import register from "../../graphql/mutate/register";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { BiMailSend } from "react-icons/bi";
import { messageDuplicateEmail } from "components/Utilities/message";

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
  const [Register, { loading }] = useMutation(register);
  const [done, setDone] = useState(false);

  return (
    <Container>
      <Card bodyStyle={{ padding: 0 }}>
        <Row type="flex">
          <Col
            span={0}
            md={12}
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/405031/pexels-photo-405031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          />
          <Col span={24} md={12} className="register-right">
            <div className="p-header">
              <PageHeader title="Create an Account!" />
            </div>
            {!done ? (
              <Form
                layout="vertical"
                style={{ width: "100%", padding: "0px 30px" }}
                form={form}
                onFinish={(values) => {
                  Register({
                    variables: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      pass: values.pass,
                    },
                  })
                    .then((res) => {
                      if (res) {
                        setDone(true);
                      }
                    })
                    .catch((err) => {
                      if (
                        err.message ===
                        'GraphQL error: ERROR: duplicate key value violates unique constraint "user_email_key" (SQLSTATE 23505)'
                      ) {
                        messageDuplicateEmail("email");
                      } else {
                        notification.error({ message: err.message });
                      }
                    });
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="First name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your first name!",
                        },
                      ]}
                    >
                      <Input placeholder="Frist name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="Last name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your last name!",
                        },
                      ]}
                    >
                      <Input placeholder="Last name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      type: "email",
                      message: "E-mail is not valid!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input type="email" placeholder="Email" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="pass"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password type="password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
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
                            return Promise.reject("Passwords do not match!");
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button
                    style={{ width: "100%" }}
                    htmlType="submit"
                    type="primary"
                    loading={loading}
                  >
                    Register Account
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div
                style={{
                  width: "100%",
                  padding: "0 30px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <BiMailSend style={{ fontSize: 50 }} />
                <p>Register success!</p>
                <p>Please check your e-mail to verify your account!</p>
              </div>
            )}
            <div className="inline-grid ">
              <Link href="/" as="/">
                <a>Already have an account? Login!</a>
              </Link>
              <Link href="/forgot-password" as="/forgot-password">
                <a>Forgot Password?</a>
              </Link>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};
Register.Layout = RegisterLayout;

export default Register;
