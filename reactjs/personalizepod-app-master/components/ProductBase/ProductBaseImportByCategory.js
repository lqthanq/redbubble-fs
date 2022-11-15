import { Input, Pagination } from "antd";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import Grid from "components/Utilities/Grid";
import Scrollbars from "components/Utilities/Scrollbars";
import productBasesFromFSS from "graphql/queries/fromFSS/productBasesFromFSS";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import ProductBaseGrid from "./ProductBaseGrid";
import EmptyData from "components/Utilities/EmptyData";
const Container = styled.div``;
const ProductBaseImportByCategory = ({
  categoryIds,
  refetch,
  categories,
  fulfillSlug,
  fulfillments,
}) => {
  const [filter, setFilter] = useState({
    pageSize: 24,
    page: 1,
    search: "",
    categoryIds,
    fulfillmentSlug:
      fulfillSlug.length > 0 ? fulfillSlug : fulfillments.map((el) => el.slug),
  });
  const { data, loading } = useQuery(productBasesFromFSS, {
    variables: {
      filter: {
        ...filter,
        categoryIds,
        fulfillmentSlug:
          fulfillSlug.length > 0
            ? fulfillSlug
            : fulfillments.map((el) => el.slug),
      },
    },
    fetchPolicy: "network-only",
  });
  const productBasesFss =
    categories.length && data ? data?.productBasesFromFSS?.hits : null;

  const handleChangeSearch = (s) => {
    setFilter({ ...filter, search: s });
  };
  const pagination = {
    current: filter.page,
    total: categories.length && data?.productBasesFromFSS?.count,
    pageSize: +filter.pageSize,
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
    },
  };
  useEffect(() => {
    if (categoryIds) {
      setFilter({ ...filter, page: 1 });
    }
  }, [categoryIds]);

  return (
    <Container className="p-24">
      <div className="header-filter mb-15">
        <Input.Search
          placeholder="Search..."
          onSearch={(s) => handleChangeSearch(s)}
          onChange={(e) => {
            if (!e.target.value) {
              handleChangeSearch(null);
            } else {
              handleChangeSearch(e.target.value);
            }
          }}
        />
      </div>
      {loading ? (
        <CustomizeLoadingCard times={4} height={300} />
      ) : productBasesFss?.length ? (
        <Grid gap={15} width={250}>
          {productBasesFss?.map((el) => (
            <ProductBaseGrid
              refetch={refetch}
              key={el.id}
              baseImport={true}
              el={el}
            />
          ))}
        </Grid>
      ) : (
        <EmptyData />
      )}
      <Pagination style={{ float: "right", marginTop: 20 }} {...pagination} />
    </Container>
  );
};

export default ProductBaseImportByCategory;
