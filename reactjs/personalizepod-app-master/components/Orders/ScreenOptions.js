import { Checkbox } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import { SAVE_SCREEN_OPTION } from "graphql/mutate/order/orderAction";
import { useMutation } from "@apollo/client";
import { useAppValue } from "context";
import { isAdmin } from "components/Utilities/isAdmin";

const Container = styled.div`
  .ant-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    padding: 0 24px;
  }
  .ant-checkbox-group-item {
    width: 15%;
    padding: 10px;
  }

  .ant-checkbox-wrapper {
    width: 15%;
    padding: 10px 0;
    margin-left: 0px;
  }
  @media only screen and (max-width: 768px) {
    .ant-checkbox-group-item {
      width: 20%;
    }
  }
  @media only screen and (max-width: 768px) {
    .ant-checkbox-group-item {
      width: 20%;
    }
  }
  @media only screen and (max-width: 640px) {
    .ant-checkbox-group-item {
      width: 40%;
    }
  }
`;

const ScreenOptions = ({ className, checkOption, setCheckOption }) => {
  const [{ currentUser }] = useAppValue();
  const [SaveScreenOption] = useMutation(SAVE_SCREEN_OPTION);
  const options = [
    // { label: "Order ID", value: "id" },
    { label: "Origin ID", value: "originId" },
    // { label: "SKU", value: "sku" },
    { label: "Product", value: "product" },
    { label: "Product Bases", value: "productBases" },
    { label: "Attributes", value: "attributes" },
    { label: "Qty", value: "qty" },
    { label: "Cost", value: "cost" },
    { label: "Shipping Cost", value: "shippingCost" },
    { label: "Revenue", value: "revenue" },
    { label: "Store", value: "store" },
    { label: "Seller", value: "seller" },
    { label: "Fulfillment", value: "fulfillment" },
    { label: "Created At", value: "createdAt" },
    { label: "Tracking", value: "tracking" },
    { label: "Status", value: "status" },
  ];
  useEffect(() => {
    if (currentUser) {
      setCheckOption(
        currentUser.screenOption?.length
          ? currentUser.screenOption
          : [
              "originId",
              "product",
              "productBases",
              "qty",
              "cost",
              "revenue",
              "store",
              "fulfillment",
              "tracking",
              "status",
            ]
      );
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setCheckOption(e);
    SaveScreenOption({
      variables: {
        options: e,
      },
    }).then();
  };
  return (
    <Container className={className}>
      <Checkbox.Group
        value={checkOption}
        options={
          isAdmin() ? options : options.filter((opt) => opt.value !== "seller")
        }
        onChange={(e) => {
          handleChange(e);
        }}
      />
    </Container>
  );
};

export default ScreenOptions;
