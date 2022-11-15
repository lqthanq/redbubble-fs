import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Form, Input, notification, Switch } from "antd";
import InputNumberBase from "components/ProductBase/InputNumberBase";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import styled from "styled-components";
import ProductBaseMenuEditPrice from "./ProductBaseMenuEditPrice";
import ProductBaseVariantsPriceForm from "./ProductBaseVariantsPriceForm";
import { cloneDeep, debounce, omit, orderBy } from "lodash";
import { BiMoveVertical } from "react-icons/bi";
import { formatNumber } from "components/Utilities/FormatNumber";
import SelectVariantByAttribute from "./SelectVariantByAttribute";
import { useAppValue } from "context";
import _ from "lodash";

const Container = styled.div`
  .bg {
    background-color: white;
    animation-name: example;
    animation-duration: 6s;
  }
  @keyframes example {
    from {
      background-color: #e8e8e8;
    }
    to {
      background-color: #fff;
    }
  }
`;
const DragHandle = sortableHandle(({ setBgColor }) => (
  <Button
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
  return <div>{children}</div>;
});

const JOIN_KEY = " / ";

const getAttributeKey = (attributes) => {
  return orderBy(attributes, ["name"], ["asc"])
    .map((att) => att.value)
    .join(JOIN_KEY);
};

const generateVariants = (arrays) => {
  if (arrays.length === 0) {
    return [];
  }
  let results = [[]];
  arrays.forEach((attribute) => {
    let tmp = [];
    results.forEach((resultItem) => {
      attribute.values.forEach((option) => {
        tmp.push(
          resultItem.concat([
            {
              name: attribute.name,
              value: option,
              slug: attribute.slug,
            },
          ])
        );
      });
    });
    results = tmp;
  });
  return results;
};

const newVariant = (attributes, index) => {
  return {
    attributes,
    regularPrice: 0,
    salePrice: 0,
    cost: 0,
    active: true,
  };
};

const formatVariants = (generate, variants) => {
  let mapping = {};
  variants.forEach((v) => {
    const key = getAttributeKey(v.attributes);
    mapping[key] = v;
  });
  return generate.map((v, index) => {
    const cache = mapping[getAttributeKey(v)];
    if (cache) {
      // get exist old value
      return {
        ...cache,
        attributes: v,
      };
    }
    return newVariant(v, index);
  });
};

