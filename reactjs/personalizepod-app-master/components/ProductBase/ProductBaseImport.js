import React, { useState } from "react";
import styled from "styled-components";
import CategoryImportBase from "./CategoryImportBase";
import ProductBaseImportByCategory from "./ProductBaseImportByCategory";

const Container = styled.div`
  display: grid;
  grid-template-columns: 315px calc(100% - 315px);
`;
const ProductBaseImport = ({ refetch }) => {
  const [categories, setCategories] = useState([]);
  const [fulfillments, setFulfillments] = useState([]);
  const [categorySelect, setCategorySelect] = useState([]);
  const [fulfillSlug, setFulfillSlug] = useState();
  const categoryId = categorySelect;
  return (
    <Container>
      <div style={{ borderRight: "1px solid rgb(241 234 234)" }}>
        <CategoryImportBase
          fulfillments={fulfillments}
          setFulfillments={setFulfillments}
          categories={categories}
          setCategories={setCategories}
          fulfillSlug={fulfillSlug}
          setFulfillSlug={setFulfillSlug}
          categorySelect={categorySelect}
          setCategorySelect={setCategorySelect}
        />
      </div>
      <ProductBaseImportByCategory
        fulfillments={fulfillments}
        fulfillSlug={fulfillSlug ? [fulfillSlug] : []}
        refetch={refetch}
        categoryIds={categoryId}
        categories={categories}
      />
    </Container>
  );
};

export default ProductBaseImport;
