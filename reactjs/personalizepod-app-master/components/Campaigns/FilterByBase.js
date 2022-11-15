import React, { useState } from "react";
import productBase from "graphql/queries/productBase/productBase";
import { useQuery } from "@apollo/client";
import { Button, Collapse, Divider, Input, Tag, Checkbox } from "antd";
import { useRouter } from "next/router";
import { useAppValue } from "context";

const FilterCampaignBase = ({ filter, setFilter }) => {
  const [search, setSearch] = useState("");
  const [{ sellerId }] = useAppValue();
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const { data } = useQuery(productBase, {
    variables: {
      filter: { search: search, sellerId },
    },
  });
  const productBases = data?.productBases?.hits;
  const onHandleCheck = (value) => {
    filter.productBaseIds = filter.productBaseIds?.length
      ? filter.productBaseIds
      : [];
    var idsBase = value.checked
      ? [...filter.productBaseIds, value.value]
      : filter.productBaseIds.filter((row) => row !== value.value);
    var baseQuery = idsBase?.join(",");
    router.query.productBaseIds = baseQuery;
    if (!router.query.productBaseIds) {
      delete router.query.productBaseIds;
    }
    setFilter({
      ...filter,
      productBaseIds: idsBase.length ? idsBase : null,
    });
    router.push(router);
  };
  return (
    <Collapse
      className="p-collapse-filter"
      expandIconPosition="right"
      bordered={false}
      onChange={(e) => {
        if (e.length === 1) {
          setSelected(true);
        } else {
          setSelected(false);
        }
      }}
    >
      <Collapse.Panel
        header={
          <div>
            <div>Product bases</div>
            {selected === false && router?.query?.productBaseIds?.length ? (
              <div
                style={{
                  // display: "flex",
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Tag>
                  {productBases
                    ?.filter((el) =>
                      router?.query?.productBaseIds.includes(el.id)
                    )
                    .map((base) => base.title)
                    .join(", ")}
                </Tag>
              </div>
            ) : null}
          </div>
        }
      >
        <Input.Search
          placeholder="Filter product bases"
          className="mb-10"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Checkbox.Group
          value={filter?.productBaseIds}
          style={{ width: "100%" }}
        >
          {productBases?.map((item) => (
            <div key={item.id}>
              <Checkbox
                onChange={(e) => onHandleCheck(e.target, item)}
                value={item.id}
              >
                {item.title}
              </Checkbox>
            </div>
          ))}
        </Checkbox.Group>
        <Button
          className="clear-filter-item"
          type="link"
          disabled={router?.query?.productBaseIds ? false : true}
          onClick={() => {
            setFilter({
              ...filter,
              productBaseIds: null,
            });
            delete router.query.productBaseIds;
            router.push(router);
          }}
        >
          Clear
        </Button>
        <Divider />
      </Collapse.Panel>
    </Collapse>
  );
};

export default FilterCampaignBase;
