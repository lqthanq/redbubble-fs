import { Tag } from "antd";
import { useRouter } from "next/router";
import React from "react";
import productBase from "graphql/queries/productBase/productBase";
import stores from "graphql/queries/stores";
import { useQuery } from "@apollo/client";
import { PRODUCT_COLLECTION } from "graphql/queries/product/products";

const CampaignFilterTag = ({ filter, setFilter, form }) => {
  const router = useRouter();
  const { data: dataBase } = useQuery(productBase);
  const { data: dataCollections } = useQuery(PRODUCT_COLLECTION);
  const { data: dataStore } = useQuery(stores);
  const productBases = dataBase?.productBases?.hits;
  const collections = dataCollections?.productCollections;
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
      productBaseIds: [],
    });
    delete router.query?.productBaseIds;
    router.push(router);
  };
  const onCloseTagCollec = () => {
    setFilter({
      ...filter,
      collectionIds: [],
    });
    delete router.query?.collectionIds;
    router.push(router);
    form.setFieldsValue({
      collectionIds: null,
    });
  };
  const onCloseTagStore = () => {
    setFilter({
      ...filter,
      storeId: null,
    });
    delete router.query?.storeId;
    router.push(router);
    form.setFieldsValue({
      storeId: null,
    });
  };
  const onCloseTagSortBy = () => {
    setFilter({
      ...filter,
      sortBy: "created_at",
      order: "DESC",
    });
    delete router.query?.sortBy;
    delete router.query.order;
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
      {router?.query?.status && (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagStatus}
        >
          Status: {router?.query?.status}
        </Tag>
      )}
      {router?.query?.productBaseIds ? (
        <Tag className="tag-filter-campaign" closable onClose={onCloseTagBase}>
          Product base: {getBasesName()?.join(", ")}
        </Tag>
      ) : null}
      {router?.query?.collectionIds ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagCollec}
        >
          Collection:{" "}
          {collections
            ?.filter((el) => el.id.includes(router?.query?.collectionIds))
            .map((col) => col.title)
            .join()}
        </Tag>
      ) : null}
      {router?.query?.storeId ? (
        <Tag className="tag-filter-campaign" closable onClose={onCloseTagStore}>
          Store:{" "}
          {store
            ?.filter((el) => el.id.includes(router?.query?.storeId))
            .map((col) => col.title)
            .join()}
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
            : "Date created"}{" "}
          ({router?.query?.order === "ASC" ? "ASC" : "DESC"})
        </Tag>
      ) : null}
    </div>
  );
};

export default CampaignFilterTag;
