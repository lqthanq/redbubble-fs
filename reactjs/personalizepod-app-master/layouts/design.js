import { useRouter } from "next/router";
import { PageHeader } from "antd";
import styled from "styled-components";
import Header from "../components/Utilities/Header";

const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px auto;
  user-select: none;
`;

const MainContent = styled.div`
  min-height: calc(100vh - 60px);
  width: 100%;
  .content {
    margin: 0px 24px;
    outline: 0.1rem solid transparent;
  }
`;

const DesignLayout = ({ children, title }) => {
  const router = useRouter();
  return (
    <Container>
      {/* <Header /> */}
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

export default DesignLayout;
