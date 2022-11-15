import React from "react";
import { useRouter } from "next/router";
import {
  Table,
  Dropdown,
  Space,
  Menu,
  Button,
  Input,
  Tabs,
  Pagination,
  Typography,
  Tag,
} from "antd";
import moment from "moment";
import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import { AiOutlineEye, AiOutlineUpload } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";
import { FcAcceptDatabase, FcCancel } from "react-icons/fc";

import styled from "styled-components";

const { Title,Text } = Typography;

import PaymentFilter from "./PaymentFilter";

const { TabPane } = Tabs;

const Payments = () => {

  const Container = styled.div`
  margin: 26px;

  .succeeded {
    color: #3c484d;
    background: #82d7cf;
    border-color: #00ae9f;
    width: 75px;
    text-align: center;
    
  }
  .refunded {
    color: #3c484d;
    background: #fee198;
    border-color: #fdc340;
    width: 75px;
    text-align: center;
  }
`;
  const router = useRouter();
  const menu = (
    <Menu>
      <Menu.Item>
        <a>
          {" "}
          <AiOutlineEye className="anticon custom-icon" />
          Quick view
        </a>
      </Menu.Item>
      <Menu.Item>
        <a>
          {" "}
          <BiDetail className="anticon custom-icon" />
          View Detail
        </a>
      </Menu.Item>
      <Menu.Item>
        <a>
          {" "}
          <FcAcceptDatabase className="anticon custom-icon" />
          Accept Design
        </a>
      </Menu.Item>
      <Menu.Item>
        <a>
          {" "}
          <AiOutlineUpload className="anticon custom-icon" />
          Upload Custom Design
        </a>
      </Menu.Item>
      <Menu.Item>
        <a>
          {" "}
          <FcCancel className="anticon custom-icon" />
          Cancel
        </a>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => <span>{"$" + text}</span>,
    },

    
    {
      dataIndex: "status",
      key: "status",
      render: (text,record) => <Tag className = {text == true ? 'succeeded':'refunded'  }> 
      {text == true ? 'Succeeded' : 'Refunded'}</Tag>
    },

    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => (
        <a onClick={() => router.push("/subscriptions/payment/abc")}>{text}</a>
      ),
    },
  
    {
      title: "Customer",
      dataIndex: "customer",
      width: 400,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        return <span>{moment(date).format("MMMM Do YYYY, h:mm:ss a")}</span>;
      },
    },
    {
      title: "Action",
      key: "acction",
      fixed: "left",
      render: (text, record) => (
        <Space size="middle">
          <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
      
    },
  ];

  const data = [
    {
      key: "1",
      amount: "599",
      description: "Invoice 2020",
      customer: "customer_email@gmail.com",
      date: "2021-09-12T03:57:35Z",
      status: true,
    },
    {
      key: "2",
      amount: "599",
      description: "Invoice 2020",
      customer: "customer_email@gmail.com",
      date: "2021-09-12T03:57:35Z",
      status: true,
    },
    {
      key: "3",
      amount: "599",
      description: "Invoice 2020",
      customer: "customer_email@gmail.com",
      date: "2021-09-12T03:57:35Z",
      status: true,
    },
    {
      key: "4",
      amount: "599",
      description: "Invoice 2020",
      customer: "customer_email@gmail.com",
      date: "2021-09-12T03:57:35Z",
      status: false,
    },
    {
      key: "5",
      amount: "599",
      description: "Invoice 2020",
      customer: "customer_email@gmail.com",
      date: "2021-09-12T03:57:35Z",
      status: false,
    },
    {
      key: "6",
      amount: "599",
      description: "Invoice 2020",
      customer: "customer_email@gmail.com",
      date: "2021-09-12T03:57:35Z",
      status: true,
    },
  ];

  const dataSus = [];
  const dataRefund = [];

  data.forEach((obj) => {
    if (obj.status == true) {
      dataSus.push(obj);
    } else {
      dataRefund.push(obj);
    }
  });
  const totalSus = dataSus
    .reduce((susTotal, meal) => susTotal + parseFloat(meal.amount), 0)
    .toFixed(2);
  const totalRefund = dataRefund
    .reduce((refundTotal, meal) => refundTotal + parseFloat(meal.amount), 0)
    .toFixed(2);

  const search = (
    <div
      id="search"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Input
        placeholder={"Search..."}
        style={{ width: "100%", marginRight: "10px" }}
      />
      <PaymentFilter></PaymentFilter>
    </div>
  );
  return (
    <Container>
      <Title level={4} >Subcription / Payments</Title>
        <div className="card-container" style={{ marginTop: "20px" }}>
              <Tabs type="card">
                <TabPane tab="ALL" key="3">
                  {search}
                  <div>
                    <Table
                      rowSelection={true}
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                      style={{ marginTop: "15px" }}
                    />
                  </div>
                </TabPane>
                <TabPane tab="Succeeded" key="4">
                  {search}
                  <Table
                    rowSelection={true}
                    columns={columns}
                    dataSource={dataSus}
                    pagination={false}
                    style={{ marginTop: "15px" }}
                  />
                </TabPane>
                <TabPane tab="Refunded" key="5">
                  {search}
                  <Table
                    rowSelection={true}
                    columns={columns}
                    dataSource={dataRefund}
                    pagination={false}
                    style={{ marginTop: "15px" }}
                  />
                </TabPane>
              </Tabs>
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Pagination />
                </div>
                <div style={{ textAlign: "end" }}>
                  <Text style={{ display: "block" }}>
                    Showing 1 to 10 of 120 items
                  </Text>
                  <Text style={{ display: "block" }}>
                    Total succeeded amount: ${totalSus}
                  </Text>
                  <Text>Total refund amount: ${totalRefund}</Text>
                </div>
              </div>
            </div>
    </Container>
  );
};

export default Payments;
