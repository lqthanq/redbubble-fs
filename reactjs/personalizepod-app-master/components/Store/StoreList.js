import { useState } from "react";
import { Button, Tag, Avatar, Modal } from "antd";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import stores from "graphql/queries/stores";
import StoreAction from "./Actions";
import StoreFilter from "./StoreFilter";
import { useRouter } from "next/router";
import { get } from "lodash";
import useAddSite from "./AddSite";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";
import { isAdmin } from "components/Utilities/isAdmin";
import { useAppValue } from "context";
import AuthElement from "../User/AuthElement"
import {permissions} from "../Utilities/Permissions"

const Container = styled.div``;
const StoreList = () => {
  const router = useRouter();
  const [{ sellerId }] = useAppValue();
  const [showAdd, setShowAdd] = useState(false);
  const [autoFocus, setAutoFocus] = useState();
  const [formSite, { loading: createLoading, form }] = useAddSite({
    setAutoFocus,
  });
  const [filter, setFilter] = useState({
    search: get(router, "query.search", null),
    pageSize: 20,
    page: 1,
    platform: get(router, "query.platform", null),
    status: get(router, "query.status", null),
  });
  const { data, refetch, loading } = useQuery(stores, {
    variables: {
      filter: { ...filter, sellerId },
    },
  });

  const resetFilter = () => {
    setFilter({
      ...filter,
      platform: null,
      status: null,
    });
    router.query = {};
    router.push(router);
  };

  const columns = [
    {
      title: "Store",
      dataIndex: "title",
      key: "title",
      width: "auto",
      render: (title, record) => (
        <div className="flex item-center">
          <Avatar
            src={
              record.platform === "shopify"
                ? "/shopify.png"
                : "/woocommerce.jpg"
            }
          />
          <a className="ml-15" target="_blank" href={record.domain}>
            {title}
          </a>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status, _) =>
        status ? (
          <Tag color="green">Connected</Tag>
        ) : (
          <Tag color="orange">Disconnected</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      align: "right",
      render: (record) => (
        <AuthElement name={permissions.StoreUpdate}>
        <StoreAction key={record.key} refetch={refetch} store={record} />
        </AuthElement>
      ),
    },
  ];
  if (isAdmin()) {
    columns.splice(
      1,
      0,
      {
        title: "Seller",
        dataIndex: "author",
        key: "author",
        width: 200,
        render: (author) => (
          <CustomizeAvatarOwner
            size={32}
            src={`${process.env.CDN_URL}/300x300/${author?.avatar?.key}`}
            author={author}
          />
        ),
      },
      {
        title: "Campaigns",
        dataIndex: "numberOfOrders",
        key: "numberOfOrders",
        width: 120,
      },
      {
        title: "Sale",
        dataIndex: "numberOfCampaigns",
        key: "numberOfCampaigns",
        width: 120,
      }
    );
  }

  const pagination = {
    current: get(router, "query.page", 1),
    total: data ? data.stores.count : 0,
    pageSize: filter.pageSize,
    // showTotal: (total, range) => `${range}of ${total}`,
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
      router.query.page = page;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };

  const onClosePlatform = () => {
    setFilter({
      ...filter,
      platform: null,
    });
    delete router.query.platform;
    router.push(router);
  };

  const onCloseStatus = () => {
    setFilter({
      ...filter,
      status: null,
    });
    delete router.query.status;
    router.push(router);
  };

  const tagFilter = () => (
    <div>
      {filter.platform ? (
        <Tag className="tag-filter-campaign" closable onClose={onClosePlatform}>
          Platform:
          {filter.platform === "woocommerce" ? "Woocommerce" : "Shopify"}
        </Tag>
      ) : null}
      {filter.status !== null ? (
        <Tag className="tag-filter-campaign" closable onClose={onCloseStatus}>
          Status: {filter.status ? "Connected" : "Disconnected"}
        </Tag>
      ) : null}
    </div>
  );

  const handleClose = () => {
    setShowAdd(false);
    form.resetFields();
  };

  return (
    <Container className="p-15-24">
      <CustomizeMainContent
        form={form}
        setFilter={setFilter}
        dataSource={data ? data.stores.hits : []}
        headerTitle="Stores"
        columns={columns}
        pagination={pagination}
        filter={filter}
        customLayout={false}
        loading={loading}
        resetFilter={resetFilter}
        filterContainer={<StoreFilter setFilter={setFilter} filter={filter} />}
        tagFilter={tagFilter()}
        headerButton={
          <>
            <AuthElement name={permissions.StoreCreate}>
            <Button
              type="primary"
              onClick={() => {
                setShowAdd(true);
                setTimeout(() => autoFocus?.focus());
              }}
            >
              Add New
            </Button>
            </AuthElement>
          </>
        }
      />
      {showAdd && (
        <Modal
          title="Add New store"
          visible={showAdd}
          onClose={handleClose}
          onCancel={handleClose}
          okButtonProps={{
            form: "site",
            loading: createLoading,
            htmlType: "submit",
          }}
        >
          {formSite}
        </Modal>
      )}
    </Container>
  );
};

export default StoreList;
