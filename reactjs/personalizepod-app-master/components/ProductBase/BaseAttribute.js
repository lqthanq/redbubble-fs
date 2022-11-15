import { Button, Input, Select, Table } from "antd";
import { forwardRef, useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const BaseAttributes = forwardRef((props, ref) => {
  const { color, onChange } = props;
  const initAttributes = props.value ? props.value : [];
  const [attribute, setAttribute] = useState(
    initAttributes.map((i, k) => {
      return { ...i, key: k };
    })
  );
  const [disabledColor, setDisabledColor] = useState(false);
  const [count, setCount] = useState(initAttributes.length);

  useEffect(() => {
    setAttribute((prevState) => {
      return prevState.map((i, k) => {
        if (!i.isCustom) {
          return {
            ...i,
            values: i.values.filter((value) => {
              if (color.find((item) => item.name === value)) return value;
            }),
          };
        } else {
          return i;
        }
      });
    });
  }, [color]);

  useEffect(() => {
    if (onChange) {
      let color = attribute.find((item) => item.name === "color");
      if (color) {
        setDisabledColor(true);
      } else {
        setDisabledColor(false);
      }
      onChange(attribute);
    }
  }, [attribute, onChange]);

  const handleAdd = () => {
    setAttribute((prevState) => {
      return [
        ...prevState,
        {
          key: count,
          name: "",
          values: [],
          isCustom: null,
        },
      ];
    });
    setCount(count + 1);
  };
  const columns = [
    {
      title: "Attribute name",
      key: "isCustom",
      dataIndex: "isCustom",
      width: 200,
      render: (isCustom, record, index) => (
        <div style={{ display: "flex" }}>
          <Select
            style={{ width: isCustom ? "50%" : "100%" }}
            onChange={(e) => {
              setAttribute((prevState) => {
                return prevState.map((s, i) => {
                  if (i === index) {
                    if (e) {
                      return {
                        ...s,
                        isCustom: e,
                        values: [],
                        name: "",
                      };
                    } else {
                      return {
                        ...s,
                        isCustom: e,
                        values: [],
                        name: "color",
                      };
                    }
                  }
                  return s;
                });
              });
            }}
            value={isCustom}
          >
            <Select.Option value={false} disabled={disabledColor}>
              Color
            </Select.Option>
            <Select.Option value={true}>Custom</Select.Option>
          </Select>
          {isCustom && (
            <Input
              style={{ width: "50%", marginLeft: 10 }}
              onChange={(e) => {
                setAttribute((prevState) => {
                  return prevState.map((s, i) => {
                    if (i === index) {
                      return {
                        ...s,
                        name: e.target.value,
                      };
                    }
                    return s;
                  });
                });
              }}
              value={record.name}
              placeholder="Attribute name"
            />
          )}
        </div>
      ),
    },
    {
      title: "Attribute options",
      key: "values",
      dataIndex: "values",
      width: 400,
      render: (values, record, index) => {
        return record.isCustom ? (
          <Select
            style={{ width: "100%" }}
            value={values}
            mode="tags"
            tokenSeparators={[","]}
            onChange={(options) => {
              setAttribute((prevState) => {
                return prevState.map((s, i) => {
                  if (i === index) {
                    return {
                      ...s,
                      values: options,
                    };
                  }
                  return s;
                });
              });
            }}
          />
        ) : (
          <Select
            style={{ width: "100%" }}
            value={values}
            onChange={(options) => {
              setAttribute((prevState) => {
                return prevState.map((s, i) => {
                  if (i === index) {
                    return {
                      ...s,
                      values: options,
                    };
                  }
                  return s;
                });
              });
            }}
            mode="multiple"
          >
            {color?.map((e, key) => (
              <Select.Option value={e.name} key={key}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "",
      width: 100,
      render: (_, record, index) => (
        <Button
          onClick={() => {
            record;
            setAttribute((prevState) => {
              return prevState.filter((item, key) => key !== index);
            });
          }}
          type="link"
          icon={<DeleteOutlined />}
        ></Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={attribute}
        pagination={false}
        rowKey="key"
        footer={() => (
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => handleAdd()}
          >
            Add Attribute
          </Button>
        )}
      />
    </div>
  );
});
BaseAttributes.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default BaseAttributes;
