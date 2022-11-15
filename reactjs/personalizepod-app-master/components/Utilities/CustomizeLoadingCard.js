import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const CustomizeLoadingCard = ({ times, height }) => {
  const renderLoadingCard = () => {
    let loadingCard = [];
    for (let i = 1; i <= times; i++) {
      loadingCard.push(
        <div
          key={i}
          style={{
            backgroundColor: "#f5f5f5",
          }}
        >
          <Spin
            style={{
              display: "grid",
              alignItems: "center",
              justifyContent: "center",
              height,
            }}
            indicator={antIcon}
          />
        </div>
      );
    }
    return loadingCard;
  };
  return renderLoadingCard();
};

export default CustomizeLoadingCard;
