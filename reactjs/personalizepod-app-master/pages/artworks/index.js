import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import ArtworkCategories from "components/Artworks/ArtworkCategories";
import ArtWorkList from "components/Artworks/ArtWorkList";
import { get } from "lodash";

const Container = styled.div`
  display: grid;
  grid-template-columns: 315px calc(100% - 315px);
`;

const ArtWorksPage = () => {
  const router = useRouter();
  return (
    <Container>
      <ArtworkCategories />
      <ArtWorkList categoryID={get(router, "query.categoryID", null)} />
    </Container>
  );
};
export default ArtWorksPage;
