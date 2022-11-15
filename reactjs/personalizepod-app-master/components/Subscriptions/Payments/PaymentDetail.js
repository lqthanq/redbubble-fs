import React from "react";
import { Card, Tag, Row, Col, Menu, Dropdown, Button, Typography } from "antd";
import styled from "styled-components";
import { GiPayMoney } from "react-icons/gi";
const { Title } = Typography;

const PaymentDetail = () => {
  const Container = styled.div`
    margin: 26px;

    .paid {
      color: #2c404b;
      background: #89b9b1;
      border-color: #41877f;
      width: 75px;
      text-align: center;
    }
    .pending {
      color: #2c404b;
      background: #f3c19d;
      border-color: #ea9252;
      width: 75px;
      text-align: center;
    }
  `;

  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {" "}
      {/* Card 1 */}
      <Container>
        <Title level={4}>Subcription / Payment Detail</Title>
        <Card>
          <div
            className="flex space-between"
            style={{
              borderBottom: "solid 1px #f0f0f0",
              margin: "10px 0 10px 0",
            }}
          >
            <div>
              <p>
                <GiPayMoney />
                <span style={{ marginLeft: "5px" }}>Payment</span>
              </p>
              <div className="flex space-between">
                <p>
                  <span style={{ fontSize: "35px" }}>$599.00USD</span>
                </p>
                <p>
                  <span>
                    <Tag
                      style={{ margin: "17px 0px 0px 12px" }}
                      className="paid"
                    >
                      Succeeded
                    </Tag>
                  </span>
                </p>
              </div>
            </div>
            <Dropdown
              style={{ marginTop: "20px" }}
              overlay={menu}
              placement="bottomRight"
            >
              <Button>Actions</Button>
            </Dropdown>
          </div>
          <Row>
            <Col span={6} style={{ borderRight: "solid 1px #f0f0f0" }}>
              <Col span={10}>Date</Col>
              <span>Apr 29, 2021, 2:11PM</span>
            </Col>
            <Col span={12} style={{ marginLeft: "150px" }}>
              <p>
                <Col>Customer</Col>
                <span>customer_email@gmail.com</span>
              </p>
            </Col>
            <Col span={24}>
              <p style={{ fontWeight: "bold" }}>Payment details</p>
            </Col>
            <Col span={12}>Amount</Col>
            <Col span={12}>
              <p className="flex space-between">
                <span className="right">$599</span>
              </p>
            </Col>
            <Col span={12}>Status</Col>
            <Col span={12}>
              <p className="flex space-between">
                <span className="right">Succeeded</span>
              </p>
            </Col>
            <Col span={12}>Description</Col>
            <Col span={12}>
              <p className="flex space-between">
                <span className="right">Invoice 2000</span>
              </p>
            </Col>
            <Col span={12}>Paid via</Col>
            <Col span={12}>
              <p className="flex space-between">
                <span className="right">Stripe</span>
              </p>
            </Col>
            <Col span={12}>Transaction ID</Col>
            <Col span={12}>
              <p className="flex space-between">
                <span className="right">src_1FVv31F6nnxhNfhGDf4S7uju</span>
              </p>
            </Col>
          </Row>
        </Card>
      </Container>
      {/* // */}
    </div>
  );
};

export default PaymentDetail;
