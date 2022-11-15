import { Divider, Dropdown, Menu, notification } from "antd";
import {
  UPDATE_TRACKING_STATUS,
  RE_TRACKING,
} from "graphql/mutate/order/orderAction";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { AiOutlineSetting } from "react-icons/ai";
import { LoadingOutlined } from "@ant-design/icons";

const ViewTracking = ({ tracking, refetch }) => {
  const [UpdateTrackingStatus, { loading }] = useMutation(
    UPDATE_TRACKING_STATUS
  );
  const [ReTracking] = useMutation(RE_TRACKING);
  const [idTracking, setIdTracking] = useState();
  const handleClickStatusTracking = (key, id, code) => {
    if (key === "reTracking") {
      ReTracking({
        variables: {
          trackingCode: code,
        },
      })
        .then((res) => {
          refetch();
          notification.success({ message: "Re tracking success!" });
        })
        .catch((err) => notification.error({ message: err.message }));
    } else {
      UpdateTrackingStatus({
        variables: {
          id,
          status: key,
        },
      })
        .then((res) => {
          refetch();
        })
        .catch((err) => notification.error({ message: err.message }));
    }
  };
  const statusTracking = [
    { key: "notfound", name: "No Info" },
    { key: "transit", name: "In Transit" },
    { key: "delivered", name: "Delivered" },
    { key: "undelivered", name: "Undelivered" },
    { key: "pickup", name: "Pick up" },
    { key: "exception", name: "Exception" },
    { key: "expired", name: "Expired" },
    { key: "pending", name: "Pending" },
  ];
  return (
    <div>
      {tracking?.map((el) => (
        <div key={el.id}>
          <div
            className="flex item-center"
            style={{
              background:
                el.status === "transit"
                  ? "#b4e1fa"
                  : el.status === "delivered"
                  ? "#bbe5b3"
                  : el.status === "undelivered"
                  ? "rgb(123 213 228)"
                  : el.status === "pickup"
                  ? "#b4e1fa"
                  : el.status === "exception"
                  ? "#fead9a"
                  : el.status === "expired"
                  ? "rgb(239, 178, 117)"
                  : el.status === "pending"
                  ? "#ffea8a"
                  : "#dfe3e8",
              borderRadius: 4,
            }}
          >
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu
                  onClick={(e) => {
                    handleClickStatusTracking(e.key, el.id, el.code);
                    setIdTracking(el.id);
                  }}
                >
                  {statusTracking?.map((item) => {
                    return <Menu.Item key={item.key}>{item.name}</Menu.Item>;
                  })}
                  {el.status !== "notfound" ? <Menu.Divider /> : null}
                  {el.status !== "notfound" ? (
                    <Menu.Item key="reTracking">Re-tracking</Menu.Item>
                  ) : null}
                </Menu>
              }
            >
              <div
                style={{
                  padding: 5,
                }}
              >
                {loading.loading && el.id === idTracking ? (
                  <LoadingOutlined />
                ) : (
                  <AiOutlineSetting className="anticon custom-icon" />
                )}
              </div>
            </Dropdown>
            <Dropdown
              trigger={["click"]}
              overlay={
                <iframe
                  title="tracking code"
                  src={`https://t.17track.net/en#nums=${el.code}`}
                  width="600px"
                  height="500px"
                />
              }
            >
              <div
                style={{
                  borderLeft: "1px solid white",
                  padding: 5,
                  cursor: "pointer",
                  wordBreak: "break-word",
                }}
              >
                {el.code}
              </div>
            </Dropdown>
          </div>
          <div
            style={{
              textTransform: "capitalize",
              fontSize: 13,
              marginBottom: 5,
            }}
          >
            (
            {statusTracking
              ?.filter((t) => t.key === el.status)
              .map((e) => e.name)
              .join()}
            )
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewTracking;
