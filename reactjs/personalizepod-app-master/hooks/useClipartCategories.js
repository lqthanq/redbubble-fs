import gql from "graphql-tag";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import CLIPART_CATEGORIES_QUERY from "graphql/queries/clipart/clipartCategories";
import {
  cloneDeep,
  each,
  groupBy,
  keyBy,
  omit,
  sortBy,
  sumBy,
  unionBy,
} from "lodash";
import { useAppValue } from "context";

const SUBSCRIPTION = gql`
  subscription {
    clipartCategory {
      action
      category {
        id
        key: id
        parentID
        title
        numberOfCliparts
        hasChild
      }
    }
  }
`;

const updateNumberOfCliparts = (node, nodes) => {
  if (node._) {
    return;
  }
  node.hasClipart = node.numberOfCliparts > 0;
  var children = nodes.filter((n) => n.parentID === node.id);
  if (children.length) {
    children.forEach((n) => updateNumberOfCliparts(n, nodes));
    node.numberOfCliparts += sumBy(children, (c) => c.numberOfCliparts);
    node._ = true;
  }
};

export const makeTree = (data) => {
  var groupedByParents = groupBy(data, "parentID");
  var catsById = keyBy(data, "id");
  each(omit(groupedByParents, "null"), (children, parentID) => {
    if (catsById[parentID]) {
      catsById[parentID].children = children;
    }
  });
  return groupedByParents["null"] || [];
};

export const getParentIDs = (node, nodes) => {
  var parents = [];
  if (node.parentID !== null) {
    parents.push(node.parentID);
    var parent = nodes.find((n) => n.id == node.parentID);
    parents.push(...getParentIDs(parent, nodes));
  }
  return parents;
};

export const getChildrenIDs = (node, nodes) => {
  var child = [];
  if (Array.isArray(node.children)) {
    node.children.forEach((n) => {
      child.push(n.id, ...getChildrenIDs(n, nodes));
    });
  }
  return child;
};

const useClipartCategories = ({ search = "" }) => {
  const [{ sellerId }] = useAppValue();
  const [numberOfCliparts, setNumberOfCliparts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [tree, setTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const { data, loading, error, subscribeToMore } = useQuery(
    CLIPART_CATEGORIES_QUERY,
    {
      variables: { sellerId },
    }
  );
  useEffect(() => {
    if (data) {
      var cats = cloneDeep(unionBy(data.categories.hits, "id"));
      cats.forEach((cat) => updateNumberOfCliparts(cat, cats));
      setNumberOfCliparts(data.categories.numberOfCliparts);
      setCategories(cats);
    }
  }, [data]);

  useEffect(() => {
    if (subscribeToMore) {
      try {
        subscribeToMore({
          document: SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const { action, category } = subscriptionData.data.clipartCategory;
            if (action === "create") {
              return Object.assign({}, prev, {
                categories: {
                  ...prev.categories,
                  hits: sortBy(
                    [category, ...prev.categories.hits, ...[]],
                    "title"
                  ),
                },
              });
            }
            if (action === "delete") {
              return Object.assign({}, prev, {
                categories: {
                  ...prev.categories,
                  hits: prev.categories.hits.filter(
                    (cat) => cat.id !== category.id
                  ),
                },
              });
            }
            return prev;
          },
        });
      } catch (err) {
        //keep slient
      }
    }
  }, [subscribeToMore]);

  useEffect(() => {
    if (search) {
      var visibleIds = [];
      categories.forEach((cat) => {
        if (cat.title.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
          visibleIds.push(cat.id, ...getParentIDs(cat, categories));
        }
      });
      var cats = categories.filter((cat) => visibleIds.includes(cat.id));
      setExpandedKeys(cats.filter((cat) => cat.parentID).map((cat) => cat.id));
    }
    setTree(makeTree(categories));
  }, [categories, search]);

  return { tree, categories, numberOfCliparts, expandedKeys, loading, error };
};

export default useClipartCategories;
