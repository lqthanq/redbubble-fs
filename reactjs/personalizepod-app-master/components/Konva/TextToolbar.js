import TextAlign from "./Utilities/TextAlign";
import styled from "styled-components";
import FontSize from "./Utilities/FontSize";
import FontSelector from "../Font/FontSelector";
import ColorField from "./Utilities/ColorField";
//import TextShape from "./Utilities/TextShape";
import TextSpacing from "./Utilities/TextSpacing";
import { useAppValue } from "../../context";
import PatternSelector from "../Patterns/patternSelector";
import LayerPosition from "./Utilities/LayerPosition";
import LayerAdvance from "./Utilities/LayerAdvance";
import { ARTWORK } from "../../actions";

const Container = styled.div`
  display: flex;
  gap: 10px;
`;
const TextToolbar = ({ layer }) => {
  const [, dispatch] = useAppValue();
  const handleFontChange = (fontFamily) => {
    onChange({ ...layer, fontFamily });
  };
  const onChange = (update) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, ...update },
    });
  };
  const handlePatternChange = (pattern) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, _pattern: pattern },
    });
  };
  return (
    <Container>
      <FontSelector fontFamily={layer.fontFamily} onSelect={handleFontChange} />
      <FontSize layer={layer} />
      <TextAlign layer={layer} />
      <TextSpacing layer={layer} />
      <ColorField
        value={layer.fill}
        onChange={(color) => onChange({ fill: color })}
      />
      {/* <TextShape layer={layer} onChange={onChange} /> */}
      <PatternSelector layer={layer} onChange={handlePatternChange} />
      <LayerPosition layer={layer} />
      <LayerAdvance layer={layer} />
    </Container>
  );
};

export default TextToolbar;
