import { Card } from "antd";
import { FiInbox } from "react-icons/fi";

const EmptyData = () => {
  return (
    <Card style={{ textAlign: "center" }}>
      <FiInbox
        style={{ color: "rgba(0, 0, 0, 0.25)" }}
        size={41}
        className="anticon"
      />
      <p style={{ color: "rgba(0, 0, 0, 0.25)" }}>
        No items found
        <br />
        Try changing the filters or search item
      </p>
    </Card>
  );
};

export default EmptyData;
