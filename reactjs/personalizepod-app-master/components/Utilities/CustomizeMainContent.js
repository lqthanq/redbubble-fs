import React, { useState } from "react";
import {
  Button,
  Drawer,
  Table,
  PageHeader,
  Tabs,
  Badge,
  Pagination,
} from "antd";
import styled from "styled-components";
import { get, sum } from "lodash";
import { useRouter } from "next/router";
import CustomizeFilter from "./CustomizeFilter";
import { statusColor } from "components/Orders/StatusOrder";
import EmptyData from "./EmptyData";

const Container = styled.div`
  .header-title {
    font-size: 20px;
  }
  .type-button {
    cursor: pointer;
    font-size: 25px;
  }
  .ant-tabs {
    padding: 0px 20px;
    background: #fff;
    .ant-tabs-nav {
      margin: 0;
    }
  }
  .main-content {
    box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
      0 1px 3px 0 rgba(63, 63, 68, 0.15);
    border-radius: 3px;
    outline: 0.1rem solid transparent;
  }
`;

const CustomizeMainContent = (props) => {
  const router = useRouter();
  const layout = get(router, "query.layout", "grid");
  const {
    filter,
    setFilter,
    children,
    loading,
    dataSource,
    columns,
    pagination,
    filterContainer,
    headerTitle,
    headerButton,
    cancelText = "Clear all",
    tabs = false,
    resetFilter,
    customLayout,
    headerExpand,
    rowSelection,
    bulkAction,
    tagFilter,
    multipleFilter = true,
    components = {},
    exportFilter,
    actionSelect,
    form,
    aggs,
    paginationTop,
  } = props;

  const [drawerFilter, showDrawerFilter] = useState(false);

  const tableWidth = sum(columns.map((c) => c.width));

  return (
    <Container>
      <div className="pb-15 item-center">
        <div className="flex item-center">
          <PageHeader
            style={{ padding: 0, maxWidth: 400 }}
            title={headerTitle}
            onBack={() => router.back()}
          />
          {headerButton}
        </div>
        {headerExpand}
      </div>
      {filter && (
        <CustomizeFilter
          exportFilter={exportFilter}
          multipleFilter={multipleFilter}
          customLayout={customLayout}
          filter={filter}
          showDrawerFilter={showDrawerFilter}
          setFilter={setFilter}
          tagFilter={tagFilter}
        />
      )}
      {
        <div className="main-content custom-content-layout">
          {layout === "grid" && customLayout ? (
            <div>
              {dataSource?.length || loading ? children : <EmptyData />}
            </div>
          ) : (
            <div>
              {tabs && (
                <Tabs
                  activeKey={router?.query?.status}
                  tabBarExtraContent={bulkAction}
                  style={{
                    padding: "0 16px",
                    background: "rgb(250, 250, 250)",
                    borderRadius: "3px 3px 0 0",
                    borderBottom: "1px solid #dfe3e8",
                  }}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      status: e.includes("null") ? JSON.parse(e) : e,
                      page: 1,
                    });
                    if (e !== "null") {
                      router.query.status = e;
                      router.query.page = 1;
                      delete router.query.pageSize;
                    } else {
                      delete router.query;
                    }
                    router.push(router);
                  }}
                >
                  {statusColor.map((tabs) => (
                    <Tabs.TabPane
                      defaultActiveKey={null}
                      activeKey={filter.status}
                      key={tabs.value}
                      tab={
                        <div>
                          <span
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            {tabs.name}
                            <Badge
                              count={
                                tabs.value === null
                                  ? sum(
                                      get(aggs, "status.buckets", []).map(
                                        (agg) => agg.doc_count
                                      )
                                    )
                                  : sum(
                                      get(aggs, "status.buckets", [])
                                        .filter((i) => i.key === tabs.value)
                                        .map((agg) => agg.doc_count)
                                    )
                              }
                              showZero
                            />
                          </span>
                        </div>
                      }
                    />
                  ))}
                </Tabs>
              )}
              {paginationTop ? (
                <div>
                  <Pagination
                    style={{
                      float: "left",
                      padding: "12px 16px 12px 16px",
                      borderBottom: "1px solid rgb(223, 227, 232)",
                      backgroundColor: "#FAFAFA",
                    }}
                    {...pagination}
                  />
                </div>
              ) : null}
              {actionSelect}
              <Table
                style={{ border: "none" }}
                loading={loading}
                rowKey="id"
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: tableWidth }}
                pagination={pagination}
                sticky={true}
                rowSelection={
                  rowSelection
                    ? {
                        ...rowSelection,
                      }
                    : false
                }
                components={components}
              />
            </div>
          )}
        </div>
      }
      <Drawer
        width={400}
        title="More filters"
        onClose={() => {
          showDrawerFilter(false);
        }}
        visible={drawerFilter}
        bodyStyle={{ paddingBottom: 80, padding: 6 }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              form="formFilter"
              onClick={() => {
                resetFilter();
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                showDrawerFilter(false);
              }}
            >
              Close
            </Button>
          </div>
        }
      >
        {filterContainer}
      </Drawer>
    </Container>
  );
};

export default CustomizeMainContent;
