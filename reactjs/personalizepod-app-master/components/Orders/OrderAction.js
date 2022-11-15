import { Button, Dropdown, Menu, Modal, notification } from "antd";
import React, { useState } from "react";
import { BiErrorCircle, BiUpload } from "react-icons/bi";
import { BsFileCheck, BsFileText } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { FaRegEye, FaTruck } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/router";
import { CANCEL_ORDER, RE_SUBMIT } from "graphql/mutate/order/orderAction";
import { useMutation } from "@apollo/client";
import ModalOrderAction from "./ModalOrderAction";
import { permissions } from "components/Utilities/Permissions";
import { permissionCheck } from "components/Utilities/PermissionCheck";

const OrderAction = ({ order, refetch }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState({
    visible: false,
    type: null,
    title: null,
  });

  const [cancelOrder] = useMutation(CANCEL_ORDER);
  const [ReSubmit] = useMutation(RE_SUBMIT);
  const { status } = order;

  const confirm = () => {
    Modal.confirm({
      title: "Are you sure to cancel this order?",
      onOk: () => {
        cancelOrder({
          variables: { id: order.id },
        })
          .then(() => {
            notification.success({
              message: "The order cancelled successfully!",
            });
            refetch();
          })
          .catch((err) => notification.error({ message: err.message }));
      },
      width: 500,
    });
  };

  const confirmReSubmit = () => {
    Modal.confirm({
      title: "Are you sure to re-submit this order?",
      onOk: () => {
        ReSubmit({
          variables: { originID: order.id },
        })
          .then(() => {
            notification.success({
              message: "The order re-submit successfully!",
            });
            refetch();
          })
          .catch((err) => notification.error({ message: err.message }));
      },
      width: 500,
    });
  };

  const selectActionKey = (key) => {
    switch (key) {
      case "quick-view":
        setIsModalVisible({
          visible: order.id,
          type: "quick-view",
          title: "Order details",
        });
        return;
      case "upload":
        setIsModalVisible({
          visible: order.id,
          type: "upload",
          title: "Upload Design",
        });
        return;
      case "accept":
        setIsModalVisible({
          visible: order.id,
          type: "accept",
          title: "Accept Design",
        });
        return;
      case "cancel":
        confirm();
        return;
      case "error":
        confirmReSubmit();
        return;
      case "detail-view":
        router.push("/orders/[id]", `/orders/${order.id}`);
        return;
      case "add-tracking":
        setIsModalVisible({
          visible: order.id,
          type: "add-tracking",
          title: "Add Tracking",
        });
        return;
      default:
        break;
    }
  };

  return (
    <div>
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => selectActionKey(key)}>
            <Menu.Item key="quick-view" icon={<FaRegEye className="anticon" />}>
              Quick View
            </Menu.Item>
            <Menu.Item
              key="detail-view"
              icon={<BsFileText className="anticon" />}
            >
              View Details
            </Menu.Item>
            <Menu.Item
              key="accept"
              hidden={
                !["ReviewDesign"].includes(status) ||
                !permissionCheck(permissions.OrderUpdate)
              }
              icon={<BsFileCheck className="anticon" />}
            >
              Accept Design
            </Menu.Item>
            <Menu.Item
              key="upload"
              hidden={
                !["ReviewDesign", "DesignRejected"].includes(status) ||
                !permissionCheck(permissions.OrderUploadDesign)
              }
              icon={<BiUpload className="anticon" />}
            >
              Upload Custom Design
            </Menu.Item>
            <Menu.Item
              key="cancel"
              hidden={
                [
                  "Cancelled",
                  "Fulfilled",
                  "DesignRejected",
                  "InProduction",
                ].includes(status) || !permissionCheck(permissions.OrderUpdate)
              }
              icon={<FcCancel className="anticon" />}
            >
              Cancel
            </Menu.Item>
            <Menu.Item
              key="add-tracking"
              hidden={
                !["InProduction", "Fulfilled"].includes(status) ||
                !permissionCheck(permissions.OrderUpdate)
              }
              icon={<FaTruck className="anticon" />}
            >
              Add Tracking
            </Menu.Item>
            <Menu.Item
              key="error"
              hidden={
                !["Error"].includes(status) ||
                order?.productVariant?.productBase?.fulfillment === null ||
                order?.productVariant?.productBase?.fulfillment?.type ===
                  "Custom" ||
                !permissionCheck(permissions.OrderUpdate)
              }
              icon={<BiErrorCircle className="anticon" />}
            >
              Re-submit
            </Menu.Item>
          </Menu>
        }
      >
        <Button>
          Action <IoIosArrowDown className="anticon" />
        </Button>
      </Dropdown>
      {!!isModalVisible.visible && (
        <ModalOrderAction
          orderId={order.id}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default OrderAction;
