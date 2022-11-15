import { Button, Card, Col, Row } from "antd";
import React from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { TiArrowUpThick } from "react-icons/ti";
import styled from "styled-components";

const Container = styled.div``;

const Billing = () => {
  const item = {
    plan: "free",
    paymentMethod: "credit card",
  };
  return (
    <Container>
      <Card title="Billing">
        <Row gutter={[24, 24]}>
          <Col className="cap-text" span={12}>
            Current Plan: {item.plan}
          </Col>
          <Col span={12}>
            <p className="flex space-between">
              20 Orders <span>(2/25)</span>
            </p>
            <p className="flex space-between">
              0.55 GB Storage <span>(21.95/100)</span>
            </p>
          </Col>
        </Row>
        {item.plan === "free" ? (
          <Button
            className="mt-15"
            icon={<TiArrowUpThick className="custom-icon anticon" />}
          >
            Upgrade Plan
          </Button>
        ) : (
          <Button
            className="mt-15"
            icon={<FaExchangeAlt className="custom-icon anticon" />}
          >
            Change Plan
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default Billing;
