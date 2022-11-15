import React from "react";
import LoginLayout from "layouts/login";
import styled from "styled-components";
import LoginForm from "components/User/Login";
import { Card, Col, PageHeader, Row } from "antd";
import { useRouter } from "next/router";
import { useAppValue } from "context";
import { isAdmin } from "components/Utilities/isAdmin";

const Container = styled.div`
  max-width: calc(100vw - 30px);
  width: 1000px;
  .p-header {
    display: inline-block;
  }
  .p-title {
    padding: 0px 26px;
  }
`;
const Home = () => {
  const [{ currentUser, sellerId }] = useAppValue();
  const router = useRouter();
  return (
    <Container>
      <Card bodyStyle={{ padding: 0 }}>
        <Row type="flex">
          <Col
            span={0}
            md={12}
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/1002543/pexels-photo-1002543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
              backgroundSize: "cover",
            }}
          ></Col>
          <Col span={24} md={12} style={{ textAlign: "center" }}>
            <div className="p-header" style={{ marginTop: 15 }}>
              <PageHeader className="p-title" title="Login" />
            </div>
            <LoginForm
              onLogin={() => {
                if (
                  !sellerId &&
                  currentUser?.roles?.some((role) => role === "Administrator")
                ) {
                  router.push("/select-seller", "/select-seller");
                } else {
                  router.push("/cliparts", "/cliparts");
                }
              }}
            />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

Home.Layout = LoginLayout;
export default Home;
