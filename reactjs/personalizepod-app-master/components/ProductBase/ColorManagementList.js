import { Button, Tag } from "antd";
import Modal from "antd/lib/modal/Modal";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import React, { useState } from "react";
import styled from "styled-components";
import useColorManagementForm from "./ColorManagementForm";
import { COLOR_MANAGEMENT } from "graphql/queries/productBase/colorManagementQuery";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useColorManagementFilter from "./ColorManagementFilter";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { get } from "lodash";
import ColorFetch from "./ColorFetch";
import ColorSetting from "./ColorSetting";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div``;

const ColorManagementList = () => {
  const router = useRouter();
  const [{ currentUser }] = useAppValue();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { data: dataFulfill } = useQuery(FULFILLMENTS);
  const [viewForm, setViewForm] = useState(false);
  const [filter, setFilter] = useState({
    page: get(router, "query.page", 1),
    pageSize: 20,
    search: get(router, "query.search", null),
    fulfillmentId: get(router, "query.fulfillmentId", []),
  });
  const { data, refetch, loading } = useQuery(COLOR_MANAGEMENT, {
    variables: {
      filter: {
        ...filter,
        fulfillmentId:
          _.isArray(router?.query?.fulfillmentId) === true
            ? router?.query?.fulfillmentId
            : _.isString(router?.query?.fulfillmentId) === true
            ? [router?.query?.fulfillmentId]
            : [],
      },
    },
    fetchPolicy: "network-only",
  });

  const [
    formAddColor,
    { form: colorForm, loading: loadingCreate },
  ] = useColorManagementForm({
    refetch,
    setViewForm,
  });

  const [formFilter, { form }] = useColorManagementFilter({
    filter,
    setFilter,
  });

  const resetFilter = () => {
    setFilter({
      ...filter,
      search: null,
      fulfillmentId: [],
    });
    router.query = {};
    router.push(router);
  };

  const pagination = {
    current: +filter.page,
    pageSize: +filter.pageSize,
    total: data?.colors?.count,
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
      router.query.page = page;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 350,
      render: (record) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px auto",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: record.code.includes("#")
                ? `${record.code}`
                : `#${record.code}`,
            }}
          >
            {record?.pattern && (
              <img
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                }}
                src={`${process.env.CDN_URL}/500x500/${record?.pattern?.key}`}
              />
            )}
          </div>
          <div>{record.name}</div>
        </div>
      ),
    },
    {
      title: "Fulfillment service",
      key: "fulfillment",
      width: 300,
      dataIndex: "fulfillment",
      render: (fulfillment) =>
        fulfillment ? <Tag>{fulfillment?.title}</Tag> : null,
    },
    {
      title: "Action",
      key: "Action",
      align: "right",
      width: 100,
      render: (record) =>
        record?.fulfillment?.type === "BuiltIn" ? null : (
          <ColorSetting
            pagination={pagination}
            settingOnlyColor={true}
            selectedRows={[record]}
            refetch={refetch}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        ),
    },
  ];

  const onCloseTagFulfill = () => {
    setFilter({
      ...filter,
      fulfillmentId: [],
    });
    delete router.query?.fulfillmentId;
    router.push(router);
    form.setFieldsValue({
      fulfillmentId: [],
    });
  };

  const tagFilter = () => (
    <div>
      {router?.query?.fulfillmentId ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagFulfill}
        >
          Fulfillments:{" "}
          {dataFulfill?.fulfillments
            ?.filter((el) => router?.query?.fulfillmentId.includes(el.id))
            .map((base) => base.title)
            .join(", ")}
        </Tag>
      ) : null}
    </div>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record?.fulfillment?.type === "BuiltIn", // Column configuration not to be checked
      // type: record.fulfillment.type,
    }),
  };

  const handleCloseForm = () => {
    setViewForm(false);
    colorForm.resetFields();
  };

  return (
    <Container className="p-15-24">
      <CustomizeMainContent
        loading={loading}
        resetFilter={resetFilter}
        setFilter={setFilter}
        tagFilter={tagFilter()}
        filter={filter}
        filter={filter}
        rowSelection={rowSelection}
        headerTitle="Color Managements"
        dataSource={data?.colors?.hits}
        pagination={pagination}
        filterContainer={formFilter}
        form={form}
        actionSelect={
          <ColorSetting
            pagination={pagination}
            selectedRows={selectedRows}
            selectedRowKeys={selectedRowKeys}
            refetch={refetch}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        }
        headerButton={
          <div>
            <AuthElement name={permissions.ColorAdd}>
              <Button onClick={() => setViewForm(true)} type="primary">
                Add new
              </Button>
            </AuthElement>
            <AuthElement name={permissions.ColorsFetch}>
              {currentUser?.roles
                ?.filter((el) => el.includes("Administrator"))
                .join() && <ColorFetch />}
            </AuthElement>
          </div>
        }
        columns={columns}
      />
      <Modal
        title="Add New Color"
        visible={viewForm}
        onCancel={handleCloseForm}
        okButtonProps={{
          loading: loadingCreate,
          form: "formColor",
          htmlType: "submit",
        }}
      >
        {formAddColor}
      </Modal>
    </Container>
  );
};

export default ColorManagementList;
