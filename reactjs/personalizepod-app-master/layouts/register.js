import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
`;
const RegisterLayout = ({ children }) => {
  return <Container>{children}</Container>;
};

export default RegisterLayout;
