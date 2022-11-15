import { Dropdown, Menu, notification, Radio } from "antd";
import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { useAppValue } from "context";

const ProductBaseMenuEditPrice = ({
  selectedRowKeys,
  bulkEditMode,
  setBulkEditMode,
  setSelectedRowKeys,
  setCheckAll,
  productBaseImport,
  productBase,
  availableVariants,
  getAttributeKey,
}) => {
  const [{ baseVariants }, dispatch] = useAppValue();

  const onhandleClick = (record, e) => {
    if (availableVariants.length === selectedRowKeys.length && !e) {
      notification.warn({
        message: "At least one variant is active",
      });
    } else {
      const newVariants = baseVariants.map((variant) => {
        console.log(
          selectedRowKeys,
          variant.attributes.map((el) => el.value).join(" / ")
        );
        if (
          variant.attributes.map((el) => el.value).join(" / ") === record ||
          selectedRowKeys.includes(getAttributeKey(variant.attributes))
        ) {
          console.log(variant);
          return {
            ...variant,
            active: e,
          };
        }
        return {
          ...variant,
        };
      });
      dispatch({
        type: "changeActiveVariant",
        payload: {
          baseVariants: newVariants,
        },
      });
      setSelectedRowKeys([]);
      setCheckAll(false);
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <Radio.Group disabled={selectedRowKeys.length ? false : true}>
        <Radio.Button value="large">
          {selectedRowKeys.length} variants are selected
        </Radio.Button>
        <Dropdown
          trigger="click"
          overlay={
            <Menu
              value={bulkEditMode}
              onClick={(value) => {
                setBulkEditMode(value);
                switch (value.key) {
                  case "enable":
                    return onhandleClick(selectedRowKeys, true);
                  case "disable":
                    return onhandleClick(selectedRowKeys, false);
                  default:
                    break;
                }
              }}
            >
              <Menu.Item key="allprices">Quick edit prices</Menu.Item>
              <Menu.Item key="regularPrice">Regular price</Menu.Item>
              <Menu.Item key="salePrice">Sale price</Menu.Item>
              {productBaseImport ||
              productBase?.fulfillmentType === "Builtin" ? null : (
                <Menu.Item key="cost">Base cost</Menu.Item>
              )}
              <Menu.Divider />
              <Menu.Item key="enable">Enable</Menu.Item>
              <Menu.Item
                key="disable"
                disabled={
                  availableVariants?.filter((vari) => vari.active === true)
                    .length === 1
                    ? true
                    : false
                }
              >
                Disable
              </Menu.Item>
            </Menu>
          }
        >
          <Radio.Button
            value="large"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Actions <DownOutlined />
          </Radio.Button>
        </Dropdown>
      </Radio.Group>
    </div>
  );
};

export default ProductBaseMenuEditPrice;
