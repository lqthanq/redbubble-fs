import { Button, Collapse, Form, Radio, Select } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import { forEach } from "lodash";
import { useRouter } from "next/router";
import { PRODUCT_BASE_CATEGORIES } from "graphql/queries/productBase/category";
import { useQuery } from "@apollo/client";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";

const Container = styled.div`
  .ant-radio-group {
    display: grid;
  }
  .ant-select {
    width: 200px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const { Option } = Select;

const ProductBaseCategoryFilter = forwardRef(({ filter }, ref) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data } = useQuery(FULFILLMENTS);
  const listFulfillment = data?.fulfillments;
  useImperativeHandle(ref, () => ({
    handleFinishForm() {
      form.submit();
    },
    handleResetForm() {
      form.resetFields();
    },
  }));

  const hanleSubmit = (values) => {
    forEach(values, (value, key) => {
      if (value && value.length !== 1) {
        router.query[key] = value;
      } else {
        delete router.query[key];
      }
    });
    router.push(router);
  };

  return (
    <Container>
      <Form
        form={form}
        onFinish={(values) => hanleSubmit(values)}
        className="p-collapse-filter"
      >
        <Collapse expandIconPosition="right" bordered={false}>
          <Collapse.Panel header="Fulfillment By">
            <Form.Item
              initialValue={filter?.fulfillmentId ?? "all"}
              name="fulfillmentId"
            >
              <Select placeholder="Filter by fulfillment...">
                <Option value="all">All</Option>
                {listFulfillment?.map((fulfill) => (
                  <Option value={fulfill.id} key={fulfill.id}>
                    {fulfill.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
        <Collapse expandIconPosition="right" bordered={false}>
          <Collapse.Panel header="Sort By">
            <Form.Item initialValue={filter?.sortBy} name="sortBy">
              <Radio.Group>
                <Radio style={radioStyle} value="title">
                  Alphabetical
                </Radio>
                <Radio style={radioStyle} value="created_at">
                  Date created
                </Radio>
                <Radio style={radioStyle} value="updated_at">
                  Last edited
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel header="Order">
            <Form.Item initialValue={filter?.order} name="order">
              <Radio.Group>
                <Radio style={radioStyle} value="ASC">
                  Ascending
                </Radio>
                <Radio style={radioStyle} value="DESC">
                  Descending
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </Container>
  );
});

export default ProductBaseCategoryFilter;
