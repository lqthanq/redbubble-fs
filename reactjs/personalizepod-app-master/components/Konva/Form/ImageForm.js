import { Form, Input, Checkbox, Radio, Select } from "antd";
import FileField from "../../Media/FileField";
import { debounce, get } from "lodash";
import styled from "styled-components";
import { useAppValue } from "../../../context";
import { useEffect } from "react";
import ImagesField from "./ImagesField";
import ClipartCategorySelector from "components/Clipart/ClipartCategorySelector";
import Cliparts from "./Cliparts";
import { ARTWORK } from "actions";

const Container = styled.div`
  .ant-col {
    &.active {
      img {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 3px;
      }
    }
    .delete {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 15px;
      color: #ff7875;
    }
  }
`;
const ImageForm = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const [form] = Form.useForm();

  const update = (layer) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: layer,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...layer,
      ...{
        personalized: {
          type: "images",
          label: layer.title,
          ...(layer.personalized || {}),
        },
      },
    });
  }, [layer]);

  const onValuesChange = (_, values) => {
    update({
      ...layer,
      ...values,
      personalized: { ...layer.personalized, ...values.personalized },
    });
  };

  return (
    <Container>
      <Form
        form={form}
        onValuesChange={debounce(onValuesChange, 100)}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
      >
        {!get(layer, "personalized.enable") && (
          <Form.Item name={["values", 0, "file"]}>
            <FileField size={64} />
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
            <Form.Item label="Label" name={["personalized", "label"]}>
              <Input />
            </Form.Item>
            <Form.Item label="Help text" name={["personalized", "help"]}>
              <Input size="small" placeholder="Field description..." />
            </Form.Item>
            <Form.Item name={["personalized", "type"]} label="Using value of">
              <Radio.Group>
                <Radio value="clipartCategory" style={{ display: "block" }}>
                  Clipart category
                </Radio>
                <Radio value="images" style={{ display: "block" }}>
                  Upload Images
                </Radio>
              </Radio.Group>
            </Form.Item>
            {get(layer, "personalized.type") === "images" && (
              <Form.Item label="Images" name="values">
                <ImagesField />
              </Form.Item>
            )}
            {get(
              layer,
              "personalized.type",
              form.getFieldValue(["personalized", "type"])
            ) === "clipartCategory" && (
              <>
                <Form.Item
                  label="Choose category"
                  name={["personalized", "clipartCategory"]}
                  wrapperCol={{ span: 24 }}
                >
                  <ClipartCategorySelector />
                </Form.Item>
                <Form.Item
                  name={["personalized", "default"]}
                  label="Cliparts"
                  wrapperCol={{ style: { flex: "0 0 100%" } }}
                >
                  <Cliparts
                    categoryID={get(
                      layer,
                      "personalized.clipartCategory",
                      null
                    )}
                  />
                </Form.Item>
              </>
            )}
          </>
        )}
      </Form>
    </Container>
  );
};

export default ImageForm;
