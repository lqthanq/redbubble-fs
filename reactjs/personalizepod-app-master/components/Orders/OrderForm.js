import {
  Button,
  Card,
  Col,
  Collapse,
  Dropdown,
  Image,
  Menu,
  Modal,
  notification,
  Radio,
  Row,
  Tabs,
  Tag,
  Timeline,
} from "antd";
import {
  ACCEPT_DESIGN,
  CANCEL_ORDER,
  RE_SUBMIT,
} from "graphql/mutate/order/orderAction";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { FcCancel } from "react-icons/fc";
import { HiDuplicate } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";
import Customization from "./Customization";
import OrderDesignFile from "./OrderDesignFile";
import ShippingAddress from "./ShippingAddress";
import { statusColor } from "./StatusOrder";
import moment from "moment";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import { BsFileCheck, BsFileMinus } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import useAddTracking from "./AddTracking";
import { isEmpty } from "lodash";
import Scrollbars from "components/Utilities/Scrollbars";
import { permissions } from "components/Utilities/Permissions";
import AuthElement from "components/User/AuthElement";

const Container = styled.div`
  .ant-form-item {
    margin-bottom: 10px;
  }
  padding: 0 24px 24px;
  .ant-collapse-borderless {
    background-color: white;
  }
  .ant-collapse-header {
    background: white;
  }
  .ant-divider {
    margin: 15px 0;
  }
  .ant-timeline-item {
    padding-bottom: 10px;
  }
  .ant-timeline-item-head-blue {
    margin-top: 5px;
  }
  .ant-timeline-item-content {
    top: 0;
  }
`;

