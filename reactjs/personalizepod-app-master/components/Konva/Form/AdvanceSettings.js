import {
  Button,
  Checkbox,
  Form,
  Card,
  Select,
  Row,
  Col,
  TreeSelect,
} from "antd";
import React, { useMemo } from "react";
import { useAppValue } from "../../../context";
import { get } from "lodash";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";
import LayerOptionField from "./LayerOptionField";
import { ARTWORK } from "actions";

const AdvanceSettings = ({ layer }) => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork, selectedTemplate } = workspace;
  const layers =
    get(artwork, `templates[${selectedTemplate}].layers`, []) || [];
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      condition: {
        action: "show",
        match: "all",
        rules: [{}],
      },
      ...layer,
    });
  }, [layer.id]);

  const handleValuesChange = (_, values) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, ...values },
    });
  };

  const renderTreeNodes = (l) => {
    return (
      <TreeSelect.TreeNode
        value={l.id}
        title={l.personalized?.label || l.title || l.id}
        key={l.id}
        disabled={
          l.id === layer.id ||
          l.type === "Group" ||
          (l.personalized && l.personalized.enable !== true) ||
          l.parent === layer.id
        }
      >
        {Array.isArray(l.layers) && l.layers.map((l) => renderTreeNodes(l))}
      </TreeSelect.TreeNode>
    );
  };

  return (
    <Form form={form} onValuesChange={handleValuesChange}>
      <Form.Item
        label="Enable conditions"
        name={["condition", "enable"]}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      {get(layer, "condition.enable") && (
        <>
          <Row type="flex" align="center" gutter={[10, 0]}>
            <Col span={8}>
              <Form.Item
                name={["condition", "action"]}
                rules={[{ initialValues: "show" }]}
              >
                <Select style={{ width: "100%" }} size="small">
                  <Select.Option value="show">Show</Select.Option>
                  <Select.Option value="hide">Hide</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={16} style={{ paddingTop: 4 }}>
              <span>this field when</span>
            </Col>
          </Row>
          <Row type="flex" align="center" gutter={[10, 0]}>
            <Col span={8}>
              <Form.Item name={["condition", "match"]}>
                <Select style={{ width: "100%" }} size="small">
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="one">One</Select.Option>
                  <Select.Option value="none">None</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={16} style={{ paddingTop: 4 }}>
              <span>of the following rules match</span>
            </Col>
          </Row>
          <Form.List name={["condition", "rules"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    title={`Rule ${index + 1}`}
                    size="small"
                    style={{ marginBottom: 10 }}
                    extra={
                      <FaTimes
                        className="anticon"
                        style={{
                          color: "var(--error-color)",
                          cursor: "pointer",
                        }}
                        onClick={() => remove(field.name)}
                      />
                    }
                  >
                    <Form.Item noStyle shouldUpdate={() => true}>
                      <Form.Item {...field} name={[field.name, "option"]}>
                        <TreeSelect
                          treeDefaultExpandAll
                          onChange={(v) => {
                            var values = form.getFieldsValue();
                            values.condition.rules[index].value = null;
                            form.setFieldsValue(values);
                          }}
                        >
                          {layers.map((l) => renderTreeNodes(l))}
                        </TreeSelect>
                      </Form.Item>
                      <Row gutter={[10, 0]}>
                        <Col span={10}>
                          <Form.Item name={[field.name, "logic"]}>
                            <Select style={{ width: "100%" }} size="small">
                              <Select.Option value="=">Equal to</Select.Option>
                              <Select.Option value="!=">
                                Not equal to
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item name={[field.name, "value"]}>
                            <LayerOptionField
                              layerId={get(
                                form.getFieldsValue(),
                                `condition.rules[${field.name}].option`
                              )}
                            />
                            {/* <Select style={{ width: "100%" }} size="small">
                              {(() => {
                                var option = layers.find(
                                  (l) =>
                                    l.id ===
                                    get(
                                      form.getFieldsValue(),
                                      `condition.rules[${field.name}].option`
                                    )
                                );
                                if (!option)
                                  return (
                                    <Select.Option key="no-val" disabled={true}>
                                      Please select option
                                    </Select.Option>
                                  );
                                return (option.options || []).map((op, idx) => (
                                  <Select.Option value={op.value} key={idx}>
                                    {op.label}
                                  </Select.Option>
                                ));
                              })()}
                            </Select> */}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" size="small" onClick={() => add()}>
                    Add new rule
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </>
      )}
    </Form>
  );
};

export default AdvanceSettings;
