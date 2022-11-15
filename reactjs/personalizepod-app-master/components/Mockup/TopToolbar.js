import { Button, Space } from "antd";
import React from "react";
import styled from "styled-components";
import { useAppValue } from "../../context";
const Container = styled.div`
  display: grid;
  grid-template-columns: auto 160px;
  border-bottom: 1px solid rgb(245, 245, 245);
`;
const TopToolbar = () => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { selectedLayers } = mockupWorkspace;
  console.log(selectedLayers);
  return (
    <Container>
      <div></div>
      <Space>
        <Button>Cancel</Button>
        <Button type="primary">Save</Button>
      </Space>
    </Container>
  );
};

export default TopToolbar;
