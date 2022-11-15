import {
  Button,
  Dropdown,
  Menu,
  notification,
  Popconfirm,
  Tag,
  Modal,
  Image,
} from "antd";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DownOutlined } from "@ant-design/icons";
import { AiOutlineSetting, AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { DELETE_FULFILLMENT } from "graphql/mutate/productBase/fulfillmentMutations";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import { useRouter } from "next/router";
import { get } from "lodash";
import { messageDelete } from "components/Utilities/message";
import ModalShowFile from "components/Utilities/ModalShowFile";
import styled from "styled-components";
import useAPIConfigFulfillmentForm from "./APIConfigFulfillmentForm";
import Link from "next/link";
import { useAppValue } from "context";
import { permissionCheck } from "components/Utilities/PermissionCheck";
import { permissions } from "components/Utilities/Permissions";
import AuthElement from "components/User/AuthElement";
const Container = styled.div`
  .built-in {
    color: #2c404b;
    background: #89b9b1;
    border-color: #41877f;
    width: 75px;
    text-align: center;
  }
  .custom {
    color: #2c404b;
    background: #c1bab0;
    border-color: #8a8070;
    width: 75px;
    text-align: center;
  }
`;
const ListFulfillmentServices = () => {
  const router = useRouter();
  const [filter, setFilter] = useState({
    search: get(router, "query.search", null),
  });
  const [{ sellerId }] = useAppValue();
  const [deleteFulfillment] = useMutation(DELETE_FULFILLMENT);
  const { data, loading, error, refetch } = useQuery(FULFILLMENTS, {
    fetchPolicy: "network-only",
    variables: {
      search: filter.search,
      sellerId,
    },
  });
  const [config, setConfig] = useState(null);
  const [formConfig, { loadingApiConfig, form }] = useAPIConfigFulfillmentForm({
    config,
    setConfig,
    refetch,
  });
  if (error) return `${error.message}`;
  const menu = (fulfillment) => (
    <Menu>
      {fulfillment.type === "Custom" ? (
        <>
          <Menu.Item
            onClick={() =>
              router.push(
                "/product-bases/fulfillments/[id]",
                `/product-bases/fulfillments/${fulfillment.id}`
              )
            }
          >
            <BiEditAlt className="custom-icon anticon" />
            &nbsp; Edit
          </Menu.Item>
          {permissionCheck(permissions.FulfillmentServiceDelete) ? (
            <>
              <Menu.Divider />
              <Menu.Item
                className="delete-button-color"
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "var(--error-color)",
                }}
              >
                <>
                  <Popconfirm
                    overlayClassName="menu-action-base-popconfirm"
                    okButtonProps={{
                      danger: true,
                    }}
                    placement="left"
                    title="Are you sure to delete this fulfillment?"
                    onConfirm={() => {
                      deleteFulfillment({ variables: { id: fulfillment.id } })
                        .then(() => {
                          messageDelete("Fulfillment");
                          refetch();
                        })
                        .catch((err) =>
                          notification.error({ message: err.message })
                        );
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <AiTwotoneDelete className="custom-icon anticon delete-button-color" />
                    &nbsp; Delete
                  </Popconfirm>
                </>
              </Menu.Item>
            </>
          ) : null}
        </>
      ) : (
        <>
          <Menu.Item onClick={() => setConfig(fulfillment)}>
            <AiOutlineSetting className="custom-icon anticon" />
            &nbsp; API Configs
          </Menu.Item>
        </>
      )}
    </Menu>
  );
  const typeFulfill = [
    { key: "BuiltIn", name: "Built In" },
    { key: "Custom", name: "Custom" },
  ];
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
          {/* <ModalShowFile file={record?.image} /> */}
          <b className="ml-15">
            {record?.type === "Custom" ? (
              <Link
                href={`/product-bases/fulfillments/[id]`}
                as={`/product-bases/fulfillments/${record.id}`}
              >
                {record.title}
              </Link>
            ) : (
              <span
                style={{ color: "#006fbb", cursor: "pointer" }}
                onClick={() => setConfig(record)}
              >
                {record.title}
              </span>
            )}
          </b>
        </div>
      ),
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      width: 200,
      render: (type) => (
        <Tag className={type === "BuiltIn" ? "built-in" : "custom"}>
          {typeFulfill
            ?.filter((el) => el.key.includes(type))
            .map((e) => e.name)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      width: 150,
      align: "right",
      render: (record) => (
        <div
          hidden={
            !permissionCheck(permissions.FulfillmentServiceConfig) &&
            record.type === "BuiltIn"
          }
        >
          <Dropdown
            placement="bottomRight"
            trigger="click"
            overlay={menu(record)}
          >
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Container className="p-15-24">
      <CustomizeMainContent
        multipleFilter={false}
        loading={loading}
        customLayout={false}
        pagination={false}
        columns={columns}
        dataSource={data?.fulfillments}
        filter={filter}
        setFilter={setFilter}
        headerTitle="Fulfillments"
        headerButton={
          <AuthElement name={permissions.FulfillmentServiceCreate}>
            <Button
              type="primary"
              onClick={() =>
                router.push(
                  ("/product-bases/fulfillments/add",
                  "/product-bases/fulfillments/add")
                )
              }
            >
              Add New
            </Button>
          </AuthElement>
        }
      />
      <Modal
        visible={config}
        onCancel={() => setConfig(null)}
        title={
          config?.slug.charAt(0).toUpperCase() +
          config?.slug.slice(1) +
          " API Configs"
        }
        footer={
          <div>
            <Button
              onClick={() => {
                setConfig(null);
                form.resetFields();
              }}
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>
            <AuthElement name={permissions.FulfillmentServiceUpdate}>
              <Button
                loading={loadingApiConfig}
                form="form-api-config"
                type="primary"
                htmlType="submit"
              >
                Save Changes
              </Button>
            </AuthElement>
          </div>
        }
      >
        {formConfig}
      </Modal>
    </Container>
  );
};

export default ListFulfillmentServices;
