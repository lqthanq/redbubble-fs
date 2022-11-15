import React from "react";
import _ from "lodash";
import { Avatar, Skeleton, Tag } from "antd";
import { useQuery } from "@apollo/client";
import { COLOR_MANAGEMENT } from "graphql/queries/productBase/colorManagementQuery";
import { useAppValue } from "context";

export const ColorsComponent = ({
  // disabled,
  value,
  checked,
  checkEnable,
  onChange,
  fulfillmentId,
  fulfillmentSlug,
}) => {
  const [{ campaign }] = useAppValue();
  const { baseSelected } = campaign;
  const { data, loading } = useQuery(COLOR_MANAGEMENT, {
    variables: {
      filter: fulfillmentSlug
        ? { pageSize: -1, fulfillmentSlug: [fulfillmentSlug] }
        : fulfillmentId
        ? { pageSize: -1, fulfillmentId: [fulfillmentId] }
        : baseSelected?.fulfillment?.type == "Custom"
        ? { pageSize: -1, fulfillmentId: [baseSelected?.fulfillment?.id] }
        : { pageSize: -1, fulfillmentSlug: [baseSelected?.fulfillment?.slug] },
    },
    skip: !(fulfillmentId || baseSelected?.fulfillment?.id || fulfillmentSlug),
  });

  if (loading) return <Skeleton active="true" />;

  const colorsManagement = data?.colors.hits;

  let currentColor = colorsManagement?.find(
    (el) => el.name.toLowerCase() == value.toLowerCase()
  );

  return (
    <>
      {checkEnable ? (
        <Tag.CheckableTag
          key={currentColor ? `#${currentColor.code}` : value}
          checked={checked}
          onChange={() => onChange(!checked)}
          style={{
            cursor: "pointer",
            border: "1px solid #5c6ac4",
            padding: "2px 10px",
            margin: "5px 6px 5px 0",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <Avatar
            style={{
              boxSizing: "content-box",
              border: "1px solid rgb(74 72 72)",
              marginRight: 5,
              backgroundColor: currentColor
                ? `#${currentColor.code}`
                : "lightgray",
            }}
            size={15}
          />
          {currentColor ? currentColor.name : value}
        </Tag.CheckableTag>
      ) : (
        <Avatar
          key={currentColor ? `#${currentColor.code}` : value}
          style={{
            cursor: checkEnable ? "pointer" : "allowed",
            border: "1px solid var(--primary-color)",
            boxSizing: "content-box",
            marginRight: 5,
            backgroundColor: currentColor
              ? `#${currentColor.code}`
              : "lightgray",
          }}
          size={20}
        />
      )}
    </>
  );
};
