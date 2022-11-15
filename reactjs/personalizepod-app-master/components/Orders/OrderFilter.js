import { Collapse, DatePicker, Radio, Select, Form } from "antd";
import FilterByBase from "components/Campaigns/FilterByBase";
import FilterByStore from "components/Campaigns/FilterByStore";
import FilterFulfillment from "components/Utilities/FilterFulfillment";
import { forEach, isArray } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";

const Conatiner = styled.div`
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

const { RangePicker } = DatePicker;

const { Option } = Select;

const OrderFilter = ({
  setContentFilter,
  contentFilter,
  filter,
  setFilter,
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  // const [timeCustom, setTimeCustom] = useState(false);
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  }
  const setDateRange = async (value) => {
    setContentFilter({ ...contentFilter, time: value });
  };
  const hanleChange = (valueChange, values) => {
    forEach(values, (value, key) => {
      if (
        value &&
        value.length !== 0 &&
        value !== null &&
        !value?.productBaseIds?.length
      ) {
        setFilter({
          ...filter,
          ...values,
        });
        router.query[key] = isArray(value) ? value.join(",") : value;
      } else {
        setFilter({
          ...filter,
          ...values,
        });
        delete router.query[key];
      }
      router.push(router);
    });
  };
  return [
    <Conatiner>
      <Form form={form} id="formFilter" onValuesChange={hanleChange}>
        <FilterByBase filter={filter} setFilter={setFilter} />
        <FilterByStore form={form} filter={filter} setFilter={setFilter} />
        <FilterFulfillment form={form} filter={filter} setFilter={setFilter} />
        <Collapse
          className="p-collapse-filter"
          expandIconPosition="right"
          bordered={false}
        >
          {/* <Collapse.Panel header="Time">
            <Radio.Group
              name="Value"
              onChange={(e) => {
                if (e.target.value !== "custom") {
                  setTimeCustom(false);
                  setDateRange(e.target.value);
                } else {
                  setTimeCustom(true);
                }
              }}
              value={contentFilter?.time}
            >
              <Radio value={null}>All time</Radio>
              <Radio value="today">Today</Radio>
              <Radio value="yesterday">Yesterday</Radio>
              <Radio value="last7days">Last 7 days</Radio>
              <Radio value="last30days">This month</Radio>
              <Radio value="lastmonth">Last month</Radio>
              <Radio value="custom">Custom</Radio>
              {timeCustom ? <RangePicker disabledDate={disabledDate} /> : null}
            </Radio.Group>
          </Collapse.Panel> */}
        </Collapse>
      </Form>
    </Conatiner>,
    { form },
  ];
};

export default OrderFilter;
