import { Button, Form, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { ADD_TRACKING } from "graphql/mutate/order/orderAction";
import { useMutation } from "@apollo/client";
const AddTracking = ({ order, refetch, handleClose }) => {
  const [form] = Form.useForm();
  const [trackings, setTrackings] = useState([]);
  useEffect(() => {
    if (order?.tracking?.length > 0) {
      setTrackings(order.tracking);
    } else {
      setTrackings([{ code: "" }]);
    }
  }, [order]);
  const [errorNotCode, setErrorNotCode] = useState(false);
  const [AddTracking, { loading }] = useMutation(ADD_TRACKING);
  const onFinish = (values) => {
    if (trackings.map((item) => item.code).includes("")) {
      setErrorNotCode(true);
    } else {
      AddTracking({
        variables: {
          orderId: order?.id,
          data: trackings.map((el) => {
            setErrorNotCode(false);
            return {
              id: el.id,
              code: el.code,
            };
          }),
        },
      })
        .then((res) => {
          notification.success({
            message: "The Order Add Tracking Successfully!",
          });
          setErrorNotCode(false);
          refetch();
          handleClose();
        })
        .catch((err) => {
          notification.error({ message: err.message });
        });
    }
  };
  return [
    <Form
      form={form}
      id="add-tracking"
      layout="vertical"
      style={{ padding: 24 }}
      onFinish={onFinish}
    >
      <div>
        {trackings &&
          trackings?.map((tracking, index) => (
            <Form.Item
              key={index}
              validateStatus={
                errorNotCode && tracking.code === "" ? "error" : ""
              }
              help={
                errorNotCode && tracking.code === ""
                  ? "Please input tracking code."
                  : ""
              }
              style={{ marginBottom: 0 }}
            >
              <div className="space-between flex-align-center">
                <div>Tracking code</div>
                <Button
                  type="link"
                  hidden={tracking.id || trackings.length < 2}
                  onClick={() =>
                    setTrackings(trackings?.filter((el, i) => i !== index))
                  }
                  icon={
                    <AiTwotoneDelete
                      style={{ color: "var(--error-color)" }}
                      className="custom-icon anticon"
                    />
                  }
                />
              </div>
              <Input
                value={tracking.code}
                onChange={(e) => {
                  setTrackings(
                    trackings?.map((item, i) =>
                      i === index ? { ...item, code: e.target.value } : item
                    )
                  );
                }}
                placeholder="Tracking code"
              />
            </Form.Item>
          ))}
      </div>
      <Button
        style={{ alignItems: "center", display: "flex" }}
        onClick={(e) => {
          setTrackings([...trackings, { code: "" }]);
        }}
      >
        <FaPlusCircle className="custom-icon anticon" />
        Add tracking
      </Button>
    </Form>,
    { loading },
  ];
};

export default AddTracking;
