import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { values } from "lodash";
const Container = styled.div`
  margin: 26px;
`;
const SELLER_PLANSTATISTIC = gql`
  query sellerPlanStatistic {
    sellerPlanStatistic
  }
`;
const StatsCard = () => {
  const { data } = useQuery(SELLER_PLANSTATISTIC);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (data) {
      setFiles(data?.sellerPlanStatistic);
    }
  }, [data]);

  var dataOrder = [];
  var dataSellerPlanstatistic = [];
  var dataQuota = [];
  Object.entries(files).map(([key, value]) => {
    if (key.match(/order/gi) == "order") {
      dataOrder.push([key, value]);
      Object.fromEntries(dataOrder);
    } else {
      dataQuota.push([key, value]);
      Object.fromEntries(dataQuota);
    }
  });

  dataSellerPlanstatistic.push(
    Object.fromEntries(dataOrder),
    Object.fromEntries(dataQuota)
  );
  console.log(dataSellerPlanstatistic);

  return (
    <div style={{display: "flex"}}>
      {dataSellerPlanstatistic.map((data) => (
        <Container>
          <Card
            title={data.total_orders ? "Monthly Orders" : "Lifetime Storages"}
          >
            <Row>
              <Col span={24} className="p-title-category">
                <span>
                  {data.total_orders ? "Total orders" : "Total quota"}
                </span>
                <span
                  className="mb-15"
                  style={{ float: "right", fontSize: "20px" }}
                >
                  {data.total_orders ? data.total_orders : data.total_quota}
                </span>
              </Col>
              <Col span={24} className="p-title-category">
                <span>{data.total_orders ? "Plan orders" : "Plan quota"}</span>
                <span className="mb-15" style={{ float: "right" }}>
                  {data.total_orders ? data.plan_orders : data.plan_quota}
                </span>
              </Col>
              <Col span={24} className="p-title-category">
                <span>
                  {data.total_orders ? "Remaining orders" : "Remaining quota"}
                </span>
                <span className="mb-15" style={{ float: "right" }}>
                  {data.total_orders
                    ? data.remaining_orders
                    : data.remaining_quota}
                </span>
              </Col>
              <Col span={24} className="p-title-category">
                <span>
                  {data.total_orders ? "Extra orders" : "Extra quota"}
                </span>
                <span className="mb-15" style={{ float: "right" }}>
                  {data.total_orders ? data.extra_orders : data.extra_quota}
                </span>
              </Col>
              <Col span={24} className="p-title-category">
                <span>
                  {data.total_orders ? "Extra fee per order" : "Extra fee per GB"}
                </span>
                <span className="mb-15" style={{ float: "right"}}>
                  {data.total_orders ? data.extra_fee_per_order + "%" : "$" + data.extra_fee_per_GB}
                </span>
              </Col>
              <Col span={24}>
                <a className="align-action mb-15">View details</a>
              </Col>
            </Row>
          </Card>
        </Container>
      ))}
    </div>
  );
};
export default StatsCard;
