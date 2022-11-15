import { Divider, Select } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PRODUCT_BASE_CATEGORIES_FROM_FSS } from "graphql/queries/fromFSS/productBaseCategoriesFromFSS";
import { useQuery } from "@apollo/client";
import CategoriesCustomize from "components/Utilities/CategoriesCustomize";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";

const Container = styled.div``;
const CategoryImportBase = ({
  setCategorySelect,
  categorySelect,
  setFulfillSlug,
  fulfillSlug,
  categories,
  setCategories,
  fulfillments,
  setFulfillments,
}) => {
  const { data: fulfillment } = useQuery(FULFILLMENTS, {
    fetchPolicy: "no-cache",
    variables: {
      isReady: true,
      type: "BuiltIn",
    },
  });
  const { data } = useQuery(PRODUCT_BASE_CATEGORIES_FROM_FSS, {
    variables: {
      fulfillmentSlug: fulfillSlug
        ? [fulfillSlug]
        : fulfillments?.map((el) => el.slug),
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data && fulfillments?.length) {
      setCategories(data?.productBaseCategoriesFromFSS?.hits);
    }
    if (fulfillment) {
      setFulfillments(fulfillment?.fulfillments);
    }
  }, [data]);

  return (
    <Container className="p-24">
      <div>
        <h3>Fulfillment by</h3>
        <Select
          defaultValue={null}
          onChange={(e) => {
            setFulfillSlug(e);
            setCategorySelect([]);
          }}
          style={{ width: "100%" }}
        >
          <Select.Option value={null}>All</Select.Option>
          {fulfillments?.map((el) => (
            <Select.Option key={el.id} value={el.slug}>
              {el.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />
      <div>
        <h3>Categories</h3>
        <CategoriesCustomize
          categorySelect={categorySelect?.toString()}
          setCategorySelect={setCategorySelect}
          categoryImportBase={true}
          height={400}
          customBase={true}
          categories={categories}
        />
      </div>
    </Container>
  );
};

export default CategoryImportBase;
