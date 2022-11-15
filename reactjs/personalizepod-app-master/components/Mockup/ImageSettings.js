import { MOCKUP } from "actions";
import { Collapse, Form } from "antd";
import { useAppValue } from "context";
import { useEffect } from "react";
import Slider from "../Konva/Utilities/Slider";

const ImageSettings = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ opacity: 1, ...layer });
  }, [layer.id]);
  const handleValuesChange = (_, values) => {
    dispatch({
      type: MOCKUP.SET_LAYER,
      payload: { ...layer, ...values },
    });
  };
  return (
    <Collapse
      accordion
      defaultActiveKey={"image-settings"}
      style={{ marginTop: 30 }}
    >
      <Collapse.Panel header="Image Settings" key="image-settings">
        <Form form={form} onValuesChange={handleValuesChange} layout="vertical">
          <Form.Item label="Opacity" name="opacity">
            <Slider step={0.01} max={1} min={0} />
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

export default ImageSettings;
