import { Button, Modal, Skeleton } from "antd";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import useOrderUploadDesign from "./OrderUploadDesign";
import useAddTracking from "./AddTracking";
import useAcceptDesignOrder from "./AcceptDesignOrder";
import { useEffect } from "react";
import { ORDER_BY_ID } from "graphql/queries/order/orders";
import OrderDetail from "./OrderDetail";
import { cloneDeep } from "lodash";

const ModalOrderAction = ({
  isModalVisible,
  setIsModalVisible,
  orderId,
  refetch,
}) => {
  const { data, loading } = useQuery(ORDER_BY_ID, {
    variables: { id: orderId },
  });
  const order = data?.order;
  console.log("order", order);
  const [newDesigns, setNewDesigns] = useState(false);

  useEffect(() => {
    if (order) {
      setNewDesigns(order.designs);
    }
  }, [order]);

  const handleClose = () => {
    setNewDesigns(order?.designs);
    setIsModalVisible({
      visible: false,
      type: null,
      title: null,
    });
  };

  const [formAddTracking, { loading: loadingAddTracking }] = useAddTracking({
    order,
    refetch,
    handleClose,
  });

  const [
    formUploadDesign,
    { loading: loadingUpload, disableButton },
  ] = useOrderUploadDesign({
    order,
    refetch,
    handleClose,
    newDesigns,
    setNewDesigns,
  });

  const [
    formAccept,
    { loadingAccept, loadingReject, disableAcceptButton },
  ] = useAcceptDesignOrder({
    order,
    refetch,
    handleClose,
    newDesigns,
    setNewDesigns,
  });

  const disableVariable = (key) => {
    switch (key) {
      case "upload":
        return disableButton;
      case "accept":
        return disableAcceptButton;
      default:
        false;
    }
  };

  return (
    <div>
      <Modal
        title={
          isModalVisible.title === "Add Tracking"
            ? `Add Tracking: #${order?.id}`
            : isModalVisible.title
        }
        visible={!!isModalVisible.visible}
        onCancel={handleClose}
        key={isModalVisible.visible}
        width={
          isModalVisible.type === "add-tracking"
            ? "30%"
            : isModalVisible.type === "quick-view"
            ? "60%"
            : "50%"
        }
        className="no-padding-modal"
        footer={
          <div>
            <Button onClick={handleClose}>
              {isModalVisible.type === "quick-view" ? "Close" : "Cancel"}
            </Button>
            {isModalVisible.type === "accept" ? (
              <Button
                type="primary"
                danger
                htmlType="submit"
                disabled={disableAcceptButton}
                form="reject"
                loading={loadingReject}
              >
                Reject
              </Button>
            ) : null}
            {isModalVisible.type !== "quick-view" ? (
              <Button
                type="primary"
                htmlType="submit"
                disabled={disableVariable(isModalVisible.type)}
                form={isModalVisible.type}
                loading={loadingAddTracking || loadingUpload || loadingAccept}
              >
                {isModalVisible.type === "accept" ? "Accept" : "Save"}
              </Button>
            ) : null}
          </div>
        }
      >
        {loading ? (
          <Skeleton active={true} />
        ) : isModalVisible.type === "upload" ? (
          formUploadDesign
        ) : isModalVisible.type === "add-tracking" ? (
          formAddTracking
        ) : isModalVisible.type === "accept" ? (
          formAccept
        ) : (
          <OrderDetail
            refetch={refetch}
            orderItem={cloneDeep({ ...data?.order })}
          />
        )}
      </Modal>
    </div>
  );
};

export default ModalOrderAction;
