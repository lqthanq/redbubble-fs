import { useRouter } from "next/router";
import { PageHeader } from "antd";
import styled from "styled-components";
import Header from "../components/Utilities/Header";
import { useAppValue } from "context";
import { useEffect } from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px auto;
`;

const MainContent = styled.div`
  min-height: calc(100vh - 60px);
  width: 100%;
  .content {
    margin: 0px 24px;
    outline: 0.1rem solid transparent;
  }
`;

const CampaignLayout = ({ children, title }) => {
  const [{ sellerId, currentUser }, dispatch] = useAppValue();
  const router = useRouter();

  useEffect(() => {
    if (
      !sellerId &&
      !localStorage.sellerId &&
      currentUser?.roles?.some((role) => role === "Administrator")
    ) {
      router.push("/select-seller", "/select-seller");
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch({
      type: "setSellerId",
      payload: localStorage.sellerId,
    });
  }, [localStorage]);

  return (
    <Container>
      <Header noChangeSeller={true} />
      <div style={{ display: "flex", width: "100%" }}>
        <MainContent>
          <div className="main-content">
            {title && <PageHeader title={title} onBack={() => router.back()} />}
            <div>{children}</div>
          </div>
        </MainContent>
      </div>
    </Container>
  );
};

export default CampaignLayout;
