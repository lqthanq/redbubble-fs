import { Button, Col, Popover, Row } from "antd";
import { useAppValue } from "context";
import { ARTWORK } from "../../../actions";

const TextShape = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const onChange = (shape) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, shape: shape },
    });
  };
  const shapes = {
    normal: {
      icon: "/shapes/normal.svg",
      settings: [
        {
          name: "flipped",
          title: "Flipped",
          default: true,
        },
      ],
    },
    curve: {
      icon: "/shapes/curve.svg",
    },
    arch: {
      icon: "/shapes/arch.svg",
    },
    bridge: {
      icon: "/shapes/bridge.svg",
    },
    valley: {
      icon: "/shapes/valley.svg",
    },
    pinch: {
      icon: "/shapes/pinch.svg",
    },
    bulge: {
      icon: "/shapes/bulge.svg",
    },
    perspective: {
      icon: "/shapes/perspective.svg",
    },
    pointed: {
      icon: "/shapes/pointed.svg",
    },
    downward: {
      icon: "/shapes/downward.svg",
    },
    upward: {
      icon: "/shapes/upward.svg",
    },
    cone: {
      icon: "/shapes/cone.svg",
    },
  };
  return (
    <Popover
      placement="bottom"
      content={
        <Row style={{ width: 300, marginTop: 15 }} gutter={[30, 30]}>
          {Object.keys(shapes).map((shape) => (
            <Col
              span={8}
              key={shape}
              style={{
                cursor: "pointer",
                border: shape === layer.shape ? "1px solid #ddd" : "none",
              }}
              onClick={(e) => {
                e.preventDefault();
                onChange(shape);
              }}
            >
              <img src={shapes[shape].icon} width={70} />
            </Col>
          ))}
        </Row>
      }
    >
      <Button type="link">Effect</Button>
    </Popover>
  );
};
export default TextShape;
