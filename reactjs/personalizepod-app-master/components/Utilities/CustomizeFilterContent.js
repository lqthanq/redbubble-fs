import React from "react";
import { Collapse, Radio } from "antd";

const CustomizeFilterContent = (props) => {
  const { contentFilter, setContentFilter, filterContainer } = props;
  const handleChange = (e) => {
    if (e.target.value) {
      e.preventDefault();
      setContentFilter({
        ...contentFilter,
        order: e.target.value,
      });
    }
  };

  const handleChangeSort = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setContentFilter({ ...contentFilter, sortBy: e.target.value });
  };

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  return (
    <div className="p-collapse-filter">
      <Collapse expandIconPosition="right" bordered={false}>
        <Collapse.Panel header="Sort By">
          <Radio.Group
            onChange={(e) => handleChangeSort(e)}
            value={contentFilter.sortBy}
          >
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
        </Collapse.Panel>
        <Collapse.Panel header="Order">
          <Radio.Group onChange={handleChange} value={contentFilter.order}>
            <Radio style={radioStyle} value="ASC">
              Ascending
            </Radio>
            <Radio style={radioStyle} value="DESC">
              Descending
            </Radio>
          </Radio.Group>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default CustomizeFilterContent;
