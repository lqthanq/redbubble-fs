import React, { useEffect } from "react";
import { useAppValue } from "context";
import { Form, Input, Radio } from "antd";
import { ARTWORK } from "actions";
const TemplateSettings = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork } = workspace;
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(artwork);
  }, [artwork]);
  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, values) => {
        dispatch({
          type: ARTWORK.SET,
          payload: { ...artwork, ...values },
        });
      }}
    >
      <Form.Item
        label="Select template label"
        name="templateDisplayLabel"
        rules={[{ max: 255 }]}
      >
        <Input disabled={artwork.templates.length === 1} />
      </Form.Item>
      <Form.Item label="Display mode" name="templateDisplayMode">
        <Radio.Group disabled={artwork.templates.length === 1}>
          <Radio value="dropdown" style={{ display: "block" }}>
            Dropdown
          </Radio>
          <Radio value="button" style={{ display: "block" }}>
            Button
          </Radio>
          <Radio value="image" style={{ display: "block" }}>
            Image Selector
          </Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default TemplateSettings;
