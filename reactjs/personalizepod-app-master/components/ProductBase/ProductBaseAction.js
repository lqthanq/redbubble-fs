import {
  Button,
  Divider,
  Dropdown,
  Menu,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import React from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { HiDuplicate } from "react-icons/hi";
import { DELETE_PRODUCT_BASE } from "graphql/mutate/productBase/deleteProductBase";
import { DUPLICATE_PRODUCT_BASE } from "graphql/mutate/productBase/duplicateProductBase";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import styled from "styled-components";
import { messageDelete, messageDuplicate } from "components/Utilities/message";
import { IoIosArrowDown } from "react-icons/io";
import { useAppValue } from "context";
import { isAdministrator } from "utils";
import { permissions } from "../Utilities/Permissions";
import AuthElement from "components/User/AuthElement";

const Container = styled.div``;
const ProductBaseAction = ({ record, refetch, action }) => {
  const [{ currentUser }, dispatch] = useAppValue();
  const id = record ? record.id : action.id;
  const router = useRouter();
  const [DeleteProductBase] = useMutation(DELETE_PRODUCT_BASE);
  const [DuplicateProductBase] = useMutation(DUPLICATE_PRODUCT_BASE);
  const onConfirm = () => {
    DeleteProductBase({ variables: { id: id } })
      .then(() => {
        messageDelete("Product base");
        refetch();
      })
      .catch((err) => {
        if (err) {
          notification.error({ message: err.message });
        }
      });
  };
  const onConfirmCopy = () => {
    DuplicateProductBase({ variables: { id: id } })
      .then(() => {
        messageDuplicate("Product base");
        refetch();
      })
      .catch((err) => {
        if (err) {
          notification.error({ message: err.message });
        }
      });
  };
  const editBase = () => (
    <div
      onClick={() => router.push("/product-bases/[id]", `/product-bases/${id}`)}
    >
      <BiEditAlt className="custom-icon anticon" />
      {record ? "Edit" : ""}
    </div>
  );
  const deleteBase = () => (
    <div>
      <Popconfirm
        overlayClassName="menu-action-base-popconfirm"
        title="Are you sure to delete this product base?"
        placement={record ? "left" : "topRight"}
        onConfirm={onConfirm}
        cancelText="No"
        okButtonProps={{
          danger: true,
        }}
      >
        <AiTwotoneDelete
          style={{ color: "var(--error-color)" }}
          className="custom-icon anticon"
        />
        {record ? "Delete" : ""}
      </Popconfirm>
    </div>
  );
  const duplicateBase = () => (
    <div>
      <Popconfirm
        overlayClassName="menu-action-base-popconfirm"
        title="Are you sure to duplicate this product base?"
        placement={record ? "left" : "topRight"}
        onConfirm={onConfirmCopy}
        cancelText="No"
      >
        <HiDuplicate className="custom-icon anticon" />
        {record ? "Duplicate" : ""}
      </Popconfirm>
    </div>
  );

  return (
    <Container>
      {!record ? (
        <div className="align-action">
          <AuthElement name={permissions.UpdateProductBase}>
            <Tooltip title="Edit">{editBase()}</Tooltip>
            <Divider type="vertical" />
          </AuthElement>
          <AuthElement name={permissions.CreateProductBase}>
            {!isAdministrator(currentUser) && (
              <>
                <Tooltip title="Duplicate">{duplicateBase()}</Tooltip>
                <Divider type="vertical" />
              </>
            )}
          </AuthElement>
          <AuthElement name={permissions.DeleteProductBase}>
            <Tooltip title="Delete">{deleteBase()}</Tooltip>
          </AuthElement>
        </div>
      ) : (
        <AuthElement
          name={[
            permissions.CreateProductBase,
            permissions.UpdateProductBase,
            permissions.DeleteProductBase,
          ]}
        >
          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu style={{ border: "1px solid #e8e6e6" }}>
                <AuthElement name={permissions.UpdateProductBase}>
                  <Menu.Item key="1">{editBase()}</Menu.Item>
                </AuthElement>
                <AuthElement name={permissions.CreateProductBase}>
                  {!isAdministrator(currentUser) && (
                    <Menu.Item key="2">{duplicateBase()}</Menu.Item>
                  )}
                  <Menu.Divider />
                </AuthElement>
                <AuthElement name={permissions.DeleteProductBase}>
                  <Menu.Item
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "var(--error-color)",
                    }}
                    key="3"
                  >
                    {deleteBase()}
                  </Menu.Item>
                </AuthElement>
              </Menu>
            }
          >
            <Button>
              Action <IoIosArrowDown className="anticon" />
            </Button>
          </Dropdown>
        </AuthElement>
      )}
    </Container>
  );
};

export default ProductBaseAction;
