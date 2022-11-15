import { Popover, Button } from "antd";
import { GrUndo, GrRedo } from "react-icons/gr";
const Flip = ({ layer, onChange }) => {
  return (
    <Popover
      content={
        <Button.Group>
          <Button
            icon={
              <span className="anticon">
                <GrUndo />
              </span>
            }
          />
          <Button
            icon={
              <span className="anticon">
                <GrRedo />
              </span>
            }
          />
        </Button.Group>
      }
    >
      <Button>Flip</Button>
    </Popover>
  );
};

export default Flip;
