import React, { useEffect, useState } from "react";
import { CAMPAIGNS } from "graphql/queries/campaign/campaignQuery";
import { useRouter } from "next/router";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import { Button, Card, Pagination, Image } from "antd";
import moment from "moment";
import Grid from "components/Utilities/Grid";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import EmptyData from "components/Utilities/EmptyData";
import useCampaignFilter from "components/Campaigns/CampaignFilter";
import styled from "styled-components";
import { get, omit } from "lodash";
import CampaignAction from "./CampaignAction";
import CampaignGrid from "components/Campaigns/CampaignGrid";
import CampaignFilterTag from "./CampaignFilterTag";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";
import PublishedInStoreView from "./PublishedInStoreView";
import StatusInStoreView from "./StatusInStoreView";
import { useQuery } from "@apollo/client";
import { isAdmin } from "components/Utilities/isAdmin";
import Link from "next/link";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div``;

const CampaignList = () => {
  const [{ sellerId }] = useAppValue();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState({
    ...omit(router.query, "layout"),
    page: get(router, "query.page", 1),
    pageSize: get(router, "query.pageSize", 20),
    search: get(router, "query.search", null),
    timeBy: get(router, "query.timeBy", null),
    from: get(router, "query.from", null),
    to: get(router, "query.to", null),
    status: get(router, "query.status", null),
    userId: get(router, "query.userId", null),
    storeId: get(router, "query.storeId", ""),
    sortBy: get(router, "query.sortBy", "created_at"),
    order: get(router, "query.order", "DESC"),
    productBaseIds: router?.query?.productBaseIds
      ? router?.query?.productBaseIds.split(",")
      : [],
    collectionIds: router?.query?.collectionIds
      ? [router.query.collectionIds]
      : [],
  });

  const { data, loading, refetch } = useQuery(CAMPAIGNS, {
    variables: {
      filter: { ...filter, userId: sellerId },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data) {
      setCampaigns(data?.campaigns?.hits);
    }
  }, [data]);

  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_, record, index) => (
        <div className="flex item-center">
          <Image.PreviewGroup>
            {record?.products[0].mockups ? (
              record?.products[0].mockups.map((mockup, index) => (
                <Image
                  hidden={index !== 0}
                  key={index}
                  style={{ backgroundColor: "#f5f5f5", objectFit: "cover" }}
                  width="90px"
                  height="90px"
                  preview={{
                    src: `${process.env.CDN_URL}/autoxauto/${mockup.image}`,
                  }}
                  src={`${process.env.CDN_URL}/200x200/${mockup.image}`}
                  fallback={`/no-preview.jpg`}
                />
              ))
            ) : (
              <Image
                style={{ backgroundColor: "#f5f5f5", objectFit: "cover" }}
                width="90px"
                height="90px"
                preview={{
                  src: `${process.env.CDN_URL}/autoxauto/`,
                }}
                src={`${process.env.CDN_URL}/200x200/`}
                fallback={`/no-preview.jpg`}
              />
            )}
          </Image.PreviewGroup>
          <b className="ml-15">
            <Link href="/campaigns/[id]" as={`/campaigns/${record.id}`}>
              {record?.products ? record?.products[0].title : ""}
            </Link>
          </b>
        </div>
      ),
      width: 300,
    },
    {
      title: isAdmin() ? "Seller" : "Author",
      key: "author",
      dataIndex: "author",
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
      title: "Date",
      key: "date",
      width: 150,
      render: (record) => (
        <div>{moment(record?.products[0].createdAt).fromNow()}</div>
      ),
    },
    {
      title: filter.storeId ? "Status in Stores" : "Published in Stores",
      key: "statusStore",
      width: 180,
      render: (record) =>
        filter.storeId ? (
          <StatusInStoreView storeId={filter.storeId} item={record} />
        ) : (
          <PublishedInStoreView item={record} />
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "right",
      render: (record) => (
        <CampaignAction layoutTable={true} refetch={refetch} record={record} />
      ),
    },
  ];

  const pagination = {
    // showSizeChanger: true,
    // pageSizeOptions: [10, 20, 30, 50, 100],
    total: data?.campaigns?.count,
    pageSize: filter.pageSize,
    current: +get(router, "query.page", filter.page),
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
      router.query.page = page;
      router.query.pageSize = pageSize;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };
  const [formFilter, { form }] = useCampaignFilter({
    filter,
    setFilter,
  });
  const resetFilter = () => {
    setFilter({
      ...filter,
      collectionIds: null,
      order: "DESC",
      productBaseIds: [],
      search: null,
      sortBy: "created_at",
      status: null,
      storeId: "",
    });
    router.query = {};
    router.push(router);
  };
  const tagFilter = () => (
    <CampaignFilterTag filter={filter} setFilter={setFilter} form={form} />
  );
  return (
    <Container className="p-15-24">
      <CustomizeMainContent
        filter={filter}
        setFilter={setFilter}
        headerTitle="Campaigns"
        headerButton={
          <AuthElement name={permissions.CampaignCreate}>
            <Button
              type="primary"
              onClick={() => router.push(("/campaigns/new", "/campaigns/new"))}
            >
              Add New
            </Button>
          </AuthElement>
        }
        loading={loading}
        dataSource={campaigns}
        columns={columns}
        tagFilter={tagFilter()}
        pagination={pagination}
        form={form}
        filterContainer={formFilter}
        resetFilter={resetFilter}
        customLayout={true}
      >
        <Card bordered={false} className="card-main-content">
          <Grid gap={20} width={300}>
            {loading ? (
              <CustomizeLoadingCard times={6} height={300} />
            ) : campaigns.length ? (
              campaigns.map((product, index) => (
                <CampaignGrid
                  filter={filter}
                  refetch={refetch}
                  campaign={product}
                  product={product?.products && product.products[0]}
                  key={product.id}
                  pagination={pagination}
                />
              ))
            ) : (
              <EmptyData />
            )}
          </Grid>
        </Card>
        <Pagination style={{ padding: "20px 16px" }} {...pagination} />
      </CustomizeMainContent>
    </Container>
  );
};

export default CampaignList;
