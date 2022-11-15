import React, { useEffect, useState } from "react";
import { Button, Dropdown, InputNumber, Menu, Switch, Table } from "antd";
import { isArray, orderBy, sum } from "lodash";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { BiMoveVertical } from "react-icons/bi";
import { AiFillEye, AiFillEyeInvisible, AiOutlineDown } from "react-icons/ai";
import QuickEditVariantPrice from "./QuickEditVariantPrice";
import { HiTag } from "react-icons/hi";
import ButtonGroup from "antd/lib/button/button-group";

const DragHandle = sortableHandle(() => (
  <Button
    style={{ width: "100%" }}
    type="link"
    icon={<BiMoveVertical className="anticon custom-icon" />}
    onMouseEnter={() => {
      if (document.getElementById("myCheck")) {
        document.getElementById("myCheck").blur();
      }
    }}
  />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const DraggableBodyRow = ({ dataSource, className, style, ...restProps }) => {
  const index = dataSource?.findIndex(
    (x) => x.id === restProps["data-row-key"]
  );
  return <SortableItem index={index} {...restProps} />;
};
const DraggableContainer = (props) => {
  const { onSortEnd } = props;
  return (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
      lockAxis="y"
    />
  );
};

const CampaignVariantVer2 = ({
  selectedRowKeys,
  setSelectedRowKeys,
  variants,
  setVariants,
  setDisabled,
}) => {
  const [bulkEditMode, setBulkEditMode] = useState();

  useEffect(() => {
    let count = variants.filter((el) => el.active === true).length;
    if (count > 0 && !passValidatePrice()) {
      setDisabled(false);
    } else if (passValidatePrice()) {
      setDisabled("price");
    } else {
      setDisabled("count");
    }
  }, [variants]);

  // const disableMultiple = (value) => {
  //   const varriantAvailabled = variants.map((el) => {
  //     const variantActived = find(
  //       productInput?.variants,
  //       (vari) =>
  //         vari.id === el?.id &&
  //         vari.active === true &&
  //         vari.productBaseVariantId
  //     );
  //     if (!variantActived) {
  //       return { ...el, active: value };
  //     }
  //     return { ...el };
  //   });
  //   return varriantAvailabled;
  // };

  // const disableSelectedRowKeys = (value) => {
  //   const varriantAvailabled = variants.map((el) => {
  //     const variantActived = find(
  //       productInput?.variants,
  //       (vari) =>
  //         vari.id === el?.id &&
  //         vari.active === true &&
  //         vari.productBaseVariantId
  //     );
  //     if (!variantActived && selectedRowKeys.includes(el.id)) {
  //       return { ...el, active: value };
  //     }
  //     return { ...el };
  //   });
  //   return varriantAvailabled;
  // };

  const handleSetChangeValue = (record, key, v) => {
    setVariants(
      variants.map((vari) => {
        if (
          isArray(record)
            ? selectedRowKeys.includes(vari.id)
            : vari.id === record?.id
        ) {
          return {
            ...vari,
            [key]: v,
          };
        }
        return vari;
      })
    );

    // if (v === false && record.length) {
    //   setVariants(disableSelectedRowKeys(v, false));
    // } else {
    //   setVariants(
    //     variants.map((vari) => {
    //       if (
    //         record && !record.length
    //           ? vari.id === record?.id
    //           : record.includes(vari.id)
    //       ) {
    //         return {
    //           ...vari,
    //           [key]: v,
    //         };
    //       }
    //       return vari;
    //     })
    //   );
    // }
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setVariants(arrayMove(variants, oldIndex, newIndex));
  };

  const passValidatePrice = () => {
    const errorVariant = variants.find(
      (vari) =>
        (vari.salePrice !== 0 && vari.regularPrice < vari.salePrice) ||
        !vari.regularPrice
    );
    return !!errorVariant;
  };

  const columns = [
    {
      title: "Base Cost",
      className: "drag-visible",
      dataIndex: "cost",
      width: 100,
      key: "cost",
      render: (cost) => `$ ${cost}`,
    },
    {
      title: "Regular Price",
      width: 110,
      className: "drag-visible",
      key: "regularPrice",
      render: (record) => (
        <InputNumber
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          min={1}
          id="myCheck"
          max={10000000}
          onBlur={(e) =>
            handleSetChangeValue(
              record,
              "regularPrice",
              +e.target.value.substr(2)
            )
          }
          defaultValue={record.regularPrice}
        />
      ),
    },
    {
      title: "Sale Price",
      className: "drag-visible",
      width: 100,
      key: "salePrice",
      render: (record) => (
        <InputNumber
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          id="myCheck"
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          min={0}
          onBlur={(e) =>
            handleSetChangeValue(record, "salePrice", +e.target.value.substr(2))
          }
          defaultValue={record.salePrice}
        />
      ),
    },
    {
      title: "Status",
      width: 70,
      className: "drag-visible",
      dataIndex: "active",
      align: "center",
      render: (active, record) => {
        // const campaignPushed = productInput?.campaignStores?.find(
        //   (el) => el.status !== "New"
        // );
        // console.log(productInput);
        // const disableSwitch = find(
        //   productInput?.variants,
        //   (vari) => vari.id === record.id && vari.active === true
        // );
        return (
          <Switch
            // disabled={!!disableSwitch}
            size="small"
            checked={active}
            onChange={(checked) =>
              handleSetChangeValue(record, "active", checked)
            }
          />
        );
      },
    },
    {
      title: "",
      width: 50,
      key: "dragIcon",
      className: "drag-visible",
      render: () => (
        <div>
          <DragHandle />
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selections:
      variants &&
      _.concat(...variants.map((item) => item.attributes)).reduce((b, c) => {
        if (
          b.filter((item) => item.value === c.value && item.name === c.name)
            .length === 0
        ) {
          b.push({
            key: `${c.name} : ${c.value}`,
            value: c.value,
            name: c.name,
            text: `${c.name} : ${c.value}`,
            onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = variants.filter(
                (key) =>
                  key.attributes.filter(
                    (item) => item.value === c.value && item.name === c.name
                  ).length > 0
              );
              setSelectedRowKeys(newSelectedRowKeys.map((el) => el.id));
            },
          });
        }
        return orderBy(b, ["name", "value"], ["asc", "asc"]);
      }, []),
  };

  if (variants && variants[0]?.attributes.length > 0) {
    columns.unshift({
      title: "Variant",
      key: "variant",
      render: (_, record) =>
        record.attributes.map((attribute) => attribute.value).join(" / "),
    });
  }

  const tableWidth = sum(columns.map((c) => c.width));
  return (
    <div>
      <ButtonGroup className="mb-15">
        <Button value="large">
          {selectedRowKeys.length}{" "}
          {selectedRowKeys.length === 1 ? `variant is` : `variants are`}{" "}
          selected
        </Button>
        <Dropdown
          trigger="click"
          overlay={
            <Menu
              value={bulkEditMode}
              onClick={({ key }) => {
                setBulkEditMode(key);
                switch (key) {
                  case "enable":
                    return handleSetChangeValue(
                      selectedRowKeys,
                      "active",
                      true
                    );
                  case "disable":
                    return handleSetChangeValue(
                      selectedRowKeys,
                      "active",
                      false
                    );
                  default:
                    return;
                }
              }}
            >
              <Menu.Item key="enable">
                <AiFillEye className="custom-icon anticon" /> Enable
              </Menu.Item>
              <Menu.Item key="disable">
                <AiFillEyeInvisible className="custom-icon anticon" /> Disable
              </Menu.Item>
              <Menu.Item key="editPrice">
                <HiTag className="custom-icon anticon" /> Quick Edit Prices
              </Menu.Item>
            </Menu>
          }
          disabled={!selectedRowKeys.length}
        >
          <Button type="primary" className="flex item-center" value="large">
            Actions <AiOutlineDown className="ml-15" />
          </Button>
        </Dropdown>
      </ButtonGroup>
      <Table
        size="small"
        rowKey="id"
        scroll={{ x: tableWidth, y: "calc(100vh - 500px)" }}
        pagination={false}
        dataSource={variants}
        columns={columns}
        rowSelection={rowSelection}
        components={{
          body: {
            wrapper: (props) => (
              <DraggableContainer {...props} onSortEnd={onSortEnd} />
            ),
            row: (restProps) => (
              <DraggableBodyRow {...restProps} dataSource={variants} />
            ),
          },
        }}
      />
      <QuickEditVariantPrice
        setVariants={setVariants}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        setBulkEditMode={setBulkEditMode}
        bulkEditMode={bulkEditMode}
      />
    </div>
  );
};

export default CampaignVariantVer2;
