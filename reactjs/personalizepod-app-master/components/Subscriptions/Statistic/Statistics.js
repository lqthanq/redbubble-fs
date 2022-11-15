import React from "react";
import styled from "styled-components";
import StatsCard from "./StatsCard";
import StatsTable from "./StatsTable";

const Container = styled.div``;

const Statistics = () => {
  return (
    <Container>
      <StatsCard />
      <StatsTable />
    </Container>
  );
};

export default Statistics;
