import { useRouter } from "next/router";
import Cliparts from "../../components/Clipart/Cliparts";
import ClipartCategories from "../../components/Clipart/Categories";
import styled from "styled-components";
import { get } from "lodash";

const Container = styled.div`
  display: grid;
  grid-template-columns: 315px calc(100% - 315px);
  position: relative;
`;
const ClipartPage = () => {
  const router = useRouter();
  return (
    <Container>
      <ClipartCategories />
      <Cliparts categoryID={get(router, "query.categoryID", null)} />
    </Container>
  );
};

export default ClipartPage;
