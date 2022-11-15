import { Modal, notification } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "@apollo/client";
import duplicateArtworkCategory from "graphql/mutate/duplicateArtworkCategory";
import duplicateClipartCategory from "graphql/mutate/duplicateClipartCategory";
import { HiDuplicate } from "react-icons/hi";
import { messageDuplicate } from "./message";
const CategoryDuplicate = ({ id, setClickRight }) => {
  const router = useRouter();
  const [DuplicateArtworkCategory] = useMutation(duplicateArtworkCategory);
  const [DuplicateClipartCategory] = useMutation(duplicateClipartCategory);
  const confirm = () => {
    Modal.confirm({
      content: "Are you sure to duplicate category?",
      onOk() {
        if (router.pathname === "/cliparts") {
          DuplicateClipartCategory({ variables: { id: id } })
            .then(() => {
              messageDuplicate("Category");
              router.push("/cliparts", "cliparts");
            })
            .catch((err) => {
              notification.error({ message: err.message });
            });
        }
        if (router.pathname === "/artworks") {
          DuplicateArtworkCategory({ variables: { id: id } })
            .then(() => {
              messageDuplicate("Category");
              router.push("/artworks", "artworks");
            })
            .catch((err) => {
              notification.error({ message: err.message });
            });
        }
      },
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
    >
      <HiDuplicate className="custom-icon anticon" /> Duplicate
    </a>
  );
};

export default CategoryDuplicate;
