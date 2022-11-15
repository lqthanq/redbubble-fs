import styled from "styled-components";
import { Button, Menu, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const ZoomContainer = styled.div`
  position: fixed;
  left: 30px;
  bottom: 30px;
  z-index: 100;
`;
const Zoom = ({ value = 1, onChange = () => {}, style = {} }) => {
  const items = [300, 200, 150, 125, 100, 75, 50, 25];
  return (
    <ZoomContainer style={style}>
      <Button.Group>
        <Button
          onClick={(e) => {
            e.preventDefault();
            let newVal = parseFloat((parseFloat(value) - 0.01).toFixed(2));
            onChange(newVal >= 0.25 ? newVal : 0.25);
          }}
        >
          -
        </Button>
        <Popover
          content={
            <Menu selectable={false} style={{ border: "none" }}>
              {items.map((v) => (
                <Menu.Item
                  key={v / 100}
                  onClick={() => {
                    onChange(v / 100);
                  }}
                >
                  {v}% {v / 100 === value && <FontAwesomeIcon icon={faCheck} />}{" "}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button>{Math.round(value * 100)}%</Button>
        </Popover>
        <Button
          onClick={(e) => {
            e.preventDefault();
            let newVal = parseFloat((parseFloat(value) + 0.01).toFixed(2));
            onChange(newVal);
          }}
        >
          +
        </Button>
      </Button.Group>
    </ZoomContainer>
  );
};

export default Zoom;
