import { Form, InputNumber } from "antd";
import { debounce } from "lodash";
import { useEffect } from "react";
import { ARTWORK } from "../../../actions";
import { useAppValue } from "../../../context";

const FontSize = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(layer);
  }, [layer.id, layer.fontSize]);

  const handleChange = (_, values) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, ...values },
    });
  };

  return (
    <Form form={form} onValuesChange={debounce(handleChange, 100)}>
      <Form.Item name="fontSize" style={{ margin: 0 }}>
        <InputNumber style={{ width: 65 }} disabled={layer.autofit} />
      </Form.Item>
    </Form>
  );
};

export default FontSize;
