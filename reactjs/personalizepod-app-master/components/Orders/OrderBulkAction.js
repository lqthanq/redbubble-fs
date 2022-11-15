import { Button, Dropdown } from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import React from "react";
import styled from "styled-components";
import { CaretDownOutlined } from "@ant-design/icons";
import OrderExport from "./OrderExport";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  background-color: #fafafa;
  .default {
    cursor: default;
    pointer-events: none;
  }
`;

const OrderBulkAction = ({
  selectedRowKeys,
  refetch,
  setSelectedRowKeys,
  orders,
}) => {
  var getOrders = orders?.reduce((init, order) => {
    if (selectedRowKeys.includes(order.id)) {
      init.push(order);
    }
    return init;
  }, []);

  var availableOrders = getOrders?.filter(
    (item) =>
      item.productVariant?.productBase?.fulfillment?.type === "Custom" ||
      item.status === "Error"
  );

  return (
    <Container>
      <AuthElement name={permissions.OrderExport}>
        <ButtonGroup>
          <Button className="default">
            {selectedRowKeys.length} order
            {`${selectedRowKeys.length > 1 ? "s" : ""}`} selected
          </Button>
          <Dropdown
            trigger="click"
            disabled={!selectedRowKeys.length}
            overlay={
              <OrderExport
                refetch={refetch}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
              />
            }
            disabled={
              !selectedRowKeys.length ||
              availableOrders?.length !== getOrders?.length
            }
          >
            <Button type="primary">
              Export <CaretDownOutlined />
            </Button>
          </Dropdown>
        </ButtonGroup>
      </AuthElement>
    </Container>
  );
};

export default OrderBulkAction;
