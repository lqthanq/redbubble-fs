import { CAMPAIGN } from "actions";
import { Button } from "antd";
import AddCampaignStep1 from "components/Campaigns/AddCampaignStep1";
import { useAppValue } from "context";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 50% 50%;
  padding: 15px 50px;
  margin: auto;
  height: 100%;
  width: 100%;
`;

const NewCampaign = () => {
  const [{ campaign }, dispatch] = useAppValue();
  const [showBases, setShowBases] = useState(false);
  return (
    <Container>
      <div>
        <h1>
          Let's start creating your <br /> campaign!
        </h1>
        <p style={{ fontSize: 24 }}>
          It's easy. Browse product bases, add your
          <br /> artwork, and push to your shop.
        </p>
        <Button
          type="primary"
          onClick={() => {
            setShowBases(true);
            dispatch({
              type: CAMPAIGN.RESET,
            });
          }}
        >
          Browse Product Bases
        </Button>
      </div>
      <div>
        <img
          alt="logo"
          src="/images/bg.png"
          style={{
            maxWidth: "-webkit-fill-available",
            filter: "hue-rotate(75deg)",
          }}
        />
      </div>
      <AddCampaignStep1 showBases={showBases} setShowBases={setShowBases} />
    </Container>
  );
};

export default NewCampaign;
