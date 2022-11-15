import { Button, Card } from "antd";
import React from "react";
import styled from "styled-components";
import Billing from "./Billing";
import PaymentMethod from "./PaymentMethod";

const Container = styled.div`
  margin: 0 26px;
  .padding-card {
    margin-top: 26px;
  }
`;

const Overview = () => {
  const item = {
    plan: "free",
    paymentMethod: "credit card",
  };
  return (
    <Container>
      <Billing />
      <PaymentMethod />
      <Card className="padding-card" title="Cancel Subscription">
        <div>
          Cancelled subscription will remain active until the end of current
          billing period.
        </div>
        <Button className="mt-15">Cancel Subscription</Button>
      </Card>
    </Container>
  );
};
export default Overview;
