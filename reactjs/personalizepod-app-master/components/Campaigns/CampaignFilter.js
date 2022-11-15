import { Button, Collapse, Divider, Form, Radio, Select, Tag } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import FilterByBase from "./FilterByBase";
import FilterByCollection from "./FilterByCollection";
import FilterByStore from "./FilterByStore";
import { forEach } from "lodash";
import FilterCampaignDate from "./FilterCampaignDate";

const Conatiner = styled.div`
  .ant-radio-group {
    display: grid;
  }
  .ant-select {
    width: 200px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .clear-filter-item {
    margin-top: 10px;
    padding: 0;
  }
  .p-radio-filter {
    max-height: 250px;
    overflow-y: auto;
  }
  .scroll-filter {
    max-height: 250px;
    overflow-y: auto;
  }
`;

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const CampaignFilter = ({ filter, setFilter }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [startDate, setStartDate] = useState(filter.from);
  const [endDate, setEndDate] = useState(filter.to);
  const [selected, setSelected] = useState();

  const hanleChange = (valueChange, values) => {
    // forEach(values, (value, key) => {
    //   setFilter({
    //     ...filter,
    //     from: startDate,
    //     to: endDate,
    //   });
    //   if (filter.timeBy === null) {
    //     setFilter({
    //       ...filter,
    //       from: null,
    //       to: null,
    //     });
    //   }
    //   if (value && value.length !== 1 && value !== "") {
    //     router.query[key] = value;
    //     if (router.query[key] === "date") {
    //       router.query[key] = select;
    //     }
    //   } else {
    //     delete router.query[key];
    //   }
    // });
    forEach(values, (value, key) => {
      if (value && value.length !== 0 && value !== null) {
        router.query[key] = value;
        setFilter({
          ...filter,
          ...values,
        });
      } else {
        delete router.query[key];
      }
      router.push(router);
    });
  };

  return [
    <Conatiner>
      <Form
        id="formFilter"
        form={form}
        onValuesChange={hanleChange}
        className="p-collapse-filter"
      >
        <FilterByBase filter={filter} setFilter={setFilter} />
        <FilterByCollection filter={filter} setFilter={setFilter} form={form} />
        <FilterByStore
          multiple={false}
          filter={filter}
          setFilter={setFilter}
          form={form}
        />
        <Collapse
          className="p-collapse-filter"
          expandIconPosition="right"
          bordered={false}
          onChange={(e) => {
            setSelected(e);
          }}
        >
          {/* <Collapse.Panel header="Time by">
            <Form.Item initialValue={filter.timeBy} name="timeBy">
              <Select
                className="mb-15"
                onChange={(value) => {
                  console.log(value);
                  setSelect(value);
                }}
              >
                <Select.Option value={null}>All</Select.Option>
                <Select.Option value="created_at">Created time</Select.Option>
                <Select.Option value="updated_at">Updated time</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <FilterCampaignDate
                filter={filter}
                // select={select}
                // setEndDate={setEndDate}
                // setStartDate={setStartDate}
              />
            </Form.Item>
          </Collapse.Panel>

          <Button
            className="clear-filter-item"
            disabled={router?.query?.timeBy ? false : true}
            type="link"
            onClick={() => {
              setFilter({
                timeBy: null,
              });
              delete router.query.timeBy;
              router.push(router);
            }}
          >
            Clear
          </Button> */}
          <Collapse.Panel
            header={
              <div>
                <div>Status</div>
                {selected?.filter((el) => ["0"].includes(el)).length === 0 &&
                router?.query?.status ? (
                  <Tag>{router?.query?.status}</Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item name="status" initialValue={filter?.status}>
              <Radio.Group>
                <Radio value="all">All</Radio>
                <Radio value="New">New</Radio>
                <Radio value="Update">Update</Radio>
                <Radio value="Latest">Latest</Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              disabled={router?.query?.status ? false : true}
              type="link"
              onClick={() => {
                setFilter({
                  ...filter,
                  status: null,
                });
                delete router.query.status;
                router.push(router);
                form.setFieldsValue({
                  status: null,
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
                <div>Sort By</div>
                {selected?.filter((el) => ["1"].includes(el)).length === 0 &&
                router?.query?.sortBy ? (
                  <Tag>{router?.query?.sortBy}</Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item initialValue={filter?.sortBy} name="sortBy">
              <Radio.Group value={filter?.sortBy}>
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
                {selected?.filter((el) => ["2"].includes(el)).length === 0 &&
                router?.query?.order ? (
                  <Tag>{router?.query?.order}</Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item initialValue={filter.order} name="order">
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
    </Conatiner>,
    { form },
  ];
};

export default CampaignFilter;
