import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
`;
const LoginLayout = ({ children }) => {
  return (
    <Container>
      <div>{children}</div>
    </Container>
  );
};

export default LoginLayout;
