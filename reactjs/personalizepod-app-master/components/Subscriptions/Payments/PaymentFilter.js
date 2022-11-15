import React, { useState } from "react";
import { Button, Drawer, Select, Radio, Collapse, Space } from "antd";
const { Option } = Select;
const { Panel } = Collapse;
const PaymentFilter = () => {
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

  const customerSelect = (
    <Select
      showSearch
      style={{ width: 350 }}
      placeholder="Select a customer"
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="tom">Tom</Option>
    </Select>
  );

  const radio = (
    <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
      <Space direction="vertical">
        <Radio value={1}>All time</Radio>
        <Radio value={2}>Today</Radio>
        <Radio value={3}>Yesterday</Radio>
        <Radio value={4}>Last 7 days</Radio>
        <Radio value={5}>This month</Radio>
        <Radio value={6}>Last month</Radio>
        <Radio value={7}>Custom</Radio>
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
          <Button
            onClick={onClose}
            type="primary"
          >
            Done
          </Button>
        </div>
      }
    >
      <div>
        <Collapse bordered={false} expandIconPosition="right" ghost={true}>
          <Panel header="Customer">{customerSelect}</Panel>
          <Panel header="Time">{radio}</Panel>
        </Collapse>
      </div>
    </Drawer>
  );

  return (
    <div>
      <Button onClick={showDrawer}>More filters</Button>
      {drawer}
    </div>
  );
};

export default PaymentFilter;
