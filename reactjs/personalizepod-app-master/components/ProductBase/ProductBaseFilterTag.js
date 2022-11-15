import { Tag } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "@apollo/client";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { PRODUCT_BASE_CATEGORIES } from "graphql/queries/productBase/category";

const CampaignFilterTag = ({ filter, setFilter }) => {
  const router = useRouter();
  const { data } = useQuery(FULFILLMENTS);
  const { data: categoryBase } = useQuery(PRODUCT_BASE_CATEGORIES);
  const fulfillments = data?.fulfillments;
  const onCloseTagFulfillment = () => {
    setFilter({
      ...filter,
      fulfillmentId: "",
      page: 1,
    });
    delete router.query?.fulfillmentId;
    router.push(router);
  };
  const onCloseTagCategory = () => {
    setFilter({
      ...filter,
      categoryId: "",
      page: 1,
    });
    delete router.query?.categoryId;
    router.push(router);
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

  return (
    <div>
      {/* {router?.query?.order && (
        <Tag className="tag-filter-campaign" closable onClose={onCloseTagOrder}>
          Order: {router?.query?.order === "ASC" ? "Ascending" : "Descending"}
        </Tag>
      )} */}
      {router?.query?.fulfillmentId ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagFulfillment}
        >
          Fulfillment:{" "}
          {fulfillments
            ?.filter((el) => el.id.includes(router?.query?.fulfillmentId))
            .map((base) => base.title)
            .join()}
        </Tag>
      ) : null}
      {router?.query?.categoryId ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagCategory}
        >
          Category:{" "}
          {categoryBase?.productBaseCategories?.hits

            ?.filter((el) => el?.id?.includes(router?.query?.categoryId))
            .map((base) => base.title)
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
