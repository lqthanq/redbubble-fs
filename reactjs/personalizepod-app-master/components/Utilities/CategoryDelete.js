import { Modal, notification } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "@apollo/client";
import { AiTwotoneDelete } from "react-icons/ai";
import deleteClipartCategory from "../../graphql/mutate/deleteClipartCategory";
import deleteArtworkCategory from "../../graphql/mutate/deleteArtworkCategory";
import _ from "lodash";
import { messageDelete } from "./message";
const CategoryDelete = ({ id, setClickRight }) => {
  const router = useRouter();
  const [deleteClipartCategoryMutation] = useMutation(deleteClipartCategory);
  const [deleteArtworkCategoryMutation] = useMutation(deleteArtworkCategory);
  const confirm = () => {
    Modal.confirm({
      title: "Are you sure to delete this category?",
      content:
        "It can contain the sub-folders or cliparts, so if you remove it means you remove the nested folders or cliparts too.",
      onOk() {
        if (router.pathname === "/cliparts") {
          deleteClipartCategoryMutation({ variables: { id: id } })
            .then((res) => {
              messageDelete("Category");
              router.push("/cliparts", "cliparts");
            })
            .catch((err) => {
              if (
                err.message ===
                "GraphQL error: Please delete all subcategories first"
              ) {
                notification.error({
                  message: "Please delete all subcategories first",
                });
              } else {
                notification.error({ message: err.message });
              }
            });
        }
        if (router.pathname === "/artworks") {
          deleteArtworkCategoryMutation({ variables: { id: id } })
            .then((res) => {
              messageDelete("Category");
              router.push("/artworks", "artworks");
            })
            .catch((err) => {
              if (
                err.message ===
                "GraphQL error: Please delete all subcategories first"
              ) {
                notification.error({
                  message: "Please delete all subcategories first",
                });
              } else {
                notification.error({ message: err.message });
              }
            });
        }
      },
      okButtonProps: { danger: true },
    });
  };

  return (
    <a
      href="/#"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        confirm();
        setClickRight({ visible: false, clickX: null, clickY: null });
      }}
      style={{ color: "var(--error-color)" }}
    >
      <AiTwotoneDelete
        style={{ color: "var(--error-color)" }}
        className="custom-icon anticon"
      />
      Delete
    </a>
  );
};

export default CategoryDelete;
