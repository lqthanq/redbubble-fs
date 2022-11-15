import { Button, Form, Popover } from "antd";
import { useAppValue } from "context";
import { debounce } from "lodash";
import Slider from "./Slider";
import { useEffect } from "react";
import { AiOutlineColumnHeight } from "react-icons/ai";
import { ColumnHeightOutlined } from "@ant-design/icons";
import { ARTWORK } from "../../../actions";

const TextSpacing = ({ layer }) => {
  const [form] = Form.useForm();
  const [_, dispatch] = useAppValue();

  useEffect(() => {
    form.setFieldsValue({ rotation: 0, skewX: 0, ...layer });
  }, [layer.id, layer.width, layer.height, layer.rotation, layer.skewX]);

  const onValuesChange = (_, values) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, ...values },
    });
  };

  return (
    <Popover
      forceRender={true}
      placement="bottom"
      content={
        <div style={{ width: 250 }}>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={debounce(onValuesChange, 100)}
          >
            <Form.Item label="Letter" name="letterSpacing">
              <Slider step={0.1} />
            </Form.Item>
            <Form.Item label="Line height" name="lineHeight">
              <Slider step={0.1} max={10} />
            </Form.Item>
          </Form>
        </div>
      }
    >
      <Button type="link" icon={<ColumnHeightOutlined />} />
    </Popover>
  );
};

export default TextSpacing;
