import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Button,
  Select,
  AutoComplete,
  Tag,
  Avatar,
  TreeSelect,
  notification,
  Divider,
} from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { VscSync } from "react-icons/vsc";
import styled from "styled-components";
import { BiMoveVertical } from "react-icons/bi";
import { useAppValue } from "context";
import {
  cloneDeep,
  differenceWith,
  forEach,
  isEqual,
  omit,
  reduce,
} from "lodash";
import _ from "lodash";
import AddSelectColor from "./AddSelectColor";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  .bg {
    background-color: #fff;
    animation-name: example;
    animation-duration: 4s;
  }

  @keyframes example {
    from {
      background-color: #e8e8e8;
    }
    to {
      background-color: #fff;
    }
  }
  .checked-tag {
    cursor: pointer;
    background: #5c6ac4;
    color: #fff;
  }
  .ant-collapse-header {
    padding: 0px !important;
  }
  .ant-collapse-content-box {
    padding: 0px !important;
  }
`;

const DragHandle = sortableHandle(({ setBgColor }) => (
  <Button
    style={{ padding: 0 }}
    type="link"
    onMouseDown={() => {
      setBgColor("bg");
      setTimeout(() => {
        setBgColor(null);
      }, 4000);
    }}
    icon={<BiMoveVertical className="cursor-move anticon custom-icon" />}
  />
));

const SortableItem = sortableElement(({ children }) => (
  <tr className="tr-content">{children}</tr>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <Container>{children}</Container>;
});

const clearAttributeChecked = (attris) => {
  return attris.map((item) => omit(item, "checked"));
};

const ProductBaseAttribute = ({
  value,
  onChange = () => {},
  setShowGen,
  toSlug,
  productBase,
  isUsed,
  productBaseImport,
  dataColors,
  fulfillmentSelected,
  refetch,
  newVariantAttributes,
}) => {
  const [attributes, setAttributes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [rowHigh, setRowHigh] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [warning, setWarning] = useState(null);
  const [{ baseVariants }, dispatch] = useAppValue();

  useEffect(() => {
    setAttributes(value || []);
    setLoaded(true);
  }, [value]);

  useEffect(() => {
    if (loaded) {
      onChange(attributes);
    }
  }, [attributes, loaded]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setAttributes(arrayMove(attributes, oldIndex, newIndex));
    setRowHigh(newIndex);
  };

  const optionsName = [
    { value: "Size" },
    { value: "Color" },
    { value: "Style" },
    { value: "Title" },
    { value: "Material" },
  ];

  const allAttributes = useMemo(() => {
    const total = [];
    forEach(newVariantAttributes, (attr) => {
      attr.forEach((item) => total.push(item));
    });
    return total;
  }, [newVariantAttributes]);

  const attributeBulkAction = (key, enable) => {
    const restAttributes = _.find(
      newVariantAttributes,
      (_, attriKey) => attriKey !== key
    );
    const restAttributesAvailable = restAttributes?.filter(
      (item) => item.checked
    );
    const firstAttribute = allAttributes.find(
      (item) => item.slug === key && item.checked
    );
    const allAttributeSelected = allAttributes.filter(
      (item) => item.slug === key
    );
    let newBaseVariants = cloneDeep(baseVariants);
    if (enable) {
      newBaseVariants = newBaseVariants.map((variant) => {
        if (
          !differenceWith(
            variant.attributes,
            clearAttributeChecked(
              restAttributesAvailable
                ? [...restAttributesAvailable, ...allAttributeSelected]
                : [...allAttributeSelected]
            ),
            isEqual
          ).length
        ) {
          return { ...variant, active: true };
        }
        return {
          ...variant,
        };
      });
    } else {
      newBaseVariants = newBaseVariants.map((variant) => {
        if (
          !differenceWith(
            variant.attributes,
            clearAttributeChecked([...restAttributesAvailable, firstAttribute]),
            isEqual
          ).length
        ) {
          return { ...variant, active: true };
        }
        return { ...variant, active: false };
      });
    }
    dispatch({
      type: "changeActiveVariant",
      payload: {
        baseVariants: newBaseVariants,
      },
    });
  };

  const changeVariant = (check, attributeKey) => {
    let count = newVariantAttributes[attributeKey.slug]?.filter(
      (el) => el.checked
    ).length;
    if (count === 1 && !check) {
      setWarning(attributeKey.value);
      setTimeout(() => {
        setWarning(null);
      }, 3000);
    } else {
      const restAttributes = reduce(
        newVariantAttributes,
        (init, item, key) => {
          if (key !== attributeKey.slug) {
            return init.concat(item);
          }
          return init;
        },
        []
      );
      const restAttributesAvailable = restAttributes?.filter(
        (item) => item.checked
      );
      let newBaseVariants = baseVariants.map((variant) => {
        if (
          restAttributesAvailable
            ? !differenceWith(
                variant.attributes,
                clearAttributeChecked([
                  ...restAttributesAvailable,
                  attributeKey,
                ]),
                isEqual
              ).length
            : !differenceWith(
                variant.attributes,
                clearAttributeChecked([attributeKey]),
                isEqual
              ).length
        ) {
          return { ...variant, active: check };
        }
        return variant;
      });
      dispatch({
        type: "changeActiveVariant",
        payload: {
          baseVariants: newBaseVariants,
        },
      });
    }
  };

  const getTreeData = (treeData) => {
    return treeData.map((cat) => (
      <TreeSelect.TreeNode
        disabled={cat?.children ? true : false}
        key={cat.id}
        value={cat.title}
        title={cat.title}
      >
        {cat?.children && getTreeData(cat.children)}
      </TreeSelect.TreeNode>
    ));
  };

  const validateAttribute = () => {
    window.alert("Attribute name/slug is unique. Please input again!");
  };

  return (
    <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
      {productBaseImport ||
      productBase?.fulfillmentType === "Builtin" ? null : (
        <div style={{ marginBlock: 15 }}>
          <table width="100%">
            <tbody>
              <tr className="tr-header">
                <th className="content-son" style={{ width: "20%" }}>
                  Name
                </th>
                <th className="content-son" style={{ width: "20%" }}>
                  Slug
                </th>
                <th className="content-son" style={{ width: "50%" }}>
                  Values
                </th>
                <th
                  className="content-son"
                  style={{ textAlign: "right", width: "10%" }}
                >
                  Action
                </th>
              </tr>
              {attributes.map((attr, index) => (
                <SortableItem key={index} index={index} value={attr}>
                  <td className="content-son" style={{ width: "20%" }}>
                    <AutoComplete
                      value={attr.name}
                      onBlur={(e) => {
                        e.preventDefault();
                        const attributesName = attributes.map((item) =>
                          item.name.toLowerCase()
                        );
                        const isDuplicate = attributesName.some(
                          (item, idx) => attributesName.indexOf(item) !== idx
                        );
                        if (isDuplicate) {
                          validateAttribute();
                        }
                      }}
                      onChange={(value) => {
                        setAttributes(
                          attributes.map((item, id) =>
                            id === index
                              ? {
                                  ...item,
                                  name: value,
                                  slug: toSlug(value),
                                }
                              : item
                          )
                        );
                      }}
                      placeholder="Name"
                    >
                      {_.xor(
                        optionsName.map((el) => el.value),
                        attributes.map((item) => item.name)
                      )
                        .filter((i) => i !== "")
                        .map((option) => (
                          <AutoComplete.Option key={option} value={option}>
                            {option}
                          </AutoComplete.Option>
                        ))}
                    </AutoComplete>
                  </td>
                  <td className="content-son" style={{ width: "20%" }}>
                    <Input
                      style={{
                        width: "100%",
                      }}
                      value={attr.slug}
                      placeholder="Slug"
                      disabled={productBase?.isUsed}
                      onChange={(e) => {
                        if (
                          attributes
                            .map((el) => el.slug.toLowerCase())
                            .includes(e.target.value.toLowerCase())
                        ) {
                        } else {
                        }
                        setAttributes(
                          attributes.map((item, id) =>
                            id === index
                              ? {
                                  ...item,
                                  slug: e.target.value.toLowerCase(),
                                }
                              : item
                          )
                        );
                      }}
                    />
                  </td>
                  <td className="content-son" style={{ width: "50%" }}>
                    {attr.slug == "color" ||
                    attr.name.toLowerCase() === "color" ? (
                      <Select
                        allowClear={false}
                        style={{ width: "100%" }}
                        placeholder="Select"
                        value={attr.values}
                        mode="multiple"
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            {fulfillmentSelected.length > 0 ||
                            productBase?.fulfillment?.id ? (
                              <AuthElement name={permissions.ColorAdd}>
                                <Divider style={{ margin: "4px 0" }} />
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    padding: 8,
                                  }}
                                >
                                  <AddSelectColor
                                    productBase={productBase}
                                    refetch={refetch}
                                    fulfillmentSelected={fulfillmentSelected}
                                  />
                                </div>
                              </AuthElement>
                            ) : null}
                          </div>
                        )}
                        onChange={(value) => {
                          if (isUsed) {
                            let canDelete = true;
                            const prevString = attributes[index].values.join(
                              ""
                            );
                            const nextString = value.join("");
                            for (let i = 0; i < prevString.length; i++) {
                              if (
                                !nextString[i] ||
                                prevString[i] !== nextString[i]
                              ) {
                                canDelete = false;
                              }
                              if (!canDelete) {
                                notification.warn({
                                  message:
                                    "Product base has campaign you can not remove exist values!",
                                });
                                return;
                              }
                            }
                          }
                          setAttributes(
                            attributes.map((item, id) =>
                              id === index ? { ...item, values: value } : item
                            )
                          );
                        }}
                      >
                        {fulfillmentSelected.length > 0 ||
                        (productBase && productBase?.fulfillment?.id)
                          ? dataColors?.map((item) => (
                              <Select.Option key={item.id} value={item.name}>
                                {item.name}
                              </Select.Option>
                            ))
                          : null}
                      </Select>
                    ) : (
                      <Select
                        showSearch
                        allowClear={false}
                        tokenSeparators={[","]}
                        style={{ width: "100%" }}
                        placeholder="Select"
                        value={attr.values}
                        mode="tags"
                        onChange={(value) => {
                          if (isUsed) {
                            let canDelete = true;
                            const prevString = attributes[index].values.join(
                              ""
                            );
                            const nextString = value.join("");
                            for (let i = 0; i < prevString.length; i++) {
                              if (
                                !nextString[i] ||
                                prevString[i] !== nextString[i]
                              ) {
                                canDelete = false;
                              }
                              if (!canDelete) {
                                notification.warn({
                                  message:
                                    "Product base has campaign you can not remove exist values!",
                                });
                                return;
                              }
                            }
                          }
                          setAttributes(
                            attributes.map((item, id) =>
                              id === index ? { ...item, values: value } : item
                            )
                          );
                        }}
                      />
                    )}
                    <div>
                      {fulfillmentSelected?.length === 0 &&
                      attr.slug == "color" &&
                      productBase === undefined ? (
                        <small
                          style={{
                            position: "absolute",
                            color: "var(--error-color)",
                          }}
                        >
                          Please select fulfillment first!
                        </small>
                      ) : null}
                    </div>
                  </td>
                  <td style={{ width: "10%", textAlign: "right" }}>
                    <Button
                      disabled={isUsed ? true : false}
                      type="link"
                      onClick={() => {
                        setAttributes((prevState) => {
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
                    <DragHandle setBgColor={setBgColor} />
                  </td>
                </SortableItem>
              ))}
            </tbody>
          </table>
          <div className="flex space-between" style={{ paddingTop: 10 }}>
            <Button
              disabled={productBase?.isUsed}
              onClick={() => {
                setAttributes([
                  ...attributes,
                  {
                    key: count,
                    name: "",
                    slug: "",
                    values: [],
                  },
                ]);
                setCount(count + 1);
              }}
            >
              <FaPlusCircle className="custom-icon anticon" /> Add attribute
            </Button>
            {productBase ? (
              <Button
                style={{ color: "var(--custom-link-color)" }}
                type="link"
                onClick={() => setShowGen(true)}
              >
                <VscSync className="anticon custom-icon" /> Regenerate variants
              </Button>
            ) : null}
          </div>
        </div>
      )}
      <div>
        <h3>Quick active variants</h3>
        {_.map(newVariantAttributes, (item, key) => (
          <div key={key} style={{ marginTop: 5, alignItems: "center" }}>
            <div
              style={{ textTransform: "capitalize" }}
              className="flex space-between"
            >
              {key}:
              <div>
                <a
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    attributeBulkAction(key, true);
                  }}
                >
                  Select all
                </a>
                <Divider type="vertical" />
                <a
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    attributeBulkAction(key, false);
                  }}
                >
                  Deselect all
                </a>
              </div>
            </div>
            {item.map((el) => (
              <Tag.CheckableTag
                key={el.value}
                checked={el.checked}
                onChange={(checked) => {
                  changeVariant(checked, el);
                }}
                style={{
                  cursor: "pointer",
                  border: "1px solid #5c6ac4",
                  padding: "2px 10px",
                  margin: "5px 6px 5px 0",
                  alignItems: "center",
                  display: "inline-flex",
                }}
              >
                {el.slug.toLowerCase() === "color" ? (
                  <Avatar
                    style={{
                      boxSizing: "content-box",
                      border: "1px solid rgb(74 72 72)",
                      marginRight: 5,
                      backgroundColor: dataColors?.find(
                        (e) => e.name.toLowerCase() == el.value?.toLowerCase()
                      )
                        ? `#${
                            dataColors?.find(
                              (e) =>
                                e.name.toLowerCase() == el.value?.toLowerCase()
                            ).code
                          }`
                        : "lightgray",
                    }}
                    size={15}
                  />
                ) : null}
                {el.value}
              </Tag.CheckableTag>
            ))}
            <div style={{ color: "var(--error-color)" }}>
              {item.filter((e) => e.value === warning).length === 1
                ? "At least one variant is selected"
                : null}
            </div>
          </div>
        ))}
      </div>
    </SortableContainer>
  );
};

export default ProductBaseAttribute;
