import ConfigPlans from "components/Subscriptions/Pricing-plans/ConfigPlans";
import React from "react";

const ConfigPlansPage = () => {
  return (
    <div>
      <h3
        style={{
          margin: "0 26px 15px",
        }}
      >
        Config Plans
      </h3>
      <ConfigPlans />
    </div>
  );
};

ConfigPlansPage.title = "Subscription / Pricing plans";
export default ConfigPlansPage;