const ProductBaseVariants = ({
  attributes,
  showGen,
  setShowGen,
  productBaseImport,
  productBase,
  newVariantAttributes,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkEditMode, setBulkEditMode] = useState();
  const [rowHigh, setRowHeight] = useState();
  const [checkAll, setCheckAll] = useState(false);
  const [checkVariant, setCheckVariant] = useState(false);
  const [bgColor, setBgColor] = useState(null);
  const [{ baseVariants }, dispatch] = useAppValue();
  const [search, setSearch] = useState("");
  const [variantsActive, setVariantsActive] = useState([]);
  const [warning, setWaring] = useState(null);
  const baseFixed =
    productBaseImport || productBase?.fulfillmentType === "Builtin";
  const customWidth = baseFixed ? "16%" : "19%";

  // handle listen when attributes from props is changed
  const setToVariants = (variants) => {
    dispatch({
      type: "changeActiveVariant",
      payload: {
        baseVariants: variants,
      },
    });
  };

  useEffect(() => {
    if (productBase) {
      if (showGen) {
        const variantGen = generateVariants(
          attributes ? attributes.filter((att) => att.values.length) : []
        );
        const newVariants = formatVariants(variantGen, baseVariants);
        setToVariants(newVariants);
        setShowGen(false);
      }
    } else if (!productBase && !productBaseImport) {
      const variantGen = generateVariants(
        attributes ? attributes.filter((att) => att.values.length) : []
      );
      const newVariants = formatVariants(variantGen, baseVariants);
      setToVariants(newVariants);
      setShowGen(false);
    }
  }, [attributes, showGen]);

  useEffect(() => {
    if (baseVariants) {
      setVariantsActive(baseVariants);
    }
  }, [baseVariants]);

  const handleSetChangeValue = (variant, key, v) => {
    let newBaseVariants = cloneDeep(baseVariants);
    newBaseVariants = newBaseVariants.map((s) => {
      if (
        variant.id
          ? s.id === variant.id
          : getAttributeKey(s.attributes) ===
            getAttributeKey(variant.attributes)
      ) {
        return {
          ...s,
          [key]: v,
        };
      }
      return s;
    });
    const count = baseVariants.filter((el) => el.active).length;
    if (count === 1 && !v) {
      setWaring(true);
      setTimeout(() => {
        setWaring(null);
      }, 2000);
      return;
    }
    setToVariants(newBaseVariants);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setToVariants(arrayMove(baseVariants, oldIndex, newIndex));
    setRowHeight(newIndex);
  };

  const onHandleCheck = (value, checked) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, value]);
      if (baseVariants.length === selectedRowKeys.length + 1) {
        setCheckAll(checked);
      }
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((row) => row !== value));
      if (baseVariants.length !== selectedRowKeys.length + 1) {
        setCheckAll(checked);
      }
    }
  };

  const joinAttr = useMemo(() => {
    let results = [].concat.apply(
      [],
      _.map(newVariantAttributes, (item, key) => item)
    );
    return results;
  }, [newVariantAttributes]);

  const availableVariants = useMemo(() => {
    return variantsActive.filter((item) => {
      const attributeLength = Object.getOwnPropertyNames(newVariantAttributes)
        .length;
      const matchAttribute = joinAttr.filter((att) => {
        return attributeLength > 1
          ? _.differenceWith(item.attributes, [omit(att, "checked")], _.isEqual)
              .length === 1
          : !_.differenceWith(
              item.attributes,
              [omit(att, "checked")],
              _.isEqual
            );
      });
      const attributeDisabled = matchAttribute?.some(
        (attr) => attr.checked === false
      );
      return !attributeDisabled;
    });
  }, [variantsActive]);

  const onCheckAllChange = (e) => {
    setSelectedRowKeys(
      e.target.checked
        ? availableVariants
            .filter((el) =>
              getAttributeKey(el.attributes)
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            ?.map((el) => {
              return orderBy(el.attributes, ["name"], ["asc"])
                .map((att) => att.value)
                .join(" / ");
            })
        : []
    );
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (warning) {
      notification.warn({
        message: "At least one variant is active",
      });
    }
  });

  return (
    <div>
      <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
        <div className="flex space-between">
          <ProductBaseMenuEditPrice
            availableVariants={availableVariants}
            productBaseImport={productBaseImport}
            productBase={productBase}
            setCheckAll={setCheckAll}
            selectedRowKeys={selectedRowKeys}
            bulkEditMode={bulkEditMode}
            setBulkEditMode={setBulkEditMode}
            setSelectedRowKeys={setSelectedRowKeys}
            getAttributeKey={getAttributeKey}
          />
          <Input.Search
            placeholder="Search..."
            style={{ width: 300 }}
            onChange={debounce((e) => {
              setSearch(e.target.value);
            })}
          />
        </div>
        <Container>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr className="tr-header">
                <th className="content-son" style={{ width: "6%" }}>
                  <div className="flex item-center">
                    <Checkbox
                      onChange={onCheckAllChange}
                      disabled={variantsActive.length ? false : true}
                      checked={checkAll}
                      style={{ marginRight: 5 }}
                    />
                    <SelectVariantByAttribute
                      getAttributeKey={getAttributeKey}
                      checkVariant={checkVariant}
                      setCheckVariant={setCheckVariant}
                      variants={variantsActive.filter(
                        (el) => el.active === true
                      )}
                      setSelectedRowKeys={setSelectedRowKeys}
                      attributes={
                        productBaseImport
                          ? productBaseImport.attributes
                          : attributes
                      }
                    />
                  </div>
                </th>
                <th className="content-son" style={{ width: "16%" }}>
                  Name
                </th>
                <th
                  className="content-son"
                  style={{
                    width: customWidth,
                  }}
                >
                  Regular Price
                </th>
                <th
                  className="content-son"
                  style={{
                    width: customWidth,
                  }}
                >
                  Sale Price
                </th>
                <th
                  className="content-son"
                  style={{
                    width: customWidth,
                  }}
                >
                  Base Cost
                </th>
                <th
                  className="content-son"
                  style={{
                    textAlign: baseFixed ? "" : "right",
                    width: baseFixed ? "22%" : "8%",
                  }}
                >
                  {baseFixed ? "Fulfillment id" : "Profit"}
                </th>
                <th
                  className="content-son"
                  style={{ textAlign: "right", width: "13%" }}
                >
                  Action
                </th>
              </tr>
              {availableVariants
                .filter((el) =>
                  getAttributeKey(el.attributes)
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((variant, index) => (
                  <SortableItem
                    key={index}
                    index={index}
                    value={variant}
                    rowHigh={rowHigh}
                    id={index}
                    bgColor={bgColor}
                  >
                    <td className="content-son" style={{ width: "6%" }}>
                      <div>
                        <Checkbox.Group
                          value={selectedRowKeys}
                          style={{ width: "100%" }}
                        >
                          <Checkbox
                            onChange={(e) =>
                              onHandleCheck(e.target.value, e.target.checked)
                            }
                            value={orderBy(
                              variant.attributes,
                              ["name"],
                              ["asc"]
                            )
                              .map((att) => att.value)
                              .join(" / ")}
                          />
                        </Checkbox.Group>
                      </div>
                    </td>
                    <td className="content-son" style={{ width: "16%" }}>
                      <div className="p-name-child" style={{ width: "100%" }}>
                        {variant.attributes?.map((att, id) => {
                          if (id === 0) {
                            return <span key={id}>{att.value}</span>;
                          } else {
                            return <span key={id}> / {att.value}</span>;
                          }
                        })}
                      </div>
                    </td>
                    <td
                      className="content-son"
                      style={{
                        width: customWidth,
                      }}
                    >
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        validateStatus={
                          productBaseImport &&
                          variant.regularPrice < variant.cost
                            ? "error"
                            : ""
                        }
                      >
                        <InputNumberBase
                          width="100%"
                          onChange={debounce((v) => {
                            handleSetChangeValue(variant, "regularPrice", v);
                          }, 100)}
                          value={variant.regularPrice}
                        />
                      </Form.Item>
                      {productBaseImport &&
                      variant.regularPrice < variant.cost ? (
                        <small
                          style={{
                            position: "absolute",
                            color: "var(--error-color)",
                          }}
                        >
                          Regular is bigger base cost
                        </small>
                      ) : (
                        ""
                      )}
                    </td>
                    <td
                      className="content-son"
                      style={{
                        width: customWidth,
                      }}
                    >
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        validateStatus={
                          !productBaseImport &&
                          productBase?.fulfillmentType !== "Builtin" &&
                          variant.salePrice > variant.regularPrice
                            ? "error"
                            : ""
                        }
                      >
                        <InputNumberBase
                          width="100%"
                          onChange={debounce((v) => {
                            handleSetChangeValue(variant, "salePrice", v);
                          }, 100)}
                          value={variant.salePrice}
                        />
                      </Form.Item>
                      {variant.salePrice &&
                      variant.salePrice < variant.cost &&
                      variant.salePrice !== 0 ? (
                        <small
                          style={{
                            position: "absolute",
                            color: "var(--error-color)",
                          }}
                        >
                          Sale price is bigger base cost
                        </small>
                      ) : (
                        ""
                      )}
                      {!productBaseImport &&
                      productBase?.fulfillmentType !== "Builtin" &&
                      variant.salePrice > variant.regularPrice ? (
                        <small
                          style={{
                            position: "absolute",
                            color: "var(--error-color)",
                          }}
                        >
                          Sale price is smaller regular
                        </small>
                      ) : (
                        ""
                      )}
                    </td>
                    <td
                      className="content-son"
                      style={{
                        width: customWidth,
                      }}
                    >
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        validateStatus={
                          !productBaseImport &&
                          productBase?.fulfillmentType !== "Builtin" &&
                          variant.cost > variant.regularPrice
                            ? "error"
                            : ""
                        }
                      >
                        <InputNumberBase
                          width="100%"
                          disabled={baseFixed}
                          onChange={
                            (
                              v //debounce((v) => {
                            ) => handleSetChangeValue(variant, "cost", v)
                            // }, 300)
                          }
                          value={variant.cost}
                        />
                      </Form.Item>
                      {!productBaseImport &&
                      productBase?.fulfillmentType !== "Builtin" &&
                      variant.cost > variant.regularPrice ? (
                        <small
                          style={{
                            position: "absolute",
                            color: "var(--error-color)",
                          }}
                        >
                          Base cost is smaller regular price
                        </small>
                      ) : (
                        ""
                      )}
                    </td>
                    <td
                      className="content-son"
                      style={{
                        width: baseFixed ? "22%" : "8%",
                      }}
                    >
                      {baseFixed ? (
                        <Input
                          disabled={baseFixed}
                          value={variant.fulfillmentProductId}
                        />
                      ) : (
                        <div className="align-right">
                          $
                          {variant.salePrice !== 0 &&
                          variant.salePrice > variant.cost
                            ? formatNumber(variant.salePrice - variant.cost)
                            : formatNumber(variant.regularPrice - variant.cost)}
                        </div>
                      )}
                    </td>

                    <td
                      style={{ width: "13%", textAlign: "right" }}
                      className="action-td"
                    >
                      <Switch
                        size="small"
                        checked={variant.active}
                        onChange={(value) => {
                          handleSetChangeValue(variant, "active", value);
                        }}
                      />
                      <DragHandle setBgColor={setBgColor} />
                    </td>
                  </SortableItem>
                ))}
            </tbody>
          </table>
        </Container>
        <ProductBaseVariantsPriceForm
          productBase={productBase}
          productBaseImport={productBaseImport}
          getAttributeKey={getAttributeKey}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setBulkEditMode={setBulkEditMode}
          bulkEditMode={bulkEditMode}
          setCheckAll={setCheckAll}
        />
      </SortableContainer>
    </div>
  );
};
export default ProductBaseVariants;
