import { Radio } from "antd";
import React from "react";
import moment from "moment";

const FilterCampaignDate = ({ setStartDate, setEndDate, select, filter }) => {
  const handleDateRange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "today":
        setStartDate(moment().startOf("day"));
        setEndDate(moment().endOf("day"));
        break;
      case "yesterday":
        setStartDate(moment().startOf("day").add(-1, "day"));
        setEndDate(moment().endOf("day").add(-1, "day"));
        break;
      case "last7days":
        setStartDate(moment().startOf("day").add(-6, "day"));
        setEndDate(moment().endOf("day"));
        break;
      case "thismonth":
        setStartDate(moment().startOf("month"));
        setEndDate(moment().endOf("day"));
        break;
      case "lastmonth":
        setStartDate(moment().startOf("month").add(-1, "day"));
        setEndDate(moment().endOf("month").add(-1, "day"));
        break;
      case "all":
        setStartDate(null);
        setEndDate(null);
        break;
      default:
        break;
    }
  };

  return select !== null || filter.timeBy !== null ? (
    <Radio.Group onChange={handleDateRange}>
      <Radio value="all">All time</Radio>
      <Radio value="today">Today</Radio>
      <Radio value="yesterday">Yesterday</Radio>
      <Radio value="last7days">Last 7 days</Radio>
      <Radio value="thismonth">This month</Radio>
      <Radio value="lastmonth">Last month</Radio>
      {/* <Radio value="custom">Custom</Radio> */}
    </Radio.Group>
  ) : null;
};

export default FilterCampaignDate;
