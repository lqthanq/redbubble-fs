import { Button, PageHeader } from "antd";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import Header from "../components/Utilities/Header";
import MainMenu from "../components/Utilities/MainMenu";

const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px auto;
`;

const MainContent = styled.div`
  background: #F4F6F8;
  min-height: calc(100vh - 60px);
  transition: width 0.3s ease;
  width: ${(props) =>
    props.collapsed ? "calc(100% - 80px)" : "calc(100% - 230px)"};
  .content {
    margin: 0px 24px;
    outline: 0.1rem solid transparent;
  }
  .custom-header {
    display: flex;
    align-items: center;
  }
`;

const NewLayout = ({ children, title, customizeHeader, routerPush }) => {
  const router = useRouter();
  const [{ menuCollapsed }] = useAppValue();
  return (
    <Container>
      <Header />
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            width: menuCollapsed ? 80 : 230,
            borderRight: ".1rem solid #dfe3e8",
            position: "relative",
            background: "#F4F6F8",
            transition: "width 0.3s ease",
          }}
          className="main-menu"
        >
          <MainMenu />
        </div>
        <MainContent collapsed={menuCollapsed}>
          <div className="custom-header">
            {title && <PageHeader title={title} onBack={() => router.back()} />}
            {customizeHeader && (
              <Button onClick={() => router.push(routerPush)} type="primary">
                {customizeHeader}
              </Button>
            )}
          </div>
          <div>{children}</div>
        </MainContent>
      </div>
    </Container>
  );
};

export default NewLayout;
