import { Button, Collapse, Divider, Form, Radio, Tag } from "antd";
import FilterFulfillment from "components/Utilities/FilterFulfillment";
import { forEach } from "lodash";
import { useRouter } from "next/router";
import { forwardRef, useImperativeHandle, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  .clear-filter-item {
    margin-top: 10px;
    padding: 0;
  }
  .ant-radio-group {
    display: grid;
  }
`;
const CategoryFilter = ({ filter, setFilter }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [selected, setSelected] = useState();
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  const hanleChange = (valuesChange, values) => {
    // forEach(values, (value, key) => {
    //   if (value && value.length !== 1 && value !== "all") {
    //     router.query[key] = value;
    //   } else {
    //     delete router.query[key];
    //   }
    // });
    // if (router?.query?.page) {
    //   router.query.page = 1;
    // }
    // router.push(router);
    forEach(values, (value, key) => {
      if (value && value.length !== 0 && value !== null) {
        router.query[key] = value;
      } else {
        delete router.query[key];
      }
      router.push(router);
    });
  };
  return [
    <Container className="p-collapse-filter">
      <Form
        form={form}
        onValuesChange={hanleChange}
        className="p-collapse-filter"
      >
        {/* <FilterFulfillment form={form} filter={filter} setFilter={setFilter} /> */}
        <Collapse
          onChange={(e) => {
            setSelected(e);
          }}
          expandIconPosition="right"
          bordered={false}
        >
          <Collapse.Panel
            header={
              <div>
                <div>Sort By</div>
                {selected?.filter((el) => ["0"].includes(el)).length === 0 &&
                router?.query?.sortBy ? (
                  <Tag>{router?.query?.sortBy}</Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item
              name="sortBy"
              initialValue={filter.sortBy ?? router.query.sortBy}
            >
              <Radio.Group>
                <Radio style={radioStyle} value="created_at">
                  Date created
                </Radio>
                <Radio style={radioStyle} value="updated_at">
                  Last edited
                </Radio>
                <Radio style={radioStyle} value="title">
                  Alphabetical
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              disabled={router?.query?.sortBy ? false : true}
              type="link"
              onClick={() => {
                setFilter({
                  ...filter,
                  sortBy: "created_at",
                });
                delete router.query.sortBy;
                router.push(router);
                form.setFieldsValue({
                  sortBy: "created_at",
                });
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <div>
                <div>Order</div>
                {selected?.filter((el) => ["1"].includes(el)).length === 0 &&
                router?.query?.order ? (
                  <Tag>{router?.query?.order}</Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item
              initialValue={filter.order ?? router.query.order}
              name="order"
            >
              <Radio.Group>
                <Radio style={radioStyle} value="DESC">
                  Descending
                </Radio>
                <Radio style={radioStyle} value="ASC">
                  Ascending
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              disabled={router?.query?.order ? false : true}
              type="link"
              onClick={() => {
                setFilter({
                  ...filter,
                  order: "DESC",
                });
                delete router.query.order;
                router.push(router);
                form.setFieldsValue({
                  order: "DESC",
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

export default CategoryFilter;
