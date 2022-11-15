import { Button, PageHeader } from "antd";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import styled from "styled-components";
import Header from "../components/Utilities/Header";
import MainMenu from "../components/Utilities/MainMenu";
import Head from "next/head";

const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 56px auto;
`;

const MainContent = styled.div`
  background: #f4f6f8;
  min-height: calc(100vh - 56px);
  transition: width 0.3s ease;
  width: ${(props) =>
    props.collapsed ? "calc(100% - 60px)" : "calc(100% - 230px)"};
  .content {
    outline: 0.1rem solid transparent;
  }
  .custom-header {
    display: flex;
    align-items: center;
  }
  .main-menu {
    overflow-x: hidden !important;
  }
`;

const DefaultLayout = ({ children, title, customizeHeader, routerPush }) => {
  const router = useRouter();
  const [{ menuCollapsed, currentUser, sellerId }, dispatch] = useAppValue();
  const mainRef = useRef();
  const [offsetTop, setOffsetTop] = useState(60);

  useEffect(() => {
    if (mainRef && mainRef.current) {
      setOffsetTop(mainRef.current.offsetTop);
    }
  }, [mainRef]);

  useEffect(() => {
    if (
      !sellerId &&
      !localStorage.sellerId &&
      currentUser?.roles?.some((role) => role === "Administrator") &&
      !["/sellers", "/select-seller"].includes(router?.pathname) &&
      !router?.pathname.includes("subscriptions") &&
      !router?.pathname.includes("admin")
    ) {
      router.push("/select-seller", "/select-seller");
    }
  }, [currentUser, router.pathname]);

  useEffect(() => {
    dispatch({
      type: "setSellerId",
      payload: localStorage.sellerId,
    });
  }, [localStorage]);

  return (
    <Container>
      <Head>
        <title>Personalized - {title}</title>
      </Head>
      <Header />
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            width: menuCollapsed ? 62 : 230,
            borderRight: "0.1rem solid #dfe3e8",
            position: "relative",
            background: "#F4F6F8",
            transition: "width 0.3s ease",
          }}
          className="main-menu"
        >
          <MainMenu />
        </div>
        <MainContent collapsed={menuCollapsed} ref={mainRef}>
          <Scrollbars style={{ height: `calc(100vh - ${offsetTop}px` }}>
            {title && (
              <div className="custom-header">
                <PageHeader title={title} onBack={() => router.back()} />
                {customizeHeader && (
                  <Button
                    onClick={() => router.push(routerPush)}
                    type="primary"
                  >
                    {customizeHeader}
                  </Button>
                )}
              </div>
            )}
            <div style={{ height: title ? "calc(100% - 68px)" : "100%" }}>
              {children}
            </div>
          </Scrollbars>
        </MainContent>
      </div>
    </Container>
  );
};

export default DefaultLayout;
