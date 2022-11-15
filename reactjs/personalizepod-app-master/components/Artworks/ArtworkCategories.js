import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import CategoriesCustomize from "../Utilities/CategoriesCustomize";
import { ARTWORK_CATEGORY } from "graphql/queries/artworkCategories";
import { useAppValue } from "context";
import { ARTWORK_CATEGORY_SUBCRIPTION } from "graphql/subscription/artwork";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";

const Container = styled.div`
  .ant-card-extra {
    padding: 12px 0;
  }
`;
const ArtworkCategories = ({
  categoryImportBase = false,
  customBase,
  customBg,
  artworkCustom,
  setCategorySelect,
  categorySelect,
  height,
}) => {
  const [{ currentUser, sellerId }] = useAppValue();
  const { data, subscribeToMore, refetch } = useQuery(ARTWORK_CATEGORY, {
    variables: { sellerId },
  });
  const router = useRouter();
  const [newCate, setNewCate] = useState(null);
  const pushToTree = (tree, node) => {
    if (tree.length === 0) {
      tree.push(node);
      return true;
    }
    router.query.categoryID = node.id;
    router.push(router);
    for (let i in tree) {
      if (tree[i].parentID === node.parentID) {
        tree.push(node);
        return true;
      } else if (tree[i].id === node.parentID) {
        tree[i].children = [...(tree[i].children || []), node];
        return true;
      } else if (Array.isArray(tree[i].children)) {
        if (pushToTree(tree[i].children, node)) {
          return true;
        }
      }
    }
    return false;
  };

  const removeFromTree = (tree, node) => {
    for (let i in tree) {
      if (tree[i].parentID === node.parentID) {
        tree = tree.filter((el) => el.id !== node.id);
        return true;
      } else if (tree[i].id === node.parentID && tree[i].children) {
        tree[i].children = tree[i].children.filter((el) => el.id !== node.id);
        if (!tree[i].children.length) {
          tree[i].children = null;
          return true;
        }
        return true;
      }
      if (Array.isArray(tree[i].children)) {
        if (removeFromTree(tree[i].children, node)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (currentUser) {
      subscribeToMore({
        document: ARTWORK_CATEGORY_SUBCRIPTION,
        variables: { userId: currentUser?.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          let newCategories = cloneDeep(prev.artworkCategories);
          if (
            subscriptionData.data.artworkCategorySubscription.action !==
            "update"
          ) {
            if (
              subscriptionData.data.artworkCategorySubscription.action ===
              "delete"
            ) {
              removeFromTree(
                newCategories,
                subscriptionData.data.artworkCategorySubscription.category
              );
            } else {
              pushToTree(
                newCategories,
                subscriptionData.data.artworkCategorySubscription.category
              );
              setNewCate(
                subscriptionData.data.artworkCategorySubscription.category
                  .parentID
              );
            }
            return {
              artworkCategories: newCategories,
            };
          } else {
            refetch();
          }
        },
      });
    }
  }, [currentUser?.id]);

  const clearCategories = (categories) => {
    const newCategories = [...(categories || [])].filter((el) => !el.deletedAt);
    return newCategories;
  };
  return (
    <Container className={!customBg ? "p-art-category" : ""}>
      <CategoriesCustomize
        categories={clearCategories(data?.artworkCategories)}
        height={height ?? 227}
        customBase={customBase}
        categoryImportBase={categoryImportBase}
        artworkCustom={artworkCustom}
        setCategorySelect={setCategorySelect}
        categorySelect={categorySelect}
        type="artworks"
        expandedKey={newCate ? [newCate] : []}
      />
    </Container>
  );
};

export default ArtworkCategories;
