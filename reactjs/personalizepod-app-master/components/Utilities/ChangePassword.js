import { Input, Form, Button, notification, message } from "antd";
import React from "react";
import CHANGE_PASSWORD from "../../graphql/mutate/changePassword";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { messageChange, messagePassNotMatch } from "./message";

const ChangePassword = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);
  const router = useRouter();

  return [
    <div>
      <Form
        id="changePass"
        form={form}
        layout="vertical"
        onFinish={(values) => {
          changePassword({ variables: { ...values } })
            .then(() => {
              messageChange("Password");
              router.push("/", "/");
            })
            .catch((err) => {
              if (err.message === "GraphQL error: CURRENT_PASSWORD_NOT_MATCH") {
                messagePassNotMatch("Password");
              } else {
                notification.error({ message: err.message });
              }
            });
        }}
      >
        <Form.Item
          label="Current password"
          name="current_pass"
          rules={[
            { required: true, message: "Please input your current pass!" },
          ]}
        >
          <Input.Password placeholder="************" />
        </Form.Item>
        <Form.Item
          label="New password"
          name="new_pass"
          rules={[{ required: true, message: "Please input your new pass!" }]}
          hasFeedback
        >
          <Input.Password placeholder="************" />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 10 }}
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("new_pass") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="************" />
        </Form.Item>
      </Form>
    </div>,
    { loading },
  ];
};

export default ChangePassword;
