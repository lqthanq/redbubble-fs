import { Form, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import configApi from "graphql/mutate/configApi";

const APIConfigFulfillment = ({ config, setConfig, refetch }) => {
  const [form] = Form.useForm();
  const [scalablepress, setScalablepress] = useState(false);
  const [ConfigApi, { loading: loadingApiConfig }] = useMutation(configApi);
  const onFinish = (values) => {
    ConfigApi({
      variables: {
        id: config.id,
        ...values,
      },
    })
      .then((res) => {
        refetch();
        form.resetFields();
        notification.success({ message: `Config fulfillment success!` });
        if (config?.slug === "scalablepress") {
          setConfig({ ...config, ...values });
          setScalablepress(true);
        } else {
          setConfig(null);
        }
      })
      .catch((err) => {
        notification.error({ message: err.message });
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      apiKey: config?.api ? config.api : "",
      apiSecret: config?.secret ? config.secret : "",
    });
  }, [config]);
  return [
    <Form
      form={form}
      id="form-api-config"
      layout="vertical"
      onFinish={onFinish}
    >
      {config?.slug === "customcat" ? (
        <Form.Item
          label="API Key"
          name="apiKey"
          initialValue={config?.api ? config.api : ""}
          // rules={[{ required: true, message: "Please input api key?" }]}
        >
          <Input placeholder="Enter your API key" />
        </Form.Item>
      ) : config?.slug === "gearment" ? (
        <div>
          <Form.Item
            label="API Key"
            name="apiKey"
            // rules={[{ required: true, message: "Please input API key?" }]}
            initialValue={config?.api ? config.api : ""}
          >
            <Input placeholder="Enter your API key" />
          </Form.Item>
          <Form.Item
            label="API Signature"
            name="apiSecret"
            initialValue={config?.secret ? config.secret : ""}
            // rules={[{ required: true, message: "Please input API signature?" }]}
          >
            <Input placeholder="Enter your API signature" />
          </Form.Item>
        </div>
      ) : config?.slug === "dreamship" ? (
        <Form.Item
          label="API Key"
          name="apiKey"
          // rules={[{ required: true, message: "Please input API key?" }]}
        >
          <Input placeholder="Enter your API key" />
        </Form.Item>
      ) : config?.slug === "merchize" ? (
        <div>
          <Form.Item
            label="Base URL"
            name="apiKey"
            initialValue={config?.api ? config.api : ""}
            // rules={[{ required: true, message: "Please input base URL?" }]}
          >
            <Input placeholder="Base URL" />
          </Form.Item>
          <Form.Item
            initialValue={config?.secret ? config.secret : ""}
            label="Access Token"
            name="apiSecret"
            // rules={[{ required: true, message: "Please input access token?" }]}
          >
            <Input.TextArea placeholder="Enter merchize access token" />
          </Form.Item>
        </div>
      ) : (
        <div>
          <Form.Item
            label="API Key"
            name="apiKey"
            initialValue={config?.api ? config.api : ""}
            // rules={[{ required: true, message: "Please input API key?" }]}
          >
            <Input placeholder="API key" />
          </Form.Item>
          {scalablepress ||
          (config?.slug === "scalablepress" && config?.api) ? (
            <div>
              Please click link :{" "}
              <a href={`https://scalablepress.com/`}>
                https://scalablepress.com/
              </a>
              . Login if you have an account or register. Finally, input
              "https://fss.niftyjs.com/api/scalablepress-wh" for API webhook
              URL.
            </div>
          ) : null}
        </div>
      )}
    </Form>,
    { loadingApiConfig, form },
  ];
};

export default APIConfigFulfillment;
