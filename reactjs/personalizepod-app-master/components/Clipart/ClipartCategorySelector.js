import { TreeSelect } from "antd";
import useClipartCategories from "hooks/useClipartCategories";
import { useEffect, useState } from "react";

export const getParentIDs = (node, nodes) => {
  if (!node) {
    return [];
  }
  var parents = [];
  if (node.parentID !== null) {
    parents.push(node.parentID);
    var parent = nodes.find((n) => n.id == node.parentID);
    parents.push(...getParentIDs(parent, nodes));
  }
  return parents;
};

const ClipartCategorySelector = ({ value, onChange = () => {} }) => {
  const { tree, categories } = useClipartCategories({ search: "" });
  const [expandKeys, setExpandKeys] = useState([]);
  useEffect(() => {
    if (value) {
      var parents = getParentIDs(
        categories.find((c) => c.id === value),
        categories
      );
      setExpandKeys([...expandKeys, ...parents]);
    }
  }, [value]);
  return (
    <TreeSelect
      value={value}
      showSearch={true}
      filterTreeNode={(search, item) => {
        return (
          item.title.toLocaleLowerCase().indexOf(search.toLowerCase()) >= 0
        );
      }}
      multiple={false}
      onChange={onChange}
      treeData={tree}
      treeExpandedKeys={expandKeys}
      //autoExpandParent={true}
      onTreeExpand={(expandedKeys) => setExpandKeys(expandedKeys)}
    />
  );
};

export default ClipartCategorySelector;
