import React, { useEffect, useState } from "react";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { useQuery } from "@apollo/client";
import { Button, Collapse, Divider, Input, Tag, Form, Radio } from "antd";
import { useRouter } from "next/router";
import { useAppValue } from "context";

const FilterFulfillment = ({ filter, setFilter, form }) => {
  const [{ sellerId }] = useAppValue();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const { data } = useQuery(FULFILLMENTS, {
    variables: {
      search: search,
      sellerId,
    },
  });
  const fulfillments = data?.fulfillments;

  useEffect(() => {
    form.setFieldsValue({
      fulfillmentId: filter.fulfillmentId,
    });
  }, [filter.fulfillmentId]);

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
            <div>Fulfillment</div>
            {selected === false && router?.query?.fulfillmentId?.length ? (
              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Tag>
                  {fulfillments
                    ?.filter((el) =>
                      router?.query?.fulfillmentId.includes(el.id)
                    )
                    .map((base) => base.title)
                    .join()}
                </Tag>
              </div>
            ) : null}
          </div>
        }
      >
        <Input.Search
          placeholder="Filter fulfillment"
          className="mb-10"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Item
          noStyle
          className="scroll-filter"
          initialValue={filter?.fulfillmentId}
          name="fulfillmentId"
        >
          {/* <Checkbox.Group
            // value={filter?.fulfillmentId}
            style={{ width: "100%" }}
          >
            {fulfillments?.map((item) => (
              <div key={item.id}>
                <Checkbox value={item.id}>{item.title}</Checkbox>
              </div>
            ))}
          </Checkbox.Group> */}
          <Radio.Group>
            <Radio value={null}>All</Radio>
            {fulfillments?.map((item) => (
              <Radio value={item.id} key={item.id}>
                {item.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Button
          className="clear-filter-item"
          type="link"
          disabled={router?.query?.fulfillmentId ? false : true}
          onClick={() => {
            setFilter({
              ...filter,
              fulfillmentId: null,
            });
            delete router.query.fulfillmentId;
            router.push(router);
            form.setFieldsValue({
              fulfillmentId: null,
            });
          }}
        >
          Clear
        </Button>
        <Divider />
      </Collapse.Panel>
    </Collapse>
  );
};

export default FilterFulfillment;
