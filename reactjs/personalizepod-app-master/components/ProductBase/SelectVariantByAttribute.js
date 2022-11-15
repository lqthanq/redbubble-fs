import { Dropdown, Menu } from "antd";
import { concat, orderBy } from "lodash";
import React from "react";
import { AiOutlineDown } from "react-icons/ai";

const SelectVariantByAttribute = ({
  variants,
  setCheckVariant,
  setSelectedRowKeys,
  getAttributeKey,
}) => {
  const handleClick = (e) => {
    setCheckVariant(e.keyPath);
    variants &&
      concat(...variants.map((item) => item.attributes)).reduce((b, c) => {
        if (
          b.filter((item) => item.value === e.key && item.name === c.name)
            .length === 0
        ) {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = variants.filter(
            (key) =>
              key.attributes.filter((item) => item.value === e.key).length > 0
          );
          setSelectedRowKeys(
            newSelectedRowKeys.map((el) => getAttributeKey(el.attributes))
          );
        }
        return orderBy(b, ["name", "value"], ["asc", "asc"]);
      }, []);
  };
  let attributesFromVariant = _.concat(
    ...variants.map((item) => item.attributes)
  );
  const obj = [
    ...new Map(
      attributesFromVariant.map((item) => [JSON.stringify(item.value), item])
    ).values(),
  ];
  return (
    <Dropdown
      overlay={
        <Menu
          style={{ maxHeight: 400, overflow: "auto" }}
          onClick={(e) => handleClick(e)}
        >
          {obj?.map((el, index) => (
            <Menu.Item key={el.value}>
              {el.name}: {el.value}
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <AiOutlineDown className="anticon" />
    </Dropdown>
  );
};

export default SelectVariantByAttribute;
