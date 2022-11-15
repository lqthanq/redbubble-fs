import { MOCKUP } from "actions";
import { Button, Collapse, Form, Space, Switch } from "antd";
import MediaSelector from "components/Media/MediaSelector";
import { useAppValue } from "context";
import { useEffect, useState } from "react";
import Slider from "../Konva/Utilities/Slider";

const ImageSettings = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const [form] = Form.useForm();
  const [showUpload, setShowUpload] = useState(false);
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
      <Collapse.Panel header="Printarea Settings" key="image-settings">
        <Form
          form={form}
          onValuesChange={handleValuesChange}
          layout="horizontal"
          labelCol={{ span: 10 }}
          labelAlign="left"
        >
          <Form.Item
            label="Perspective Mode"
            name="perspectiveEnable"
            valuePropName="checked"
          >
            <Switch size="small" />
          </Form.Item>
          <Form.Item
            label="Clipping Mask"
            name="clipping_mask"
            valuePropName="checked"
          >
            <Switch size="small" />
          </Form.Item>
          <Space>
            <Button>Choose a shape</Button>
            <Button onClick={() => setShowUpload(true)}>Upload image</Button>
          </Space>
          <MediaSelector
            onChange={(files) => {
              dispatch({
                type: MOCKUP.SET_LAYER,
                payload: { ...layer, clipmask: files[0] },
              });
            }}
            multiple={false}
            visible={showUpload}
            accept=".png"
            onCancel={() => setShowUpload(false)}
          />
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

export default ImageSettings;
