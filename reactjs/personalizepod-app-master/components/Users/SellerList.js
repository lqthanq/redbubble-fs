import { useMutation, useQuery } from "@apollo/client";
import { Button, Dropdown, Menu, Modal, notification, Tag } from "antd";
import React, { useState } from "react";
import useFormUser from "./FormUser";
import _, { get } from "lodash";
import { BiEditAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";
import ErrorPage from "next/error";
import { SELLERS } from "graphql/queries/users";
import { BLOCK_USER } from "graphql/mutate/user/userAction";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosArrowDown, IoIosCheckmarkCircle } from "react-icons/io";
import SellerFilter from "./SellerFilter";
import { isAdmin } from "components/Utilities/isAdmin";

const SellerList = () => {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState({
    record: null,
    visible: false,
  });
  const [filter, setFilter] = useState({
    search: get(router, "query.search", ""),
    page: get(router, "query.page", 1),
    pageSize: get(router, "query.pageSize", 20),
    block: get(router, "query.block", null),
  });
  const { data, refetch, error, loading } = useQuery(SELLERS, {
    fetchPolicy: "network-only",
    variables: {
      filter,
    },
  });
  const [blockUser, { loading: blockLoading }] = useMutation(BLOCK_USER);
  const onCancel = () => {
    setShowAdd({
      record: null,
      visible: false,
    });
  };
  const [
    formUser,
    { createLoading, updateLoading, form, setImage },
  ] = useFormUser({
    user: showAdd.record,
    refetch,
    onCancel,
  });

  const onhandleCancel = () => {
    setImage();
    onCancel();
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 400,
      render: (record) => {
        return (
          <CustomizeAvatarOwner
            size={32}
            src={`${process.env.CDN_URL}/300x300/${record.avatar?.key}`}
            author={record}
            showEmail={true}
          />
        );
      },
    },
    // { title: "Email", key: "email", dataIndex: "email", width: 240 },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
      width: 190,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "right",
      render: (record) => (
        <div className="align-action">
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  switch (key) {
                    case "edit":
                      return setShowAdd({ record, visible: true });
                    case "suspend":
                      return onConfirmBlock(record.id, key, true);
                    case "unsuspend":
                      return onConfirmBlock(record.id, key, false);
                    default:
                      break;
                  }
                }}
              >
                <Menu.Item
                  key="edit"
                  icon={<BiEditAlt className="anticon custom-icon" />}
                >
                  Edit
                </Menu.Item>
                {record.status ? (
                  <Menu.Item
                    key="suspend"
                    icon={
                      <RiErrorWarningFill className="anticon custom-icon" />
                    }
                  >
                    Suspend
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key="unsuspend"
                    icon={
                      <IoIosCheckmarkCircle className="anticon custom-icon" />
                    }
                  >
                    Unsuspend
                  </Menu.Item>
                )}
              </Menu>
            }
            placement="bottomRight"
            arrow
          >
            <Button>
              Action <IoIosArrowDown className="anticon" />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  if (isAdmin()) {
    columns.splice(
      1,
      0,
      {
        title: "Stores",
        dataIndex: "numberOfStores",
        key: "numberOfStores",
        width: 150,
      },
      {
        title: "Cliparts",
        dataIndex: "numberOfCliparts",
        key: "numberOfCliparts",
        width: 150,
      },
      {
        title: "Artworks",
        dataIndex: "numberOfArtworks",
        key: "numberOfArtworks",
        width: 150,
      },
      {
        title: "Campaigns",
        dataIndex: "numberOfCampaigns",
        key: "numberOfCampaigns",
        width: 150,
      },
      {
        title: "Sale",
        dataIndex: "numberOfOrders",
        key: "numberOfOrders",
        width: 150,
      }
    );
  }

  const onConfirmBlock = (id, key, block) => {
    Modal.confirm({
      title: `Are you sure to ${key} this order?`,
      onOk: () => {
        blockUser({ variables: { id: id, block } })
          .then((res) => {
            if (res) {
              notification.success({
                message: `User has been ${key + "ed"} successfully!`,
              });
              refetch();
            }
          })
          .catch((err) => notification.error({ message: err.message }));
      },
      width: 500,
      okButtonProps: { blockLoading },
    });
  };

  if (error) return <ErrorPage statusCode={403} title={error.message} />;

  return (
    <div className="p-15-24">
      <CustomizeMainContent
        multipleFilter={true}
        setFilter={setFilter}
        dataSource={data?.sellers.hits}
        headerTitle="Sellers"
        columns={columns}
        pagination={false}
        filter={filter}
        filterContainer={<SellerFilter setFilter={setFilter} filter={filter} />}
        customLayout={false}
        headerButton={
          <>
            <Button
              type="primary"
              type="primary"
              onClick={() =>
                setShowAdd({
                  record: null,
                  visible: true,
                })
              }
            >
              Add New
            </Button>
          </>
        }
      />
      <Modal
        key={showAdd && showAdd.record?.id}
        title={showAdd?.record ? "Edit Seller" : "Add New Seller"}
        visible={showAdd.visible}
        okButtonProps={{
          htmlType: "submit",
          form: "user",
          loading: createLoading || updateLoading,
        }}
        width="700px"
        okText="Save"
        onCancel={onhandleCancel}
      >
        {formUser}
      </Modal>
    </div>
  );
};

export default SellerList;
