import { Button, Divider } from "antd";
import { useMemo, useState, useEffect } from "react";
import AttributesItem from "./AttributesItem";
import {
  cloneDeep,
  differenceWith,
  find,
  findIndex,
  forEach,
  isBoolean,
  isEqual,
  omit,
} from "lodash";
import styled from "styled-components";
import { useAppValue } from "context";
import { CAMPAIGN } from "actions";

const Container = styled.div`
  .disable-custom {
    .ant-tag-checkable {
      cursor: default;
      &:hover {
        opacity: 1;
      }
    }
    svg {
      cursor: default !important;
    }
  }
`;

const clearAttributeChecked = (attris) => {
  return attris.map((item) => omit(item, ["checked", "disabled"]));
};

const Attributes = ({
  checkEnable,
  attributes,
  showVariant,
  onChange,
  disableOnChange,
}) => {
  const [{ campaign }, dispatch] = useAppValue();
  const { baseSelected, productBases } = campaign;
  const [att, setAtt] = useState(null);
  const [warning, setWarning] = useState(null);

  const allAttributes = useMemo(() => {
    const total = [];
    forEach(attributes, (attr) => {
      attr.forEach((item) => total.push(item));
    });
    return total;
  }, [attributes]);

  useEffect(() => {
    if (attributes) {
      setAtt(attributes);
    }
  }, [attributes]);

  const attName = useMemo(() => {
    return Object.keys(attributes);
  }, [attributes]);

  const handleChangeChecked = (check, item) => {
    let count = attributes[item.slug].filter((el) => el.checked).length;
    if (count === 1 && !check) {
      setWarning(item.slug);
      setTimeout(() => {
        setWarning(null);
      }, 3000);
      return;
    }
    setWarning(null);
    var index = findIndex(att[item.slug], item);
    if (index >= 0) {
      let newAtt = { ...att };
      newAtt[item.slug][index] = { ...item, checked: check };
      setAtt(newAtt);
    }
    onChange(att);
  };

  const attributeBulkAction = (key, enable) => {
    const restAttributes = find(attributes, (_, attriKey) => attriKey !== key);
    const restAttributesAvailable = restAttributes.filter(
      (item) => item.checked
    );
    const firstAttribute = allAttributes.find(
      (item) => item.slug === key && item.checked
    );
    const allAttributeSelected = allAttributes.filter(
      (item) => item.slug === key
    );
    let newBaseVariants = cloneDeep(baseSelected.variants);
    if (enable) {
      newBaseVariants = newBaseVariants.map((variant) => {
        if (
          !differenceWith(
            variant.attributes,
            clearAttributeChecked([
              ...restAttributesAvailable,
              ...allAttributeSelected,
            ]),
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
      type: CAMPAIGN.SET,
      payload: {
        campaign: {
          ...campaign,
          productBases: productBases.map((el) => {
            if (el.id === baseSelected.id) {
              return { ...baseSelected, variants: newBaseVariants };
            } else {
              return el;
            }
          }),
        },
      },
    });
  };

  return att ? (
    <Container>
      <div>
        {attName.map((el) => (
          <div key={el}>
            <div className="flex space-between">
              {el.charAt(0).toUpperCase() + el.slice(1)}:{" "}
              <div hidden={isBoolean(checkEnable)}>
                <a
                  href="/#"
                  type="link"
                  onClick={(e) => {
                    e.preventDefault();
                    attributeBulkAction(el, true);
                  }}
                >
                  Select all
                </a>
                <Divider type="vertical" />
                <a
                  href="/#"
                  type="link"
                  onClick={(e) => {
                    e.preventDefault();
                    attributeBulkAction(el, false);
                  }}
                >
                  Deselect all
                </a>
              </div>
            </div>
            <div className={disableOnChange ? "disable-custom" : null}>
              {att[el]?.map((value) => (
                <AttributesItem
                  disabled={value.disabled}
                  onChange={(e) => {
                    if (!disableOnChange) {
                      handleChangeChecked(e, value);
                    }
                  }}
                  key={value.value}
                  value={value}
                  checkEnable={checkEnable}
                />
              ))}
            </div>
            {warning === el && (
              <p
                style={{
                  color: "var(--error-color)",
                  animation: "fadeOut 2.3s ease-in",
                  animationDelay: "1s",
                  marginBottom: "unset",
                }}
              >
                *At least one variant is selected
              </p>
            )}
          </div>
        ))}
      </div>
      <div hidden={disableOnChange} style={{ textAlign: "right" }}>
        <Button size="small" onClick={() => showVariant()} className="mt-15">
          View variants
        </Button>
      </div>
    </Container>
  ) : null;
};

export default Attributes;
