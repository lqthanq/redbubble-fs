import { Button, Dropdown, Menu, notification, Popconfirm, Tag } from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import useCategoryFilter from "components/ProductBase/CategoryFilter";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { BiEditAlt } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";
import { PRODUCT_BASE_CATEGORIES } from "graphql/queries/productBase/category";
import { DELETE_PRODUCT_BASE_CATEGORY } from "graphql/mutate/productBase/createProductBaseCategory";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import { messageDelete } from "components/Utilities/message";
import Link from "next/link";
// import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { useAppValue } from "context";
import { permissionCheck } from "components/Utilities/PermissionCheck";
import { permissions } from "components/Utilities/Permissions";
import AuthElement from "components/User/AuthElement";

const ListCategories = () => {
  const router = useRouter();
  const [{ sellerId }] = useAppValue();
  const [filter, setFilter] = useState({
    ...router.query,
    pageSize: 20,
    parentId: null,
    sortBy: get(router, "query.sortBy", "created_at"),
    order: get(router, "query.order", "DESC"),
    fulfillmentId: get(router, "query.fulfillmentId", null),
    sellerId,
  });
  const { data, loading, refetch } = useQuery(PRODUCT_BASE_CATEGORIES, {
    fetchPolicy: "no-cache",
    variables: {
      filter: {
        ...filter,
        sellerId,
        sortBy: get(router, "query.sortBy", "created_at"),
        order: get(router, "query.order", "DESC"),
        fulfillmentId: get(router, "query.fulfillmentId", null),
      },
    },
  });
  // const { data: dataFulfillments } = useQuery(FULFILLMENTS, {
  //   variables: { sellerId },
  // });
  // const fulfillments = dataFulfillments?.fulfillments;

  const [deleteProductBaseCategory] = useMutation(DELETE_PRODUCT_BASE_CATEGORY);
  const menu = (category) => (
    <Menu>
      <Menu.Item
        onClick={() =>
          router.push(
            "/product-bases/categories/[id]",
            `/product-bases/categories/${category.id}`
          )
        }
      >
        <BiEditAlt className="custom-icon anticon" />
        &nbsp; Edit
      </Menu.Item>
      {permissionCheck(permissions.ProductBaseCategoryDelete) ? (
        <>
          <Menu.Divider />
          <Menu.Item style={{ color: "var(--error-color)" }}>
            <Popconfirm
              placement="top"
              okButtonProps={{
                danger: true,
              }}
              title="Are you sure to delete this category?"
              onConfirm={() => {
                deleteProductBaseCategory({ variables: { id: category.id } })
                  .then(() => {
                    messageDelete("Category");
                    refetch();
                  })
                  .catch((err) => notification.error({ message: err.message }));
              }}
              okText="Yes"
              cancelText="No"
            >
              <AiTwotoneDelete
                style={{ color: "var(--error-color)" }}
                className="custom-icon anticon"
              />
              &nbsp; Delete
            </Popconfirm>
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );

  const columns = [
    {
      title: "Title",
      key: "title",
      width: 400,
      render(record) {
        return (
          <b>
            <Link
              href={"/product-bases/categories/[id]"}
              as={`/product-bases/categories/${record.id}`}
            >
              {record.title}
            </Link>
          </b>
        );
      },
    },
    // {
    //   title: "Fulfillment",
    //   dataIndex: "fulfillment",
    //   key: "fulfillment",
    //   width: 200,
    //   render: (fulfillment) => <Tag color="default">{fulfillment?.title}</Tag>,
    // },
    {
      title: "Actions",
      width: 150,
      align: "right",
      render: (record) => (
        <div>
          <Dropdown placement="bottomRight" overlay={menu(record)}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];
  const [formFilter, { form }] = useCategoryFilter({
    filter,
    setFilter,
  });
  const resetFilter = () => {
    setFilter({
      ...filter,
      parentId: null,
      fulfillmentId: null,
      order: "DESC",
      sortBy: "created_at",
      search: null,
    });
    router.query = {};
    router.push(router);
  };

  const pagination = {
    total: data?.productBaseCategories?.count,
    pageSize: +filter.pageSize,
    current: get(router, "query.page", 1),
    onChange: (page, pageSize) => {
      router.query.page = page;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };
  const onCloseTagFulfill = () => {
    setFilter({
      ...filter,
      fulfillmentId: null,
    });
    delete router.query?.fulfillmentId;
    router.push(router);
  };
  const onCloseTagSortBy = () => {
    setFilter({
      ...filter,
      sortBy: "created_at",
    });
    delete router.query?.sortBy;
    delete router.query.order;
    router.push(router);
    form.setFieldsValue({
      sortBy: "created_at",
      order: "DESC",
    });
  };
  const tagFilter = () => (
    <div>
      {/* {router?.query?.fulfillmentId ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagFulfill}
        >
          Fulfillment:{" "}
          {fulfillments
            ?.filter((el) => el.id.includes(router?.query?.fulfillmentId))
            .map((col) => col.title)
            .join()}
        </Tag>
      ) : null} */}
      {router?.query?.sortBy ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagSortBy}
        >
          Sort by:{" "}
          {router?.query?.sortBy === "title"
            ? "Alphabetical"
            : router?.query?.sortBy === "updated_at"
            ? "Last edited"
            : "Date created"}{" "}
          ({router?.query?.order === "ASC" ? "ASC" : "DESC"})
        </Tag>
      ) : null}
    </div>
  );
  return (
    <div className="p-15-24">
      <CustomizeMainContent
        form={form}
        loading={loading}
        customLayout={false}
        columns={columns}
        dataSource={data?.productBaseCategories?.hits}
        pagination={pagination}
        headerTitle="Categories"
        setFilter={setFilter}
        resetFilter={resetFilter}
        filter={filter}
        tagFilter={tagFilter()}
        headerButton={
          <AuthElement name={permissions.ProductBaseCategoryCreate}>
            <Button
              type="primary"
              onClick={() =>
                router.push(
                  ("/product-bases/categories/new",
                  "/product-bases/categories/new")
                )
              }
            >
              Add New
            </Button>
          </AuthElement>
        }
        filterContainer={formFilter}
      />
    </div>
  );
};

export default ListCategories;
