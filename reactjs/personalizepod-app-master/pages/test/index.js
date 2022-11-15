import React, { useState } from "react";
import {
  Table,
  Card,
  Tag,
  Row,
  Col,
  Item,
  Menu,
  Dropdown,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Collapse,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from "moment";
import { GiPayMoney } from "react-icons/gi";
import Meta from "antd/lib/card/Meta";

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

const { Option } = Select;
const { Panel } = Collapse;

const Test = () => {
  // const columns = [
  //   {
  //     title: "Date",
  //     dataIndex: "date",
  //     key: "date",
  //     width: 350,
  //     render: (date) => {
  //       return <span>{moment(date).format("MMMM Do, YYYY")}</span>;
  //     },
  //   },
  //   {
  //     title: "Period",
  //     dataIndex: ["from", "to"],
  //     render: (from, record) => {
  //       return (
  //         <span>
  //           {moment(from).format("MMMM Do, YYYY") +
  //             "-" +
  //             moment(record.to).format("MMMM Do, YYYY")}
  //         </span>
  //       );
  //     },
  //   },

  //   {
  //     title: "Amount",
  //     dataIndex: "amount",
  //     key: "amount",
  //     width: 20,
  //     padding: 0,
  //     render: (amount) => {
  //       return <span>{"$" + amount}</span>;
  //     },
  //   },
  //   {
  //     dataIndex: "status",
  //     key: "status",
  //     width: 150,
  //     render: (status, record) => (
  //       console.log(record),
  //       (
  //         <Tag className={status === "paid" ? "paid" : "pending"}>
  //           {record.status.charAt(0).toLocaleUpperCase() +
  //             record.status.slice(1)}
  //         </Tag>
  //       )
  //     ),
  //   },
  //   { dataIndex: "view", key: "view", width: 100, render: () => <a>View</a> },

  // ];

  // const data = [
  //   {

  //     date: "2021-05-04T04:12:39Z",
  //     from: "2021-04-12T03:57:35Z",
  //     to: "2021-06-12T03:57:35Z",
  //     amount: "24.00",
  //     status: "paid",
  //   },
  //   {
  //     date: "2021-04-20T11:29:56Z",
  //     from: "2021-01-12T03:57:35Z",
  //     to: "2021-07-12T03:57:35Z",
  //     amount: "24.00",
  //     status: "paid",
  //   },
  //   {
  //     date: "2021-04-14T10:09:58Z",
  //     from: "2021-02-12T03:57:35Z",
  //     to: "2021-08-12T03:57:35Z",
  //     amount: "24.00",
  //     status: "paid",
  //   },
  //   {
  //     date: "2021-04-05T02:01:02Z",
  //     from: "2021-03-12T03:57:35Z",
  //     to: "2021-09-12T03:57:35Z",
  //     amount: "24.00",
  //     status: "pending",
  //   },
  // ];

  // const menu = (
  //   <Menu>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
  //         1st menu item
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
  //         2nd menu item
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
  //         3rd menu item
  //       </a>
  //     </Menu.Item>
  //   </Menu>
  // );

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  // const customerSelect = (
  //   <Select
  //     showSearch
  //     style={{ width: 350 }}
  //     placeholder="Select a customer"
  //     optionFilterProp="children"
  //     onChange={onChange}
  //     onSearch={onSearch}
  //     filterOption={(input, option) =>
  //       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //     }
  //   >
  //     <Option value="jack">Jack</Option>
  //     <Option value="lucy">Lucy</Option>
  //     <Option value="tom">Tom</Option>
  //   </Select>
  // );

  const radio = (
    <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
      <Space direction="vertical">
        <Radio value={1}>All</Radio>
        <Radio value={2}>Clipart</Radio>
        <Radio value={3}>Mockup</Radio>
        <Radio value={4}>Artwork</Radio>
        <Radio value={5}>Print file</Radio>
        <Radio value={6}>Media</Radio>
        <Radio value={7}>Other</Radio>
      </Space>
    </Radio.Group>
  );

  const drawer = (
    <Drawer
      bodyStyle={{ padding: "6px" }}
      closable={true}
      width="400px"
      title="More filters"
      placement="right"
      onClose={onClose}
      visible={visible}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={onClose} type="primary">
            Done
          </Button>
        </div>
      }
    >
      <div>
        <Collapse bordered={false} expandIconPosition="right" ghost={true}>
          {/* <Panel header="Customer">{customerSelect}</Panel> */}
          <Panel header="File organization">{radio}</Panel>
        </Collapse>
      </div>
    </Drawer>
  );
  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      {drawer}
      {/* Card 1 */}
      {/* <Container>
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
            <Dropdown style={{ marginTop: "20px" }} overlay={menu} placement="bottomRight">
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
      </Container> */}
      {/* // */}

      {/* Card 2 */}
      {/* <div className="flex">
        <Container>
          <Card title="Monthly Orders">
            <Row>
              <Col span={12}>Total Orders</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span className="right" style={{ fontSize: "20px" }}>
                    2,200
                  </span>
                </p>
              </Col>
              <Col span={12}>Plan Orders</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span className="p-2">2,000</span>
                </p>
              </Col>
              <Col span={12}>Remaining orders</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span className="p-2">0</span>
                </p>
              </Col>
              <Col span={12}>Extra orders</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span className="p-2">200</span>
                </p>
              </Col>
              <Col span={12}>Extra fee per order</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span className="p-2">0.6%</span>
                </p>
              </Col>
              <Col span={24}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <a className="p-2">View details</a>
                </p>
              </Col>
            </Row>
          </Card>
        </Container> */}
      {/* // */}
      {/* Card 3 */}
      {/* <Container>
          <Card title="Lifetime Storages">
            <Row>
              <Col span={12}>Total Quota</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span style={{ fontSize: "20px" }}>120</span>
                </p>
              </Col>
              <Col span={12}>Plan quota</Col>
              <Col span={12}>
                <p className="flex" style={{ justifyContent: "flex-end" }}>
                  <span>100</span>
                </p>
              </Col>
              <Col span={12}>Remaining quota</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span>0</span>
                </p>
              </Col>
              <Col span={12}>Extra quota</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span>20</span>
                </p>
              </Col>
              <Col span={12}>Extra fee per GB</Col>
              <Col span={12}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span>$1.5</span>
                </p>
              </Col>
              <Col span={24}>
                <p
                  className="flex space-between"
                  style={{ justifyContent: "flex-end" }}
                >
                  <a>View details</a>
                </p>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
      <Container>
        <Card title="Invoices">
          <Table columns={columns} dataSource={data} pagination={false} />
        </Card>
      </Container> */}
    </div>
  );
};

export default Test;
