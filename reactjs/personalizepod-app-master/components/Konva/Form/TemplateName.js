import { Form, Input, Modal } from "antd";
import { useAppValue } from "context";
import { get } from "lodash";
import { useEffect } from "react";
import { ARTWORK } from "../../../actions";
const TemplateName = ({ template, onCancel = () => {} }) => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork } = workspace;
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      title: get(artwork, `templates[${template}].title`),
    });
  }, [template]);
  const handleOnChange = (values) => {
    dispatch({
      type: ARTWORK.SET,
      payload: {
        ...artwork,
        templates: artwork.templates.map((tpl, index) =>
          index === template ? { ...tpl, ...values } : tpl
        ),
      },
    });
    onCancel();
  };
  return (
    <Modal
      visible={template !== null}
      onOk={() => form.submit()}
      onCancel={onCancel}
      title="Template title"
    >
      <Form form={form} layout="vertical" onFinish={handleOnChange}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateName;
