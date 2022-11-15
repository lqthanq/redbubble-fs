import { TreeSelect, Skeleton, Button } from "antd";
import ArtworkCategoryForm from "./ArtworkCategoryForm";
import { ARTWORK_CATEGORY } from "graphql/queries/artworkCategories";
import { Query } from "@apollo/client/react/components";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const ArtworkCategoriesField = ({
  value,
  onChange = () => {},
  multiple = true,
  addNewable = true,
  onShowAddNewCatStateChange = () => {},
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [{ sellerId }] = useAppValue();
  useEffect(() => {
    onShowAddNewCatStateChange(showAddNew);
  }, [showAddNew]);
  const renderTree = (cats) => {
    return cats.map((cat) => (
      <TreeSelect.TreeNode key={cat.id} value={cat.id} title={cat.title}>
        {cat.children && renderTree(cat.children)}
      </TreeSelect.TreeNode>
    ));
  };
  return (
    <Query query={ARTWORK_CATEGORY} variables={{ sellerId }}>
      {({ data, loading, error }) => {
        if (loading) {
          return <Skeleton active={true} loading={true} />;
        }
        if (data) {
          return (
            <div>
              <TreeSelect
                value={value}
                showSearch={true}
                onChange={onChange}
                style={{ width: "100%" }}
                multiple={multiple}
                treeNodeFilterProp="title"
                treeDefaultExpandAll={true}
              >
                {renderTree(data.artworkCategories)}
              </TreeSelect>
              {addNewable && (
                <div style={{ textAlign: "right" }}>
                  <AuthElement name={permissions.ArtworkCategoryCreate}>
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      style={{ paddingRight: 0 }}
                      onClick={() => setShowAddNew(true)}
                    >
                      New Category
                    </Button>
                  </AuthElement>
                  <ArtworkCategoryForm
                    visible={showAddNew}
                    onCancel={() => setShowAddNew(false)}
                    onFinish={(cat) => {
                      if (multiple) {
                        if (Array.isArray(value)) {
                          onChange([...value, cat.id]);
                        } else {
                          onChange([cat.id]);
                        }
                      } else {
                        onChange(cat.id);
                      }
                      setShowAddNew(false);
                    }}
                  />
                </div>
              )}
            </div>
          );
        }
      }}
    </Query>
  );
};

export default ArtworkCategoriesField;
