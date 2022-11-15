import styled from "styled-components";
import ImageFilter from "./Utilities/ImageFilter";
import LayerPosition from "./Utilities/LayerPosition";
import LayerAdvance from "./Utilities/LayerAdvance";

const Container = styled.div`
  display: flex;
  gap: 10px;
`;
const ImageToolbar = ({ layer }) => {
  return (
    <Container>
      <ImageFilter layer={layer} />
      <LayerPosition layer={layer} />
      <LayerAdvance layer={layer} />
    </Container>
  );
};

export default ImageToolbar;
