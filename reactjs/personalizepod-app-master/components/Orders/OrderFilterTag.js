import { Tag } from "antd";
import { useRouter } from "next/router";
import React from "react";
import productBase from "graphql/queries/productBase/productBase";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import stores from "graphql/queries/stores";
import { useQuery } from "@apollo/client";

const OrderFilterTag = ({ filter, setFilter, form }) => {
  const variables = {
    filter: {
      pageSize: -1,
    },
  };
  const router = useRouter();
  const { data: dataBase } = useQuery(productBase, {
    variables,
  });
  const { data: dataFulfillments } = useQuery(FULFILLMENTS);
  const { data: dataStore } = useQuery(stores, {
    variables,
  });
  const productBases = dataBase?.productBases?.hits;
  const fulfillments = dataFulfillments?.fulfillments;
  const store = dataStore?.stores?.hits;
  const onCloseTagStatus = () => {
    setFilter({
      ...filter,
      status: null,
    });
    delete router.query?.status;
    router.push(router);
  };
  const onCloseTagBase = () => {
    setFilter({
      ...filter,
      productBaseIds: null,
    });
    delete router.query?.productBaseIds;
    router.push(router);
  };
  const onCloseTagFulfill = () => {
    setFilter({
      ...filter,
      fulfillmentId: null,
    });
    delete router.query?.fulfillmentId;
    router.push(router);
  };
  const onCloseTagStore = () => {
    setFilter({
      ...filter,
      storeIds: null,
    });
    delete router.query?.storeIds;
    router.push(router);
    form.setFieldsValue({
      storeIds: null,
    });
  };
  const onCloseTagSortBy = () => {
    setFilter({
      ...filter,
      sortBy: "title",
    });
    delete router.query?.sortBy;
    router.push(router);
  };
  const getBasesName = () => {
    let total = [];
    total = productBases?.reduce((init, item) => {
      if (filter.productBaseIds?.includes(item.id)) {
        init.push(item.title);
      }
      return init;
    }, []);
    return total;
  };

  return (
    <div>
      {router?.query?.productBaseIds ? (
        <Tag className="tag-filter-campaign" closable onClose={onCloseTagBase}>
          Product base: {getBasesName()?.join(", ")}
        </Tag>
      ) : null}
      {router?.query?.fulfillmentId ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagFulfill}
        >
          Fulfillment:{" "}
          {fulfillments
            ?.filter((el) => el.id.includes(router?.query?.fulfillmentId))
            .map((col) => col.title)
            .join()}
        </Tag>
      ) : null}
      {router?.query?.storeIds ? (
        <Tag className="tag-filter-campaign" closable onClose={onCloseTagStore}>
          Store:{" "}
          {store
            ?.filter((el) => router?.query?.storeIds.includes(el.id))
            .map((col) => col.title)
            .join(", ")}
        </Tag>
      ) : null}
      {router?.query?.sortBy ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagSortBy}
        >
          Sort by:{" "}
          {router?.query?.sortBy === "title"
            ? "Alphabetical"
            : router?.query?.sortBy === "updated_at"
            ? "Last edited"
            : "Date created"}
        </Tag>
      ) : null}
    </div>
  );
};

export default OrderFilterTag;
