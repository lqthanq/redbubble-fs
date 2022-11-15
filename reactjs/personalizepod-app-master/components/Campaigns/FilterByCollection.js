import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  Collapse,
  Divider,
  Input,
  Radio,
  Spin,
  Tag,
  Form,
  Checkbox,
} from "antd";
import { useRouter } from "next/router";
import { PRODUCT_COLLECTION } from "graphql/queries/product/products";

const FilterCampaignCollection = ({ filter, setFilter, form }) => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const { data, loading } = useQuery(PRODUCT_COLLECTION, {
    variables: {
      search: search,
    },
  });
  const collections = data?.productCollections;
  const onHandleCheck = (value) => {
    filter.collectionIds = filter.collectionIds?.length
      ? filter.collectionIds
      : [];
    var idsCollec = value.checked
      ? [...filter.collectionIds, value.value]
      : filter.collectionIds.filter((row) => row !== value.value);
    var baseQuery = idsCollec?.join(",");
    router.query.collectionIds = baseQuery;
    if (!router.query.collectionIds) {
      delete router.query.collectionIds;
    }
    setFilter({
      ...filter,
      productBaseIds: idsCollec.length ? idsCollec : null,
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
            <div>Collection</div>
            {selected === false && filter?.collectionIds?.length ? (
              <Tag>
                {collections
                  ?.filter((el) => el.id.includes(filter?.collectionIds))
                  .map((collection) => collection.title)
                  .join()}
              </Tag>
            ) : null}
          </div>
        }
      >
        <Input.Search
          placeholder="Filter collection"
          className="mb-10"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Item
          className="scroll-filter"
          initialValue={
            filter?.collectionIds && filter?.collectionIds.length
              ? filter?.collectionIds[0]
              : null
          }
          name="collectionIds"
        >
          <Checkbox.Group
            value={filter?.collectionIds}
            style={{ width: "100%" }}
          >
            {collections?.map((item) => (
              <div key={item.id} value={item.id}>
                <Checkbox
                  onChange={(e) => onHandleCheck(e.target, item)}
                  value={item.id}
                >
                  {item.title}
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
          {/* <Radio.Group>
            <Radio value={null}>All</Radio>
            {collections?.map((item) => (
              <Radio value={item.id} key={item.id}>
                {item.title}
              </Radio>
            ))}
          </Radio.Group> */}
        </Form.Item>
        <Button
          className="clear-filter-item"
          type="link"
          disabled={router?.query?.collectionIds ? false : true}
          onClick={() => {
            setFilter({
              ...filter,
              collectionIds: [],
            });
            delete router.query.collectionIds;
            router.push(router);
            form.setFieldsValue({
              collectionIds: "",
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

export default FilterCampaignCollection;
