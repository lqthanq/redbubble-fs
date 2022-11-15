import { Form, Input, Button, Alert } from "antd";
import { useMutation } from "@apollo/client";
import loginMutate from "graphql/mutate/login";
import { useEffect, useState } from "react";
import { useAppValue } from "../../context";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import Modal from "antd/lib/modal/Modal";
import { getClient } from "../../lib/apollo";
import styled from "styled-components";
import { messageIncorrect } from "components/Utilities/message";

const Container = styled.div`
  .ant-alert-with-description.ant-alert-no-icon {
    padding: 0px 15px;
    transition: all 0.5s ease;
  }
  @keyframes example {
    from {
      position: absolute;
      top: 0px;
      width: 90%;
    }
    to {
      position: absolute;
      top: 60px;
      width: 90%;
    }
  }
  .item-error {
    margin-bottom: 5px;
  }
`;

const LoginForm = ({
  modal = false,
  visible = false,
  onLogin = () => {},
  onCancel = () => {},
}) => {
  const [{ currentUser }, dispatch] = useAppValue();
  const [form] = Form.useForm();
  const [login, { data, loading }] = useMutation(loginMutate);
  const [textError, setTextError] = useState();

  const onFinish = (values) => {
    login({ variables: values })
      .then(() => {
        getClient().resetStore();
      })
      .catch((err) => setTextError(err.message));
  };

  useEffect(() => {
    if (currentUser) {
      onLogin();
    }
  }, [currentUser]);

  useEffect(() => {
    if (data) {
      dispatch({ type: "login", payload: data.login });
    }
  }, [data]);

  const loginForm = () => {
    return (
      <Container style={{ padding: "0px 24px 20px 24px" }}>
        <Form.Item className="item-error">
          {textError === "incorrect email or password" ? (
            messageIncorrect("email or password")
          ) : textError === "record not found" ? (
            messageIncorrect("email or password")
          ) : textError ? (
            <Alert description={textError} type="error" />
          ) : null}
        </Form.Item>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input
              type="email"
              prefix={<UserOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            name="pass"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
            />
          </Form.Item>
          {!modal && (
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                htmlType="submit"
                loading={loading}
                type="primary"
              >
                Login
              </Button>
            </Form.Item>
          )}
          {modal === true && !currentUser ? null : (
            <div className="inline-grid align-center">
              <Link href="/register" as="/register">
                <a>Create an Account!</a>
              </Link>
              <Link href="/forgot-password" as="/forgot-password">
                <a>Forgot Password?</a>
              </Link>
            </div>
          )}
        </Form>
      </Container>
    );
  };
  return modal ? (
    <Modal
      title="Login"
      okText="Login"
      visible={visible}
      onOk={() => form.submit()}
      okButtonProps={{ loading: loading }}
      onCancel={onCancel}
    >
      {loginForm()}
    </Modal>
  ) : (
    loginForm()
  );
};

export default LoginForm;
