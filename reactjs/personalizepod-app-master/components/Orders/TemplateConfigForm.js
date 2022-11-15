import { Button, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { BiMoveVertical } from "react-icons/bi";
import { VscMenu } from "react-icons/vsc";
import styled from "styled-components";
const Container = styled.div`
  td,
  th {
    padding: 10px;
  }
`;
const DragHandle = sortableHandle(() => (
  <Button
    type="link"
    icon={<BiMoveVertical className="cursor-move anticon custom-icon" />}
  />
));
const SortableItem = sortableElement(({ children }) => (
  <tr className="tr-content">{children}</tr>
));
const SortableContainer = sortableContainer(({ children }) => {
  return <Container>{children}</Container>;
});
const TemplateConfigForm = ({
  value,
  exportTemplateColumns,
  onChange = () => {},
}) => {
  const [templateConfigs, setTemplateConfigs] = useState(value || []);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTemplateConfigs(value || []);
    setLoaded(true);
  }, [value]);
  useEffect(() => {
    if (loaded) {
      onChange(templateConfigs);
    }
  }, [loaded, templateConfigs]);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setTemplateConfigs(arrayMove(templateConfigs, oldIndex, newIndex));
  };
  return (
    <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
      <table width="100%">
        <tbody>
          <tr className="tr-header">
            <th style={{ width: "6%", textAlign: "center" }}>
              <VscMenu className="anticon" style={{ fontSize: "large" }} />
            </th>
            <th style={{ width: "29%" }}>Column Name</th>
            <th style={{ width: "29%" }}>Type</th>
            <th style={{ width: "29%" }}>Value</th>
            <th style={{ textAlign: "right", width: "7%" }}>Action</th>
          </tr>
          {templateConfigs?.map((config, index) => (
            <SortableItem index={index} value={config} key={index} id={index}>
              <td style={{ width: "6%", textAlign: "center" }}>
                <DragHandle />
              </td>
              <td style={{ width: "29%" }}>
                <Input
                  style={{ width: "100%" }}
                  placeholder="Name"
                  value={config?.name}
                  onChange={(e) =>
                    setTemplateConfigs(
                      templateConfigs.map((item, id) =>
                        id === index ? { ...item, name: e.target.value } : item
                      )
                    )
                  }
                />
              </td>
              <td style={{ width: "29%" }}>
                <Select
                  style={{ width: "100%" }}
                  value={config.type ? config.type : "defined_value"}
                  onChange={(value) =>
                    setTemplateConfigs(
                      templateConfigs.map((item, id) =>
                        id === index ? { ...item, type: value } : item
                      )
                    )
                  }
                >
                  <Select.Option value="defined_value">
                    Defined Value
                  </Select.Option>
                  <Select.Option value="custom_value">
                    Custom Value
                  </Select.Option>
                </Select>
              </td>
              <td style={{ width: "29%" }}>
                {config.type === "defined_value" ? (
                  <Select
                    style={{ width: "100%" }}
                    value={config?.value}
                    onChange={(value) => {
                      setTemplateConfigs(
                        templateConfigs.map((item, id) =>
                          id === index ? { ...item, value: value } : item
                        )
                      );
                    }}
                  >
                    {exportTemplateColumns?.map((item, index) => (
                      <Select.Option key={item.label} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    style={{ width: "100%" }}
                    value={config?.value}
                    onChange={(e) =>
                      setTemplateConfigs(
                        templateConfigs.map((item, id) =>
                          id === index
                            ? { ...item, value: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                )}
              </td>
              <td style={{ width: "7%", textAlign: "right" }}>
                <Button
                  type="link"
                  onClick={() => {
                    setTemplateConfigs((prevState) => {
                      return prevState.filter((el, i) => i !== index);
                    });
                  }}
                  icon={
                    <AiTwotoneDelete
                      style={{ color: "var(--error-color)" }}
                      className="custom-icon anticon"
                    />
                  }
                />{" "}
              </td>
            </SortableItem>
          ))}
        </tbody>
      </table>
      <div className="mt-15">
        <Button
          onClick={() => {
            setTemplateConfigs([
              ...templateConfigs,
              { name: "", type: "defined_value", value: "" },
            ]);
          }}
        >
          <FaPlusCircle className="custom-icon anticon" />
          Add New Column
        </Button>
      </div>
    </SortableContainer>
  );
};

export default TemplateConfigForm;
