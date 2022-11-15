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

const SellerFilter = ({ filter, setFilter }) => {
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
      block: filter.block,
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
          <Collapse.Panel header="Suspend">
            <Form.Item noStyle initialValue={filter.block} name="block">
              <Radio.Group>
                <Radio style={radioStyle} value={null}>
                  All
                </Radio>
                <Radio style={radioStyle} value={true}>
                  Suspended
                </Radio>
                <Radio style={radioStyle} value={false}>
                  Unsuspended
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              type="link"
              disabled={filter.block !== null ? false : true}
              onClick={() => {
                setFilter({
                  ...filter,
                  block: null,
                });
                delete router.query.block;
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

export default SellerFilter;
