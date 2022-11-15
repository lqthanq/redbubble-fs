import { Avatar, Tag } from "antd";
import { ColorsComponent } from "components/Utilities/ColorComponent";

const AttributesItem = ({ disabled, checkEnable = true, value, onChange }) => {
  return value.slug.toLowerCase() == "color" ||
    value.name?.toLowerCase() == "color" ? (
    <ColorsComponent
      value={value.value}
      checked={value.checked}
      checkEnable={checkEnable}
      onChange={(e) => onChange(e)}
      disabled={disabled}
    />
  ) : checkEnable ? (
    <Tag.CheckableTag
      key={value.value}
      checked={value.checked}
      onChange={() => onChange(!value.checked)}
      style={{
        cursor: "pointer",
        border: "1px solid #5c6ac4",
        padding: "2px 10px",
        margin: "5px 6px 5px 0",
        alignItems: "center",
        display: "inline-flex",
      }}
    >
      {value.value}
    </Tag.CheckableTag>
  ) : (
    <Avatar
      key={value.value}
      style={{
        border: `1px solid var(--primary-color)`,
        boxSizing: "content-box",
        marginRight: 5,
      }}
      size={20}
    >
      {value.value}
    </Avatar>
  );
};

export default AttributesItem;
