import React, { useState } from "react";
import stores from "graphql/queries/stores";
import { useQuery } from "@apollo/client";
import {
  Button,
  Collapse,
  Divider,
  Input,
  Tag,
  Form,
  Checkbox,
  Radio,
} from "antd";
import { useRouter } from "next/router";
import { useAppValue } from "context";

const FilterCampaignStore = ({ filter, setFilter, form, multiple = true }) => {
  const [{ sellerId }] = useAppValue();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const { data, loading } = useQuery(stores, {
    variables: {
      filter: { search: search, sellerId },
    },
  });
  const store = data?.stores?.hits;
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
            <div>{multiple && store?.length ? "Stores" : "Store"}</div>
            <div
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selected === false && router?.query?.storeIds?.length ? (
                <Tag>
                  {store
                    ?.filter((el) => router?.query?.storeIds?.includes(el.id))
                    .map((st) => st.title)
                    .join()}
                </Tag>
              ) : selected === false && router?.query?.storeId?.length ? (
                <Tag>
                  {store
                    ?.filter((el) => router?.query?.storeId?.includes(el.id))
                    .map((st) => st.title)
                    .join()}
                </Tag>
              ) : null}
            </div>
          </div>
        }
      >
        <Input.Search
          placeholder="Filter store"
          className="mb-10"
          onChange={(e) => setSearch(e.target.value)}
        />
        {multiple && store?.length ? (
          <Form.Item
            noStyle
            className="scroll-filter"
            initialValue={filter?.storeIds}
            name="storeIds"
          >
            <Checkbox.Group style={{ width: "100%" }}>
              {store?.map((item) => (
                <div key={item.id}>
                  <Checkbox value={item.id}>{item.title}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
        ) : (
          <Form.Item
            noStyle
            className="scroll-filter"
            initialValue={filter?.storeId}
            name="storeId"
          >
            <Radio.Group style={{ width: "100%" }}>
              {store?.map((item) => (
                <div key={item.id}>
                  <Radio value={item.id}>{item.title}</Radio>
                </div>
              ))}
            </Radio.Group>
          </Form.Item>
        )}
        <Button
          className="clear-filter-item"
          type="link"
          disabled={
            router?.query?.storeId || router?.query?.storeIds ? false : true
          }
          onClick={() => {
            if (multiple) {
              setFilter({
                ...filter,
                storeIds: null,
              });
              delete router.query.storeIds;
              router.push(router);
              form.setFieldsValue({
                storeIds: null,
              });
            } else {
              setFilter({
                ...filter,
                storeId: null,
              });
              delete router.query.storeId;
              router.push(router);
              form.setFieldsValue({
                storeId: null,
              });
            }
          }}
        >
          Clear
        </Button>
        <Divider />
      </Collapse.Panel>
    </Collapse>
  );
};

export default FilterCampaignStore;
