import { Button, Checkbox, Collapse, Divider, Form, Input, Radio } from "antd";
import React, { useState } from "react";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { forEach } from "lodash";
import styled from "styled-components";
const Container = styled.div`
  .ant-check-group {
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
const ColorManagementFilter = ({ filter, setFilter }) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data, loading } = useQuery(FULFILLMENTS, {
    variables: { search: search },
  });
  const onhandleChangeValue = (valueChange, values) => {
    forEach(values, (value, key) => {
      if (value && value.length !== 0 && value !== []) {
        setFilter({
          ...filter,
          ...values,
        });
        router.query[key] = value;
        router.query.page = 1;
      } else {
        delete router.query[key];
      }
      router.push(router);
    });
  };
  return [
    <Container>
      <Form id="formFilter" form={form} onValuesChange={onhandleChangeValue}>
        <Collapse
          className="p-collapse-filter"
          expandIconPosition="right"
          bordered={false}
        >
          <Collapse.Panel header="Fulfillment">
            <Input.Search
              placeholder="Filter collection"
              className="mb-10"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Form.Item
              noStyle
              className="scroll-filter"
              initialValue={filter?.fulfillmentId}
              name="fulfillmentId"
            >
              <Checkbox.Group style={{ width: "100%" }}>
                {data?.fulfillments?.map((item) => (
                  <div key={item.id}>
                    <Checkbox value={item.id}>{item.title}</Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              type="link"
              disabled={router?.query?.fulfillmentId ? false : true}
              onClick={() => {
                setFilter({
                  ...filter,
                  fulfillmentId: [],
                });
                delete router.query.fulfillmentId;
                router.push(router);
                form.setFieldsValue({
                  fulfillmentId: [],
                });
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
        </Collapse>
      </Form>
    </Container>,
    { form },
  ];
};

export default ColorManagementFilter;
