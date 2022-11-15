import { Checkbox, Form, Col, Input, Row } from "antd";
import { get, debounce, omit } from "lodash";
import { useAppValue } from "../../../context";
import { updateLayers } from "../Utilities/helper";
import { useEffect } from "react";
import { ARTWORK } from "actions";

const TextForm = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      ...layer,
      ...{
        personalized: {
          enable: false,
          label: layer.title,
          ...(layer.personalized || {}),
        },
      },
    });
  }, [layer]);
  const onValuesChange = (_, values) => {
    Object.assign(layer, omit(values, ["text"]));
    layer.values.forEach((v) => {
      if (v.active) {
        v.text = values.text;
      }
    });
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: layer, //updateLayers(layers, layer),
    });
  };

  return (
    <Form
      form={form}
      initialValues={layer}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      layout="horizontal"
      onValuesChange={debounce(onValuesChange, 200)}
    >
      <Form.Item
        name="text"
        initialValue={layer.values.find((v) => v.active)?.text}
      >
        <Input.TextArea />
      </Form.Item>
      {get(layer, "shape", "normal") === "normal" && (
        <Form.Item
          name="autofit"
          valuePropName="checked"
          label="Auto resize to fit container"
          labelCol={{ span: 21 }}
          wrapperCol={{ span: 3 }}
          labelAlign="left"
          style={{ textAlign: "right" }}
        >
          <Checkbox />
        </Form.Item>
      )}
      <Form.Item
        name={["personalized", "enable"]}
        valuePropName="checked"
        label="Allow personalized"
        labelCol={{ span: 21 }}
        wrapperCol={{ span: 3 }}
        labelAlign="left"
        style={{ textAlign: "right" }}
      >
        <Checkbox />
      </Form.Item>
      {get(layer, "personalized.enable") && (
        <>
          <Form.Item label="Label" name={["personalized", "title"]}>
            <Input size="small" />
          </Form.Item>
          <Form.Item label="Help text" name={["personalized", "help"]}>
            <Input size="small" placeholder="Field description..." />
          </Form.Item>
          <Form.Item label="Placeholder" name={["personalized", "placeholder"]}>
            <Input size="small" />
          </Form.Item>
          <Form.Item label="Default value" name={"text"}>
            <Input size="small" />
          </Form.Item>
          <Form.Item
            name={["personalized", "required"]}
            valuePropName="checked"
            label="Is required"
            labelCol={{ span: 21 }}
            wrapperCol={{ span: 3 }}
            labelAlign="left"
            style={{ textAlign: "right" }}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            name={["personalized", "numberic"]}
            valuePropName="checked"
            label="Is numberic"
            labelCol={{ span: 21 }}
            wrapperCol={{ span: 3 }}
            labelAlign="left"
            style={{ textAlign: "right" }}
          >
            <Checkbox />
          </Form.Item>
          <Row gutter={[10, 0]}>
            <Col span={12}>
              <Form.Item label="Min" name={["personalized", "min"]}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max" name={["personalized", "max"]}>
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

export default TextForm;
