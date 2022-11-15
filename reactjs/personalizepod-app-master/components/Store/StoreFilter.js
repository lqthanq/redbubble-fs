import { Button, Collapse, Divider, Form, Radio } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { forEach } from "lodash";

const Container = styled.div`
  .clear-filter-item {
    margin-top: 10px;
    padding: 0;
  }
  .ant-radio-group {
    display: grid;
  }
  .ant-select {
    width: 200px;
  }
  .ant-collapse-borderless {
    background-color: transparent;
  }
  .p-collapse-filter .ant-collapse {
    background-color: transparent;
  }
  .clear-filter-item {
    margin-top: 10px;
    padding: 0;
  }
`;

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const StoreFilter = ({ filter, setFilter }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const handleChange = (valueChange, values) => {
    setFilter({
      ...filter,
      ...values,
    });
    forEach(values, (value, key) => {
      if (value !== null) {
        router.query[key] = value;
      } else {
        delete router.query[key];
      }
      router.push(router);
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      platform: filter.platform,
      status: filter.status,
    });
  }, [filter]);

  return (
    <Container>
      <Form
        form={form}
        className="p-collapse-filter"
        onValuesChange={handleChange}
      >
        <Collapse expandIconPosition="right" bordered={false}>
          <Collapse.Panel header="Platform">
            <Form.Item noStyle initialValue={filter.platform} name="platform">
              <Radio.Group>
                <Radio style={radioStyle} value={null}>
                  All
                </Radio>
                <Radio style={radioStyle} value="woocommerce">
                  Woocommerce
                </Radio>
                <Radio style={radioStyle} value="shopify">
                  Shopify
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              type="link"
              disabled={filter.platform ? false : true}
              onClick={() => {
                setFilter({
                  ...filter,
                  platform: null,
                });
                delete router.query.platform;
                router.push(router);
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
          <Collapse.Panel header="Status">
            <Form.Item noStyle initialValue={filter.status} name="status">
              <Radio.Group>
                <Radio style={radioStyle} value={null}>
                  All
                </Radio>
                <Radio style={radioStyle} value={true}>
                  Connected
                </Radio>
                <Radio style={radioStyle} value={false}>
                  Disconnected
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              type="link"
              disabled={filter.status !== null ? false : true}
              onClick={() => {
                setFilter({
                  ...filter,
                  status: null,
                });
                delete router.query.status;
                router.push(router);
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
        </Collapse>
      </Form>
    </Container>
  );
};

export default StoreFilter;
