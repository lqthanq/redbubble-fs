import styled from "styled-components";
import { Button, Card, Tag, Modal, Pagination, Image } from "antd";
import { useQuery } from "@apollo/client";
import productBase from "../../graphql/queries/productBase/productBase";
import { useState } from "react";
import { useRouter } from "next/router";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import Grid from "components/Utilities/Grid";
import moment from "moment";
import ProductBaseAction from "./ProductBaseAction";
import { get, omit } from "lodash";
import ProductBaseImport from "./ProductBaseImport";
import ProductBaseGrid from "./ProductBaseGrid";
import useProductBaseFilter from "./ProductBaseFilter";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import { useAppValue } from "context";
import ProductBaseFilterTag from "./ProductBaseFilterTag";
import Link from "next/link";
import { FaUserEdit } from "react-icons/fa";
import AuthElement from "../User/AuthElement";
import { permissions } from "../Utilities/Permissions";

const Container = styled.div``;

const ProductBaseList = () => {
  const [{ currentUser, sellerId }, dispatch] = useAppValue();
  const router = useRouter();
  const [showImport, setShowImport] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 20,
    sellerId,
    ...omit(router.query, "layout"),
    page: get(router, "query.page", 1),
    search: get(router, "query.search", null),
    sortBy: get(router, "query.sortBy", "created_at"),
    order: get(router, "query.order", "DESC"),
    categoryId: get(router, "query.categoryId", ""),
    fulfillmentId: get(router, "query.fulfillmentId", null),
  });
  const { data, loading, refetch } = useQuery(productBase, {
    variables: {
      filter: {
        ...filter,
        sellerId,
        ...omit(router.query, "layout"),
        page: get(router, "query.page", 1),
        search: get(router, "query.search", null),
        sortBy: get(router, "query.sortBy", "created_at"),
        order: get(router, "query.order", "DESC"),
        categoryId: get(router, "query.categoryId", ""),
        fulfillmentId: get(router, "query.fulfillmentId", null),
        sellerId,
      },
    },
    fetchPolicy: "network-only",
  });
  const productBases = data?.productBases?.hits;
  const columns = [
    {
      title: "Title",
      key: "title",
      width: 400,
      render: (record) => (
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "90px auto",
            alignItems: "center",
          }}
        >
          <Image
            style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
            width="90px"
            height="90px"
            preview={{
              src: `${process.env.CDN_URL}/autoxauto/${record?.image?.key}`,
            }}
            src={`${process.env.CDN_URL}/300x300/${record?.image?.key}`}
            fallback={`/images/default-img.png`}
          />
          <div className="ml-15">
            <b>
              <Link
                as={`/product-bases/${record.id}`}
                href={`/product-bases/[id]`}
              >
                {record.title}
              </Link>
            </b>
            <br />
            <Tag>{record.fulfillment ? record.fulfillment.title : null}</Tag>
            <br />
            {record.author ? (
              <div
                style={{ fontSize: 12, display: "flex", alignItems: "center" }}
              >
                <FaUserEdit />
                {record.author.firstName + " " + record.author.lastName}
              </div>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 200,
      render: (category) => <span>{category?.title}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "sku",
      width: 150,
      render: (createdAt) => (
        <div>{moment(createdAt).format("DD MMM YYYY")}</div>
      ),
    },
    {
      title: "Action",
      width: 150,
      align: "right",
      className: "action",
      render: (record) => (
        <ProductBaseAction refetch={refetch} record={record} />
      ),
    },
  ];
  const [formFilter, { form }] = useProductBaseFilter({
    filter,
    setFilter,
  });
  const resetFilter = () => {
    setFilter({
      ...filter,
      fulfillmentId: null,
      order: "DESC",
      sortBy: "created_at",
      categoryId: "",
    });
    router.query = {};
    router.push(router);
  };
  const pagination = {
    // showSizeChanger: true,
    // pageSizeOptions: [10, 20, 30, 50, 100],
    current: +filter.page,
    total: data ? data.productBases.count : 0,
    pageSize: +filter.pageSize,
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
      router.query.page = page;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };
  const tagFilter = () => (
    <ProductBaseFilterTag filter={filter} setFilter={setFilter} />
  );

  return (
    <Container className="p-15-24">
      <CustomizeMainContent
        customLayout={true}
        columns={columns}
        dataSource={productBases}
        pagination={pagination}
        headerTitle="Product bases"
        setFilter={setFilter}
        tagFilter={tagFilter()}
        loading={loading}
        resetFilter={resetFilter}
        form={form}
        headerButton={
          <AuthElement name={permissions.CreateProductBase}>
            {!currentUser?.roles
              ?.filter((el) => el.includes("Administrator"))
              .join() && (
              <Button className="mr-15" onClick={() => setShowImport(true)}>
                Import Base
              </Button>
            )}
            <Button
              type="primary"
              onClick={() => {
                dispatch({
                  type: "setProductBaseImport",
                  payload: {
                    productBaseImport: null,
                  },
                });
                router.push(
                  "/product-bases/add-product-base",
                  "/product-bases/add-product-base"
                );
              }}
            >
              Add New
            </Button>
          </AuthElement>
        }
        filter={filter}
        filterContainer={formFilter}
      >
        {/* <Scrollbars autoHeight autoHeightMax={"calc(100vh - 280px)"}> */}
        <Card bordered={false} className="card-main-content">
          <Grid gap={20} width={300}>
            {loading ? (
              <CustomizeLoadingCard times={4} height={300} />
            ) : (
              productBases?.map((el) => (
                <ProductBaseGrid
                  setShowImport={setShowImport}
                  el={el}
                  key={el.id}
                  refetch={refetch}
                />
              ))
            )}
          </Grid>
        </Card>
        {/* </Scrollbars> */}
        <Pagination style={{ padding: "20px 16px" }} {...pagination} />
      </CustomizeMainContent>
      <Modal
        className="modal-import-base no-padding-modal"
        width={1200}
        visible={showImport}
        onCancel={() => setShowImport(false)}
        title="Import Product Bases"
        footer={null}
      >
        <ProductBaseImport
          refetch={refetch}
          setFilter={setFilter}
          productBases={productBases}
        />
      </Modal>
    </Container>
  );
};

export default ProductBaseList;