const OrderForm = ({ order, refetch }) => {
  const [{ currentUser }] = useAppValue();
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [cancelOrder, { loading }] = useMutation(CANCEL_ORDER);
  const [reSubmit] = useMutation(RE_SUBMIT);
  const [acceptDesign, { loading: acceptLoading }] = useMutation(ACCEPT_DESIGN);
  const [visible, setVisible] = useState(false);
  const handleClose = () => setVisible(false);

  const [formAddTracking, { loading: loadingAddTracking }] = useAddTracking({
    order: order,
    refetch,
    handleClose,
  });

  const confirmCancel = () => {
    Modal.confirm({
      title: "Are you sure to cancel this order?",
      content: currentUser?.roles?.includes("Administrator") ? (
        <Radio.Group name="radiogroup" defaultValue={1}>
          <Radio value={1}>Cancel this order and cancel in store</Radio>
          <Radio value={2}>Cancel this order, without cancel in store</Radio>
          <Radio value={3}>
            {`Cancel this order &  related orders and cancel in store`}
          </Radio>
          <Radio value={4}>
            {`Cancel this order & related orders, without cancel in store`}
          </Radio>
        </Radio.Group>
      ) : null,
      onOk: () => {
        cancelOrder({
          variables: { id: order.id },
        })
          .then(() => {
            refetch();
            notification.success({
              message: "The order cancelled successfully!",
            });
          })
          .catch((err) => notification.error({ message: err.message }));
      },
      width: 500,
      okButtonProps: { loading },
    });
  };

  const confirmModal = (type) => {
    Modal.confirm({
      title: `Are you sure to ${type} order${
        type !== "re-submit" ? " designs" : ""
      }?`,
      onOk: () => {
        if (["accept", "reject"]) {
          acceptDesign({
            variables: { orderId: order.id, accept: type === "accept" },
          })
            .then(() => {
              notification.success({
                message: `The order designs has been ${
                  type + "ed"
                } successfully!`,
              });
              refetch();
            })
            .catch((err) => notification.error({ message: err.message }));
        } else {
          reSubmit({
            variables: { originID: order.id },
          })
            .then(() => {
              notification.success({
                message: "The order re-submit successfully!",
              });
              refetch();
            })
            .catch((err) => notification.error({ message: err.message }));
        }
      },
      width: 500,
      okButtonProps: { loading: acceptLoading },
    });
  };

  const actionMenu = () => (
    <Menu
      onClick={({ key }) => {
        switch (key) {
          case "re-submit":
          case "reject":
          case "accept":
            return confirmModal(key);
          case "cancel":
            return confirmCancel();
          case "tracking":
            return setVisible(true);
          default:
            break;
        }
      }}
    >
      <Menu.Item
        hidden={
          order.designs?.find((ds) => !ds.file) ||
          !["ReviewDesign"].includes(order.status)
        }
        key="accept"
        icon={<BsFileCheck className="anticon" />}
      >
        Accept Design
      </Menu.Item>
      <Menu.Item
        hidden={
          order.designs?.find((ds) => !ds.file) ||
          !["ReviewDesign"].includes(order.status)
        }
        key="reject"
        icon={<BsFileMinus className="anticon" />}
      >
        Reject Design
      </Menu.Item>
      <Menu.Item
        hidden={!["InProduction", "Fulfilled"].includes(order.status)}
        key="tracking"
        icon={<FaTruck className="anticon" />}
      >
        {isEmpty(order?.tracking) ? "Add" : "Edit"} Tracking
      </Menu.Item>
      <Menu.Item
        className="delete-button-color"
        key="cancel"
        icon={<FcCancel className="anticon" />}
        onClick={() => confirm()}
        hidden={["Cancelled", "InProduction", "Fulfilled"].includes(
          order.status
        )}
      >
        Cancel
      </Menu.Item>
      <Menu.Item
        hidden={
          !(
            ["Error"].includes(status) &&
            order?.productVariant?.productBase?.fulfillment?.type === "BuiltIn"
          )
        }
        key="re-submit"
        icon={<BiErrorCircle className="anticon" />}
      >
        Error
      </Menu.Item>
    </Menu>
  );

  const orderStatus = statusColor.find((el) => el.value === order?.status);

  const availableMockup = order?.product?.mockups?.find(
    (el) => el.variantId === order?.productVariant?.id
  );

  const imageMockup = availableMockup
    ? availableMockup.image
    : order.product?.mockups && order.product?.mockups[0]?.image;

  return (
    <Container>
      <div className="flex space-between item-center">
        <div>
          <div className="mb-10 flex item-center">
            <span style={{ fontSize: 16, marginRight: 15 }}>
              Order: #{order?.originId}
            </span>
            {orderStatus ? (
              <Tag className="mb-10" className={orderStatus.color}>
                {orderStatus.name}
              </Tag>
            ) : null}
          </div>
          <div className="mb-10">
            {moment(order?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
        <div>
          <AuthElement name={permissions.OrderUpdate}>
            <Dropdown overlay={actionMenu()}>
              <Button type="link">
                More Actions <IoIosArrowDown className="anticon" />
              </Button>
            </Dropdown>
          </AuthElement>
        </div>
      </div>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "120px auto" }}>
              <div style={{ width: 100 }}>
                <Image
                  style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
                  width="105px"
                  height="105px"
                  preview={{
                    src: `${process.env.CDN_URL}/autoxauto/${imageMockup}`,
                  }}
                  src={`${process.env.CDN_URL}/300x300/${imageMockup}`}
                  fallback={`/no-preview.jpg`}
                />
              </div>
              <div className="grid">
                <h4>{order?.product?.title}</h4>
                <span>
                  Product base: {order?.productVariant?.productBase?.title}
                </span>
                <span>SKU: {order?.productVariant?.sku}</span>
                {order?.productVariant?.productBaseVariant?.attributes.map(
                  (attri, index) => (
                    <span key={index}>
                      {attri.name}: {attri.value}
                    </span>
                  )
                )}
              </div>
            </div>
            <Collapse
              className="mt-15"
              defaultActiveKey={["designs", "customization"]}
              expandIconPosition="right"
            >
              <Collapse.Panel key="designs" header="Designs">
                <OrderDesignFile refetch={refetch} order={order} />
              </Collapse.Panel>
              <Collapse.Panel key="customization" header="Customization">
                <Customization refetch={refetch} order={order} />
              </Collapse.Panel>
            </Collapse>
          </Card>
          <Card className="mt-15" title="Timeline">
            <Scrollbars style={{ width: "auto", height: "300px" }}>
              <Timeline>
                {order?.orderTimeline?.length
                  ? order?.orderTimeline.map((item, index) => (
                      <Timeline.Item key={index}>
                        {item?.title} on{" "}
                        {moment(item?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                        <>
                          <div style={{ color: "gray", fontSize: 12 }}>
                            {item.user
                              ? "By: " +
                                item.user.firstName +
                                " " +
                                item.user.lastName
                              : null}
                          </div>
                        </>
                      </Timeline.Item>
                    ))
                  : null}
              </Timeline>
            </Scrollbars>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ShippingAddress
              refetch={refetch}
              order={order}
              edit={edit}
              setEdit={setEdit}
              detail={true}
            />
          </Card>
          <Card className="mt-15">
            <h3 className="mb-10 ">Order summary</h3>
            <div className="mb-10 flex space-between">
              <span>
                <b>Order total:</b>
                <span className="ml-15">{order?.quantity} item</span>
              </span>
              <span>{order?.quantity * order?.price} $</span>
            </div>
            <div className="flex space-between">
              <b>Order base cost:</b>
              <span>{order?.baseCost} $</span>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        className="no-padding-modal"
        title={isEmpty(order?.tracking) ? "Add Tracking" : "Edit Tracking"}
        visible={visible}
        onCancel={handleClose}
        key={order?.id}
        footer={
          <div>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              form="add-tracking"
              loading={loadingAddTracking}
            >
              Save
            </Button>
          </div>
        }
      >
        {formAddTracking}
      </Modal>
    </Container>
  );
};

export default OrderForm;
