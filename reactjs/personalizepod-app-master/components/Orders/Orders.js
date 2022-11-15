import { Avatar, Button, Dropdown, Image, Tag, Tooltip } from "antd";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import OrderAction from "./OrderAction";
import OrderBulkAction from "./OrderBulkAction";
import OrderExport from "./OrderExport";
import useOrderFilter from "./OrderFilter";
import { statusColor } from "./StatusOrder";
import moment from "moment";
import { useQuery } from "@apollo/client";
import OrderFilterTag from "./OrderFilterTag";
import ScreenOptions from "./ScreenOptions";
import { AiFillCaretDown } from "react-icons/ai";
import ViewTracking from "./ViewTracking";
import Link from "next/link";
import {
  ORDERS,
  ORDERS_STATUS_SUBSCRIPTION,
} from "graphql/queries/order/orders";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { isAdmin } from "components/Utilities/isAdmin";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";

const Container = styled.div`
  .ant-table {
    border-radius: 0px;
  }
  .ant-table-pagination-right {
    justify-content: flex-start;
    padding: 0 16px;
  }
`;

const Orders = () => {
  const router = useRouter();
  const [checkOption, setCheckOption] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visibleScreenOptions, setVisibleScreenOptions] = useState(false);
  const [filter, setFilter] = useState({
    page: get(router, "query.page", 1),
    pageSize: get(router, "query.pageSize", 20),
    search: get(router, "query.search", ""),
    status: get(router, "query.status", null),
    productBaseIds: router?.query?.productBaseIds
      ? router?.query?.productBaseIds.split(",")
      : [],
    storeIds: router?.query?.storeIds ? router?.query?.storeIds.split(",") : [],
    fulfillmentId: get(router, "query.fulfillmentId", null),
  });
  const { data, loading, refetch, subscribeToMore } = useQuery(ORDERS, {
    variables: {
      filter,
    },
  });
  const {
    data: orderAggs,
    loading: aggsLoading,
    refetch: refetchAggs,
  } = useQuery(ORDERS, {
    variables: {
      filter: {
        ...filter,
        status: null,
        aggs: {
          status: {
            terms: {
              field: "status",
            },
          },
        },
      },
    },
  });
  const { data: fulfillmentData } = useQuery(FULFILLMENTS);

  const fulfillments = fulfillmentData?.fulfillments;

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToMore({
        document: ORDERS_STATUS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData?.data?.orderStatus) return prev;
          let newOrders = cloneDeep(prev.orders.hits);
          newOrders = newOrders?.map((order) => {
            const matchOrder = subscriptionData?.data?.orderStatus.find(
              (orderItem) => orderItem.id === order.id
            );
            if (matchOrder) {
              return { ...order, ...matchOrder };
            }
            return { ...order };
          });
          refetchAggs();
          return {
            orders: {
              ...prev.orders,
              hits: newOrders,
            },
          };
        },
      });
    }
  }, []);

  const refetchList = () => {
    refetch();
    refetchAggs();
  };

  const resetFilter = () => {
    setFilter({
      ...filter,
      page: 1,
      search: null,
      status: null,
      productBaseIds: null,
      storeIds: null,
      fulfillmentId: null,
    });
    router.query = {};
    router.push(router);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => (
        <b>
          <Link href={"/orders/[id]"} as={`/orders/${id}`}>
            {id}
          </Link>
        </b>
      ),
    },
    {
      title: "Origin ID",
      dataIndex: "originId",
      key: "originId",
      width: 150,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "auto",
      width: 250,
      render: (product, record) => {
        const availableMockup = product?.mockups?.find(
          (el) => el.variantId === record?.productVariant?.id
        );
        const mockupLink = availableMockup
          ? availableMockup.image
          : product?.mockups && product?.mockups[0]?.image;
        return (
          <div className="view-table-image">
            <Image
              style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
              width="90px"
              height="90px"
              preview={{
                src: `${process.env.CDN_URL}/autoxauto/${mockupLink}`,
              }}
              src={`${process.env.CDN_URL}/300x300/${mockupLink}`}
              fallback={`/no-preview.jpg`}
            />
            <b className="ml-15">
              <Link
                as={`/campaigns/${product?.campaignId}`}
                href={"/campaigns/[id]"}
              >
                {product.title}
              </Link>
            </b>
          </div>
        );
      },
    },
    {
      title: "Product Base",
      dataIndex: "product",
      key: "productBases",
      width: 250,
      render: (product) =>
        product?.productBases?.map((el) => el?.title).join(", "),
    },
    {
      title: "Attributes",
      dataIndex: "productVariant",
      key: "attributes",
      width: 180,
      render: (productVariant) => (
        <div>
          {productVariant?.productBaseVariant?.attributes?.map((el, index) => (
            <div key={index} className="flex">
              <strong>{el.name}</strong>:
              <span style={{ paddingLeft: 10 }}>{el.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "qty",
      width: 60,
      align: "right",
    },
    {
      title: "Cost",
      dataIndex: "baseCost",
      key: "cost",
      width: 80,
      render: (cost) => `$${cost}`,
      align: "right",
    },
    {
      title: "Shipping Cost",
      dataIndex: "shippingCost",
      key: "shippingCost",
      width: 140,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      width: 100,
      align: "right",
      render: (revenue, record) => `$${record.quantity * record.price}`,
    },
    {
      title: "Store",
      dataIndex: "store",
      key: "store",
      width: 170,
      render: (store) => (
        <div hidden={!store} className="flex item-center">
          <Avatar
            src={
              store?.platform === "shopify"
                ? `/shopify.png`
                : store?.platform === "woocommerce"
                ? "/woocommerce.jpg"
                : ""
            }
          />
          <div style={{ textTransform: "capitalize", marginLeft: 5 }}>
            {store?.title}
          </div>
        </div>
      ),
    },
    {
      title: "Seller",
      dataIndex: "author",
      key: "seller",
      width: 170,
      render: (author) => (
        <CustomizeAvatarOwner
          size={32}
          src={`${process.env.CDN_URL}/300x300/${author?.avatar?.key}`}
          author={author}
        />
      ),
    },
    {
      title: "Fulfillment",
      dataIndex: "productVariant",
      key: "fulfillment",
      width: 150,
      render: (productVariant) =>
        productVariant.productBase?.fulfillment?.title,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt) => moment(createdAt).format("DD MMM YYYY"),
    },
    {
      title: "Tracking code",
      dataIndex: "tracking",
      key: "tracking",
      width: 280,
      render: (tracking) => (
        <ViewTracking refetch={() => refetchList()} tracking={tracking} />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        const item = statusColor.find((el) => el.value === status);
        if (item) {
          return (
            <Tag
              style={{ minWidth: 100, textAlign: "center" }}
              className={item.color}
            >
              {item.name}
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      align: "right",
      className: "action",
      render: (order) => (
        <OrderAction
          key={order.id}
          refetch={() => refetchList()}
          order={order}
        />
      ),
    },
  ];

  const pagination = {
    current: +filter.page,
    total: data ? data.orders.count : 0,
    pageSize: +filter.pageSize,
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
      router.query.page = page;
      router.query.pageSize = pageSize;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const [formFilter, { form }] = useOrderFilter({
    filter,
    setFilter,
  });

  const tagFilter = () => (
    <OrderFilterTag filter={filter} setFilter={setFilter} form={form} />
  );

  const handleChangeOption = () => {
    setVisibleScreenOptions(!visibleScreenOptions);
  };

  const columnsChecked = [columns[0]];

  checkOption?.forEach((i) => {
    columns.forEach((ii) => {
      if (ii.key === i) {
        columnsChecked.push(ii);
      }
    });
  });

  if (filter.status === "Error") {
    columnsChecked.splice(columnsChecked.length, 0, {
      title: "Reason",
      key: "reason",
      width: 200,
      dataIndex: "reason",
      render: (reason) => <span>{reason}</span>,
    });
  }

  const enableExportButton =
    fulfillments?.find((fulfill) => fulfill.id === filter.fulfillmentId)
      ?.type === "Custom";

  columnsChecked.push(columns[columns.length - 1]);

  return (
    <div className="order-component">
      <div style={{ margin: "0 24px" }}>
        <ScreenOptions
          className={`screen-options ${visibleScreenOptions ? "show" : ""}`}
          checkOption={checkOption}
          setCheckOption={setCheckOption}
        />
        <Button
          onClick={handleChangeOption}
          className={`block btn-screen-options ${
            visibleScreenOptions ? "btn-active" : ""
          }`}
          icon={<AiFillCaretDown className="anticon icon-visible" />}
        >
          Screen Options
        </Button>
      </div>
      <Container className="p-15-24 p-order-list">
        <CustomizeMainContent
          customLayout={false}
          columns={columnsChecked}
          dataSource={data?.orders?.hits}
          aggs={orderAggs?.orders.aggs}
          pagination={pagination}
          headerButton={
            <Button
              hidden={isAdmin()}
              onClick={() => router.push("place-new-order", `place-new-order`)}
              type="primary"
            >
              Place New Order
            </Button>
          }
          headerTitle="Orders"
          setFilter={setFilter}
          loading={loading}
          filter={filter}
          rowSelection={rowSelection}
          resetFilter={resetFilter}
          tagFilter={tagFilter()}
          exportFilter={
            <Dropdown
              overlay={
                <OrderExport
                  filter={filter}
                  exportAny={true}
                  refetch={refetchAggs}
                  selectedRowKeys={data?.orders?.hits?.map((el) => el.id)}
                  setSelectedRowKeys={setSelectedRowKeys}
                />
              }
              disabled={!(enableExportButton || filter.status === "Error")}
            >
              <Button hidden={isAdmin()} className="ml-15" type="primary">
                Export all filtered orders
              </Button>
            </Dropdown>
          }
          tabs={true}
          paginationTop={true}
          bulkAction={
            <OrderBulkAction
              orders={data?.orders?.hits}
              refetch={() => refetchList()}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            />
          }
          form={form}
          filterContainer={formFilter}
        />
      </Container>
    </div>
  );
};

export default Orders;
