import React, { useState } from "react";
import { Button, Drawer, Radio, Collapse, Space } from "antd";

const { Panel } = Collapse;

const StatsMoreFilters = () => {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
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
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} type="primary">
            Done
          </Button>
        </div>
      }
    >
      <Collapse bordered={false} expandIconPosition="right" ghost={true}>
        <Panel header="File organization">{radio}</Panel>
      </Collapse>
    </Drawer>
  );
  return (
    <div>
      <Button onClick={showDrawer}>More Filters</Button>
      {drawer}
    </div>
  );
};

export default StatsMoreFilters;
