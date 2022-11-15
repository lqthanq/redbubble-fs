import { Button, Form, Input } from "antd";
import { debounce, get } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(63,63,68,.05),0 1px 3px 0 rgba(63,63,68,.15);
  border-radius: 3px;
  outline: .1rem solid transparent;
  .content-button-view {
    display: flex;
    align-items: center;
    font-size: 24px;
  }
  .ant-form {
    width: -webkit-fill-available;
  }
  .right-content {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    .input-tag {
      width: -webkit-fill-available;
      margin-left: ${(props) => (props.customLayout ? "15px" : "")};
    }
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-form-item-control-input-content {
    text-align: right;
  }
`;

const CustomizeFilter = ({
  customLayout = false,
  filter,
  showDrawerFilter,
  setFilter,
  multipleFilter,
  tagFilter,
  exportFilter,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const layout = get(router, "query.layout", "grid");
  const handleChangeLayout = (layout) => (e) => {
    e.preventDefault();
    router.query.layout = layout;
    router.push(router);
  };

  const onSearchChange = (_, { search }) => {
    if (search) {
      setFilter({ ...filter, search, page: 1 });
      router.query.search = search;
      router.query.page = 1;
    } else {
      setFilter({ ...filter, search: null, page: 1 });
      router.query.page = 1;
      delete router.query.search;
      delete router.query.page;
    }
    router.push(router);
  };

  return (
    <Container customLayout={customLayout}>
      <div style={{ display: "flex" }}>
        {customLayout ? (
          <div className="content-button-view">
            <BsGrid3X3Gap
              onClick={handleChangeLayout("grid")}
              className="type-button"
              style={{
                color: layout === "grid" ? "var(--primary-color)" : "#0000009c",
                marginRight: 5,
              }}
            />
            <FaList
              className="type-button"
              style={{
                color:
                  layout === "table" ? "var(--primary-color)" : "#0000009c",
              }}
              onClick={handleChangeLayout("table")}
              type="button"
            />
          </div>
        ) : null}
        <div className="right-content">
          <Form
            style={{ width: "100%" }}
            form={form}
            layout="vertical"
            onValuesChange={debounce(onSearchChange, 300)}
          >
            <Form.Item name="search" initialValue={filter?.search}>
              <Input.Search className="input-tag" placeholder="Search..." />
            </Form.Item>
          </Form>
          {exportFilter}
          {multipleFilter && (
            <Button className="ml-15" onClick={() => showDrawerFilter(true)}>
              More filters
            </Button>
          )}
        </div>
      </div>
      {tagFilter}
    </Container>
  );
};

export default CustomizeFilter;
