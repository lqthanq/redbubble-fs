import styled from "styled-components";
import LayerPosition from "./Utilities/LayerPosition";
import LayerAdvance from "./Utilities/LayerAdvance";

const Container = styled.div`
  display: flex;
  gap: 10px;
`;
const GroupToolbar = ({ layer }) => {
  return (
    <Container>
      <LayerPosition layer={layer} />
      <LayerAdvance layer={layer} />
    </Container>
  );
};

export default GroupToolbar;
