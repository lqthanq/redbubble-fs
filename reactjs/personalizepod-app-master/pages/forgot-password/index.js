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
import forgotPassword from "graphql/mutate/forgotPassword";
import { useMutation } from "@apollo/client";
import { BiMailSend } from "react-icons/bi";
import Link from "next/link";

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
  const [send, setSend] = useState(false);
  const [ForgotPassword, { loading }] = useMutation(forgotPassword);
  return (
    <Container>
      <Card bodyStyle={{ padding: 0 }}>
        <Row type="flex">
          <Col
            span={0}
            md={12}
            style={{
              backgroundImage: `url(https://img.freepik.com/free-photo/colorful-tasty-citrus-fruits-isolated-pink-background-vitamin-c-energy-part-healthy-diet_110539-144.jpg?size=626&ext=jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          />
          <Col span={24} md={12} className="register-right">
            <div className="p-header">
              <PageHeader title="Forgot Your Password!" />
            </div>
            {!send ? (
              <Form
                layout="vertical"
                style={{ width: "100%", padding: "0px 30px" }}
                form={form}
                onFinish={(values) => {
                  ForgotPassword({
                    variables: {
                      email: values.email,
                    },
                  })
                    .then(() => {
                      setSend(true);
                    })
                    .catch((err) => {
                      notification.error({ message: err.message });
                    });
                }}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Please input email!" }]}
                >
                  <Input type="email" placeholder="Email" />
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
            ) : (
              <div style={{ height: 130.5, width: "100%", padding: "0 30px" }}>
                <BiMailSend style={{ fontSize: 50 }} />
                <p>
                  We've sent password reset instructions to your email address.
                  If not received, please check your spam folders.
                </p>
              </div>
            )}
            <div className="inline-grid ">
              <Link href="/" as="/">
                <a>Already have an account? Login!</a>
              </Link>
              <Link href="/register" as="/register">
                <a>Create an Account!</a>
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
