import {
  Button,
  Collapse,
  Divider,
  Form,
  List,
  Popover,
  Select,
  Space,
  Switch,
  Avatar,
  Table,
  Tooltip,
  Skeleton,
} from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { SketchPicker } from "react-color";
import { MOCKUP } from "../../actions";
import { useAppValue } from "../../context";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { cloneDeep, get, isEmpty, isEqual } from "lodash";
import { useQuery } from "@apollo/client";
import { COLOR_MANAGEMENT } from "graphql/queries/productBase/colorManagementQuery";

const ColorPicker = ({ value = "#ffffff", onChange }) => {
  return (
    <Button.Group>
      <Button>{value}</Button>
      <Popover
        placement="bottom"
        content={
          <SketchPicker
            disableAlpha={true}
            color={value}
            onChange={({ hex, rgb: { r, g, b, a } }) => onChange(hex)}
          />
        }
      >
        <Button style={{ backgroundColor: value }}> </Button>
      </Popover>
    </Button.Group>
  );
};

const AttributeOptions = ({ slug, value, onChange }) => {
  const [{ mockupWorkspace, campaign }, dispatch] = useAppValue();
  const { baseSelected } = campaign;
  const [options, setOptions] = useState(Array.isArray(value) ? value : []);
  const { mockup } = mockupWorkspace;
  const { productBase } = mockup;
  useEffect(() => {
    setOptions(Array.isArray(value) ? value : []);
  }, [value]);
  const attribute = productBase.attributes.find((attr) => attr.slug === slug);
  const toggleOption = (option) => {
    var newOptions = [];
    if (options.includes(option)) {
      newOptions = options
        .filter((op) => op !== option)
        .filter((op) => attribute.values.includes(op));
    } else {
      newOptions = [...options, option].filter((op) =>
        attribute.values.includes(op)
      );
    }
    onChange(attribute.values.filter((op) => newOptions.includes(op)));
  };
  if (!attribute) {
    return null;
  }

  const { data, loading } = useQuery(COLOR_MANAGEMENT, {
    variables: {
      filter:
        baseSelected?.fulfillment.type == "Custom"
          ? {
              pageSize: -1,
              fulfillmentId: [baseSelected?.fulfillment?.id],
            }
          : {
              pageSize: -1,
              fulfillmentSlug: [baseSelected?.fulfillment?.slug],
            },
    },
  });

  const attributeBulkAction = (checked) => {
    if (checked) {
      onChange(attribute.values);
    } else {
      onChange([]);
    }
  };

  if (loading) return <Skeleton active="true" />;

  const colorsManagement = data?.colors.hits;

  return (
    <div>
      <div className="flex space-between">
        {attribute?.name}:
        <div>
          <a onClick={() => attributeBulkAction(true)}>Select All</a>
          <Divider type="vertical" />
          <a onClick={() => attributeBulkAction(false)}>Deselect All</a>
        </div>
      </div>
      <div>
        {attribute.slug === "color" ? (
          <>
            {attribute?.values.map((option, index) => {
              var color = colorsManagement?.find(
                (c) => c.name.toLowerCase() === option.toLowerCase()
              );
              return (
                <Tooltip key={index} title={option}>
                  <Avatar
                    key={option}
                    style={{
                      cursor: "pointer",
                      border:
                        "1px solid var(--primary-color)" /*!color
                      ? options.includes(option)
                        ? "2px solid var(--primary-color)"
                        : "none"
                      : "none",*/,
                      boxSizing: "content-box",
                      marginRight: 5,
                      backgroundColor: color ? `#${color.code}` : "lightgray",
                    }}
                    size={32}
                    onClick={() => toggleOption(option)}
                  >
                    {options.includes(option) ? (
                      <CheckOutlined
                        style={{
                          color: `#${color?.code}`,
                          WebkitFilter: "invert(100%)",
                          filter: "invert(100%)",
                        }}
                      />
                    ) : null}
                  </Avatar>
                </Tooltip>
              );
            })}
          </>
        ) : (
          <>
            {attribute?.values.map((option) => (
              <Avatar
                key={option}
                style={{
                  cursor: "pointer",
                  border: options.includes(option)
                    ? "2px solid var(--primary-color)"
                    : "none",
                  boxSizing: "content-box",
                  marginRight: 5,
                }}
                size={32}
                onClick={() => toggleOption(option)}
              >
                {option}
              </Avatar>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const ExcludeVariants = ({ value, onChange }) => {
  const [{ mockupWorkspace }] = useAppValue();
  const [excludes, setExcludes] = useState([]);

  useEffect(() => {
    setExcludes(value || []);
  }, [value]);

  const { mockup } = mockupWorkspace;
  const { productBase } = mockup;
  const attributes = get(mockup, "settings.applyToVariants.attributes", []);
  if (!attributes || attributes.length === 0) {
    return null;
  }

  const generateVariants = (attributes) => {
    if (attributes.length === 0) return [];
    var result = [];
    var attribute = attributes.shift();
    var subvariants = [];
    if (attributes.length > 0) {
      subvariants = generateVariants(attributes);
    }
    attribute.options.forEach((option) => {
      var variant = [
        {
          name: attribute.name,
          option: option,
        },
      ];
      if (subvariants.length > 0) {
        subvariants.forEach((v) => {
          result.push([...variant, ...v]);
        });
      } else {
        result.push(variant);
      }
    });
    return result;
  };
  const variants = generateVariants(
    cloneDeep(attributes.filter((attr) => attr && attr.options))
  );
  if (variants.length === 0) return null;
  const handleChange = (row, status) => {
    if (status) {
      setExcludes(excludes.filter((v) => !isEqual(v, row)));
      onChange(excludes.filter((v) => !isEqual(v, row)));
    } else {
      setExcludes([...excludes, row]);
      onChange([...excludes, row]);
    }
  };
  const columns = [
    ...variants[0].map((attr, index) => ({
      title: productBase.attributes.find(
        (attribute) => attribute.slug === attr.name
      ).name,
      render: (_, record) => record[index].option,
    })),
    {
      title: "",
      width: 50,
      render: (_, row) => (
        <Switch
          size="small"
          checked={!excludes.find((attr) => isEqual(attr, row))}
          onChange={(status) => handleChange(row, status)}
        />
      ),
    },
  ];
  return (
    <div>
      <Table
        style={{ border: "none" }}
        scroll={{ y: "500px" }}
        dataSource={variants}
        columns={columns}
        pagination={false}
        rowKey={(row) => row.map((v) => v.option).join("-")}
        size="small"
      />
      <div
        className="mt-15"
        hidden={
          get(mockup, "settings.applyToVariants.applyTo", "attribute") ===
          "attribute"
        }
      >
        <Button className="mr-15" onClick={() => onChange(variants)}>
          Deactive All
        </Button>
        <Button onClick={() => onChange([])}>Active All</Button>
      </div>
    </div>
  );
};

const Settings = ({ campaignView }) => {
  const [form] = Form.useForm();
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockup, mockupsManage } = mockupWorkspace;

  useEffect(() => {
    form.setFieldsValue({
      changeBgColorByVariantColor: false,
      defaultBgColor: "#ffffff",
      applyToVariants: {
        applyTo: "attribute",
        attributes: [],
      },
      ...mockup.settings,
    });
  }, [mockup]);

  const handleValuesChange = (valuesChange, values) => {
    if (
      values.applyToVariants?.applyTo === valuesChange.applyToVariants?.applyTo
    ) {
      values = {
        ...values,
        applyToVariants: {
          ...values.applyToVariants,
          attributes:
            valuesChange.applyToVariants.applyTo === "variant"
              ? mockup.productBase.attributes.map((item) => {
                  return {
                    name: item.slug,
                    options: item.values,
                  };
                })
              : [],
        },
      };
    }
    let newMockups = cloneDeep(mockupsManage);
    if (!newMockups.length) {
      dispatch({
        type: MOCKUP.SET,
        payload: { ...mockup, settings: values },
      });
    } else {
      newMockups = newMockups.map((item) => {
        if (item.id === mockup.id) {
          dispatch({
            type: MOCKUP.SET,
            payload: {
              ...mockup,
              settings: {
                ...values,
                defaultBgColor: values.defaultBgColor ?? "#ffffff",
                changeBgColorByVariantColor:
                  values.changeBgColorByVariantColor ?? false,
              },
            },
          });
          return {
            ...item,
            settings: {
              ...values,
              defaultBgColor: values.defaultBgColor ?? "#ffffff",
              changeBgColorByVariantColor:
                values.changeBgColorByVariantColor ?? false,
            },
          };
        }
        return { ...item };
      });
      dispatch({
        type: MOCKUP.SET_MOCKUPS,
        payload: newMockups,
      });
    }
  };

  const { productBase } = mockup;

  const mockupSetting = mockup.settings?.applyToVariants;

  return (
    <Form
      form={form}
      initialValues={{ defaultBgColor: "#ffffff" }}
      onValuesChange={handleValuesChange}
    >
      <Collapse defaultActiveKey={["general", "apply-to-variants"]}>
        {(campaignView && mockup.isRender) || !campaignView ? (
          <Collapse.Panel header="General" key="general">
            <Form.Item
              label="Change background with variant color"
              name="changeBgColorByVariantColor"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
            <Form.Item
              hidden={!form.getFieldValue().changeBgColorByVariantColor}
              label="Default background color"
              name="defaultBgColor"
            >
              <ColorPicker />
            </Form.Item>
          </Collapse.Panel>
        ) : null}
        <Collapse.Panel header="Apply to variants" key="apply-to-variants">
          <Form.Item
            label="Apply to"
            name={["applyToVariants", "applyTo"]}
            labelCol={{ span: 6 }}
          >
            <Select>
              <Select.Option value={"attribute"}>Attribute</Select.Option>
              <Select.Option value={"variant"}>Variants</Select.Option>
            </Select>
          </Form.Item>
          <Form.List name={["applyToVariants", "attributes"]} label="Attribute">
            {(fields, { add, remove }) => (
              <Form.Item
                hidden={
                  form.getFieldsValue().applyToVariants?.applyTo !== "attribute"
                }
                label="Attribute"
                labelCol={{ span: 6 }}
              >
                <List>
                  {fields.map((field) => (
                    <List.Item
                      key={field.key}
                      style={{ padding: 0, marginBottom: 10 }}
                    >
                      <Space>
                        <Form.Item {...field} name={[field.name, "name"]}>
                          <Select
                            style={{ width: 150 }}
                            onChange={(e) => {
                              form.setFieldsValue({ applyToVariants: {} });
                            }}
                          >
                            {mockup.productBase.attributes.map((attr) => (
                              <Select.Option
                                key={attr.slug}
                                disabled={(() => {
                                  var usedAttrs = get(
                                    mockup,
                                    "settings.applyToVariants.attributes",
                                    []
                                  ).map((attr) => (attr ? attr.name : null));
                                  return !(
                                    usedAttrs.indexOf(attr.slug) === -1 ||
                                    usedAttrs.indexOf(attr.slug) === field.name
                                  );
                                })()}
                              >
                                {attr.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="link"
                            onClick={() => {
                              var values = form.getFieldsValue();
                              values.applyToVariants.attributes = values.applyToVariants.attributes.filter(
                                (_, index) => index !== field.name
                              );
                              form.setFieldsValue(values);
                              dispatch({
                                type: MOCKUP.SET,
                                payload: { ...mockup, settings: values },
                              });
                            }}
                            icon={<DeleteOutlined />}
                            style={{ color: "var(--error-color)" }}
                          />
                        </Form.Item>
                      </Space>
                    </List.Item>
                  ))}
                  {fields.length < productBase?.attributes?.length && (
                    <List.Item style={{ padding: 0, marginBottom: 10 }}>
                      <Button
                        onClick={() => {
                          if (fields.length < productBase.attributes.length) {
                            add();
                          }
                        }}
                        icon={<PlusCircleOutlined />}
                        type="dashed"
                      >
                        Add
                      </Button>
                    </List.Item>
                  )}
                </List>
              </Form.Item>
            )}
          </Form.List>
          <div
            hidden={
              mockupSetting?.applyTo === "variant" ||
              isEmpty(mockupSetting?.attributes) ||
              !mockupSetting?.attributes.find((item) => item?.name)
            }
          >
            <Divider orientation="left">Attributes</Divider>
            {mockupSetting?.attributes
              .filter((at) => at)
              .map((attr, index) => (
                <Form.Item
                  key={attr.name}
                  name={["applyToVariants", "attributes", index, "options"]}
                >
                  <AttributeOptions slug={attr.name} />
                </Form.Item>
              ))}
          </div>
          <div
            hidden={
              !mockupSetting?.attributes.find(
                (item) => item?.options?.length
              ) || !mockupSetting?.applyTo === "variant"
            }
          >
            <Divider orientation="left">Variants</Divider>
            <Form.Item name={["applyToVariants", "excludes"]}>
              <ExcludeVariants />
            </Form.Item>
          </div>
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
};

export default Settings;
