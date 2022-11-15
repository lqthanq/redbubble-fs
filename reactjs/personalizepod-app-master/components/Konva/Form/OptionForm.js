import React from "react";
import { useAppValue } from "../../../context";
import { get } from "lodash";
import { Button, Form, Input, Radio, Space } from "antd";
import styled from "styled-components";
import { updateLayers } from "../Utilities/helper";
import { useEffect } from "react";
import ImageField from "../Utilities/ImageField";
import { BiPlus } from "react-icons/bi";
import ColorField from "../Utilities/ColorField";
import { FaTimes } from "react-icons/fa";
import { ARTWORK } from "actions";

const Container = styled.div`
  .options-list {
    .option:not(:first-child) {
      .ant-form-item-label {
        opacity: 0;
        height: 0px;
        overlay: hidden;
      }
    }
  }
`;
const OptionForm = ({ layer }) => {
  const [{ workspace }, dispatch] = useAppValue();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(layer);
  }, [layer]);

  const handleOnValuesChange = (_, values) => {
    Object.assign(layer, values);
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: layer, //updateLayers(layers, layer),
    });
  };
  return (
    <Container>
      <Form layout="vertical" form={form} onValuesChange={handleOnValuesChange}>
        <Form.Item label="Label" name="title">
          <Input placeholder="Option" />
        </Form.Item>
        <Form.Item label="Display mode" name="display_mode">
          <Radio.Group>
            <Radio value="dropdown" style={{ display: "block" }}>
              Dropdown
            </Radio>
            <Radio value="button" style={{ display: "block" }}>
              Button
            </Radio>
            <Radio value="image" style={{ display: "block" }}>
              Image switcher
            </Radio>
            <Radio value="color" style={{ display: "block" }}>
              Color switcher
            </Radio>
          </Radio.Group>
        </Form.Item>
        <div className="options-list">
          <Form.List name="options" label="Options">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className="option">
                    <Space align="baseline">
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.label !== curValues.label
                        }
                      >
                        {
                          () => {
                            switch (form.getFieldValue("display_mode")) {
                              case "image":
                                return (
                                  <Form.Item
                                    {...field}
                                    label="Image"
                                    name={[field.name, "image"]}
                                    fieldKey={[field.fieldKey, "image"]}
                                  >
                                    <ImageField />
                                  </Form.Item>
                                );
                              case "color":
                                return (
                                  <Form.Item
                                    {...field}
                                    label="Color"
                                    name={[field.name, "color"]}
                                    fieldKey={[field.fieldKey, "color"]}
                                  >
                                    <ColorField type="sharp" />
                                  </Form.Item>
                                );
                              default:
                                return null;
                            }
                          }

                          // form.getFieldValue("display_mode") === "image" && (
                          //   <Form.Item
                          //     {...field}
                          //     label="Image"
                          //     name={[field.name, "image"]}
                          //     fieldKey={[field.fieldKey, "image"]}
                          //   >
                          //     <ImageField />
                          //   </Form.Item>
                          // )
                        }
                      </Form.Item>
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.label !== curValues.label
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label="Label"
                            name={[field.name, "label"]}
                            fieldKey={[field.fieldKey, "label"]}
                          >
                            <Input size="small" />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.label !== curValues.label
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label="Value"
                            name={[field.name, "value"]}
                            fieldKey={[field.fieldKey, "value"]}
                          >
                            <Input size="small" />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item label={<span></span>}>
                        <FaTimes
                          className="anticon"
                          style={{
                            color: "var(--error-color)",
                            cursor: "pointer",
                          }}
                          onClick={() => remove(field.name)}
                        />
                      </Form.Item>
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    onClick={() => add()}
                    icon={<BiPlus className="anticon" />}
                    type="dashed"
                  >
                    Add
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </Form>
    </Container>
  );
};

export default OptionForm;
