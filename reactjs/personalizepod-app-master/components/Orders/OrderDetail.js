import { Col, Row, Table, Tag, Timeline, Image } from "antd";
import { sum } from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import { statusColor } from "./StatusOrder";
import ShippingAddress from "./ShippingAddress";
import moment from "moment";
import Scrollbars from "components/Utilities/Scrollbars";

const Container = styled.div`
  .ant-form-item-label {
    padding: 0;
  }
  .ant-form-item {
    margin-bottom: 10px;
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

const OrderDetail = ({ refetch, orderItem }) => {
  const [edit, setEdit] = useState(false);

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 300,
      render: (product, record) => {
        const availableMockup = product?.mockups?.find(
          (el) => el.variantId === record?.productVariant?.id
        );
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px auto",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Image
              style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
              width="90px"
              height="90px"
              preview={{
                src: `${process.env.CDN_URL}/autoxauto/${
                  availableMockup
                    ? availableMockup.image
                    : product?.mockups && product?.mockups[0]?.image
                }`,
              }}
              src={`${process.env.CDN_URL}/300x300/${
                availableMockup
                  ? availableMockup.image
                  : product?.mockups && product?.mockups[0]?.image
              }`}
              fallback={`/no-preview.jpg`}
            />
            <span className="ml-15">{product?.title}</span>
          </div>
        );
      },
    },
    {
      title: "SKU",
      key: "sku",
      dataIndex: "productVariant",
      width: 200,
      render: (productVariant) =>
        `${productVariant?.productBase ? productVariant.productBase?.sku : ""}`,
    },
    {
      title: "Designs",
      dataIndex: "designs",
      key: "designs",
      width: 80,
      render: (design) => (
        <div
          hidden={!(design && design.length)}
          className="clipart"
          style={{
            backgroundImage: `url(${process.env.CDN_URL}/100x100/${design?.map(
              (el) => el.file?.key
            )})`,
          }}
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "qty",
      width: 50,
      align: "right",
    },
    {
      title: "Base cost",
      dataIndex: "baseCost",
      key: "baseCost",
      width: 120,
      align: "right",
      render: (baseCost) => `$ ${baseCost}`,
    },
  ];

  const tableWidth = sum(columns.map((c) => c.width));
  const orderStatus = statusColor.find((el) => el.value === orderItem?.status);

  return (
    <Container>
      <Row>
        <Col
          span={16}
          className="p-24"
          style={{ borderRight: "1px solid #f0f0f0" }}
        >
          <div className="mb-15 flex item-center">
            <h3 style={{ margin: "0 15px 0 0" }}>Order Info</h3>
            {orderStatus ? (
              <Tag className={orderStatus.color}>{orderStatus.name}</Tag>
            ) : null}
          </div>
          <Table
            style={{ border: "1px solid #f0f0f0", borderWidth: "1px 1px 0" }}
            rowKey="id"
            pagination={false}
            dataSource={[orderItem]}
            columns={columns}
            scroll={{ x: tableWidth }}
          />
          <h3 style={{ margin: "24px 0 15px 0" }}>Time line</h3>
          <Scrollbars style={{ width: "auto", height: "360px" }}>
            <Timeline>
              {orderItem?.orderTimeline?.length
                ? orderItem?.orderTimeline.map((item, index) => (
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
        </Col>
        <Col span={8} className="p-24">
          <ShippingAddress
            refetch={refetch}
            order={orderItem}
            edit={edit}
            setEdit={setEdit}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetail;
