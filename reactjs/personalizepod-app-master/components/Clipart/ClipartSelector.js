import React from "react";
import useClipartCategories from "hooks/useClipartCategories";
import {
  Button,
  Divider,
  Form,
  Radio,
  Select,
  Skeleton,
  TreeSelect,
} from "antd";
import { useState, useEffect } from "react";
import { get } from "lodash";
import { Query } from "@apollo/client/react/components";
import CLIPARTS_QUERY from "graphql/queries/clipart/clipartsByCatgeory";
import Scrollbars from "react-custom-scrollbars";
const ImageSwicher = ({ options, value, onChange = () => {} }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map((op) => (
        <div key={op.value} onClick={() => onChange(op.value)}>
          <img
            style={{
              transition: "all 0.2s ease",
              width: 80,
              height: 80,
              objectFit: "contain",
              boxShadow: "0 0 2px 1px rgba(0,0,0,0.2)",
              borderRadius: 3,
              cursor: "pointer",
              border:
                value === op.value
                  ? "3px solid var(--primary-color, #5c6ac4)"
                  : "3px solid #fff",
            }}
            src={`${process.env.CDN_URL}100x100/${op.image}`}
            className={value === op.value ? "active" : ""}
          />
        </div>
      ))}
    </div>
  );
};

const ColorSwicher = ({ options, value, onChange = () => {} }) => {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {options.map((op) => (
        <div
          key={op.value}
          onClick={() => onChange(op.value)}
          style={{
            transition: "all 0.2s ease",
            width: 60,
            height: 60,
            boxShadow: "0 0 2px 1px rgba(0,0,0,0.2)",
            borderRadius: 3,
            background: op.color,
            border:
              value === op.value
                ? "3px solid var(--primary-color, #5c6ac4)"
                : "3px solid #fff",
          }}
        ></div>
      ))}
    </div>
  );
};

const ClipartSubCategorySelector = ({
  category = null,
  onChange = () => {},
}) => {
  const [child, setChild] = useState(null);
  const [showSubcategory, setShowSubcategory] = useState(false);
  const children = get(category, "children", []);
  useEffect(() => {
    setChild(null);
  }, [category]);
  useEffect(() => {
    if (child && Array.isArray(child.children)) {
      setShowSubcategory(true);
    } else {
      onChange(child?.id);
      setShowSubcategory(false);
    }
  }, [child]);
  return (
    <div>
      <Form.Item>
        {((displayMode) => {
          switch (displayMode) {
            case "ImageSwitcher":
              return (
                <ImageSwicher
                  options={children.map((cat) => ({
                    image: cat.displaySettings.value,
                    value: cat.id,
                  }))}
                  value={child?.id}
                  onChange={(v) => setChild(children.find((c) => c.id === v))}
                />
              );
            case "ColorSwitcher":
              return (
                <ColorSwicher
                  options={children.map((cat) => ({
                    color: cat.displaySettings.value,
                    value: cat.id,
                  }))}
                  value={child?.id}
                  onChange={(v) => setChild(children.find((c) => c.id === v))}
                />
              );
            case "Button":
              return (
                <Radio.Group
                  value={child?.id}
                  onChange={(e) =>
                    setChild(children.find((c) => c.id === e.target.value))
                  }
                >
                  {children.map((cat) => (
                    <Radio.Button value={cat.id} key={cat.id}>
                      {cat.displaySettings.value || cat.title}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              );
            default:
              return (
                <Select
                  placeholder="Select category"
                  value={child?.id}
                  onChange={(v) => setChild(children.find((c) => c.id === v))}
                >
                  {children.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.displaySettings.value || cat.title}
                    </Select.Option>
                  ))}
                </Select>
              );
          }
        })(category.displaySettings.displayMode)}
      </Form.Item>
      {showSubcategory && child && (
        <ClipartSubCategorySelector category={child} onChange={onChange} />
      )}
    </div>
  );
};
const ClipartSelector = ({ categoryID, onSelect = () => {}, style = {} }) => {
  const [category, setCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedClipart, setSelectedClipart] = useState();
  const { tree, categories } = useClipartCategories({ search: "" });
  const [showSubcategory, setShowSubcategory] = useState(false);

  useEffect(() => {
    setSelectedClipart(null);
    if (category && Array.isArray(category.children)) {
      setShowSubcategory(true);
    } else {
      if (category) {
        setSelectedCategory(category.id);
      }
      setShowSubcategory(false);
    }
  }, [category]);

  useEffect(() => {
    setSelectedClipart(null);
  }, [selectedCategory]);

  const treeNode = (node) => {
    return (
      <TreeSelect.TreeNode
        value={node.id}
        title={
          <span style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{node.title}</span>{" "}
            <span style={{ color: "#999" }}>
              ({Intl.NumberFormat().format(node.numberOfCliparts)})
            </span>
          </span>
        }
        key={node.id}
      >
        {node.children && node.children.map((n) => treeNode(n))}
      </TreeSelect.TreeNode>
    );
  };
  return (
    <div style={style}>
      <Form.Item
        label="Select Category"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <TreeSelect
          multiple={false}
          value={category?.id}
          onChange={(cid) => {
            setCategory(categories.find((cat) => cat.id === cid));
          }}
          style={{ width: "100%" }}
        >
          {tree.map((node) => treeNode(node))}
        </TreeSelect>
      </Form.Item>
      {showSubcategory && category && (
        <ClipartSubCategorySelector
          category={category}
          onChange={(v) => {
            setSelectedCategory(v);
          }}
        />
      )}
      {selectedCategory && (
        <Query
          query={CLIPARTS_QUERY}
          variables={{ categoryID: selectedCategory }}
        >
          {({ data, loading }) => {
            if (loading) {
              return <Skeleton />;
            }
            if (data) {
              const { cliparts } = data;
              return (
                <Form.Item label="Select Clipart">
                  <Scrollbars autoHeight={true} autoHeightMax={300}>
                    <div style={{ padding: 2 }}>
                      <ImageSwicher
                        options={cliparts.map((clipart) => ({
                          value: clipart.id,
                          image: clipart.file.key,
                        }))}
                        value={selectedClipart?.id}
                        onChange={(id) =>
                          setSelectedClipart(cliparts.find((c) => c.id === id))
                        }
                      />
                    </div>
                  </Scrollbars>
                </Form.Item>
              );
            }
          }}
        </Query>
      )}
      <Divider />
      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          disabled={selectedClipart === null}
          onClick={() => onSelect(selectedClipart)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default ClipartSelector;
