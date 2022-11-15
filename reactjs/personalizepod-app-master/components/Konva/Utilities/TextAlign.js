import { Button, Popover } from "antd";
import { FiAlignJustify } from "react-icons/fi";
import {
  GrTextAlignLeft,
  GrTextAlignCenter,
  GrTextAlignRight,
} from "react-icons/gr";
import { useAppValue } from "context";
import { ARTWORK } from "../../../actions";

const TextAlign = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const handleClick = (align) => (e) => {
    e.preventDefault();
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, align: align },
    });
  };
  return (
    <Popover
      placement="bottom"
      content={
        <Button.Group>
          <Button
            icon={
              <span className="anticon">
                <GrTextAlignLeft />
              </span>
            }
            onClick={handleClick("left")}
          />
          <Button
            icon={
              <span className="anticon">
                <GrTextAlignCenter />
              </span>
            }
            onClick={handleClick("center")}
          />
          <Button
            icon={
              <span className="anticon">
                <GrTextAlignRight />
              </span>
            }
            onClick={handleClick("right")}
          />
        </Button.Group>
      }
    >
      <Button
        type="link"
        icon={((align) => {
          switch (align) {
            case "center":
              return (
                <span className="anticon">
                  <GrTextAlignCenter />
                </span>
              );
            case "right":
              return (
                <span className="anticon">
                  <GrTextAlignRight />
                </span>
              );
            case "justify":
              return (
                <span className="anticon">
                  <FiAlignJustify />
                </span>
              );
            default:
              return (
                <span className="anticon">
                  <GrTextAlignLeft />
                </span>
              );
          }
        })(layer.align)}
      />
    </Popover>
  );
};

export default TextAlign;
