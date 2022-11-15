import { Form, Input, message, Modal, Skeleton, TreeSelect } from "antd";
import React from "react";
import { ARTWORK_CATEGORY } from "graphql/queries/artworkCategories";
import CREATEARTWORKCATEGORY from "graphql/mutate/createArtworkCategory";
import { useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import { useAppValue } from "context";

const ArtworkCategoryForm = ({
  visible = true,
  category = null,
  showParent = true,
  onFinish = () => {},
  onCancel = () => {},
  // refetch = true,
}) => {
  const [form] = Form.useForm();
  const [{ sellerId }] = useAppValue();
  const [createCategory] = useMutation(
    CREATEARTWORKCATEGORY
    //   , {
    //   refetchQueries: refetch
    //     ? [
    //         {
    //           query: ARTWORK_CATEGORY,
    //         },
    //       ]
    //     : [],
    // }
  );

  const onSubmit = (values) => {
    createCategory({ variables: values })
      .then((res) => {
        message.success("Category created");
        onFinish(res.data.createArtworkCategory);
        form.resetFields();
      })
      .catch((err) => message.error(err.message));
  };

  const renderTree = (cats) => {
    return cats.map((cat) => (
      <TreeSelect.TreeNode
        key={cat.id ? cat.id : "-"}
        value={cat.id}
        title={cat.title}
      >
        {cat.children && renderTree(cat.children)}
      </TreeSelect.TreeNode>
    ));
  };

  return (
    <Modal
      visible={visible}
      title={category ? "Update category" : "Add new category"}
      onOk={() => form.submit()}
      onCancel={onCancel}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Category Name"
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <Input />
        </Form.Item>
        {showParent && (
          <Query query={ARTWORK_CATEGORY} variables={{ sellerId }}>
            {({ data, loading, error }) => {
              if (loading) {
                return <Skeleton loading={true} loading={true} />;
              }
              if (data) {
                return (
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="parentID"
                    label="Parent Category"
                    rules={[{ initialValue: null }]}
                  >
                    <TreeSelect
                      showSearch={true}
                      multiple={false}
                      treeNodeFilterProp="title"
                      treeDefaultExpandAll={true}
                      allowClear
                      placeholder="--Root---"
                    >
                      {renderTree(data.artworkCategories)}
                    </TreeSelect>
                  </Form.Item>
                );
              }
              return null;
            }}
          </Query>
        )}
      </Form>
    </Modal>
  );
};

export default ArtworkCategoryForm;
