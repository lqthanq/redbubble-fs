import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  // Select,
  TreeSelect,
} from "antd";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CREATE_PRODUCT_BASE_CATEGORY } from "graphql/mutate/productBase/createProductBaseCategory";
import { PRODUCT_BASE_CATEGORIES } from "graphql/queries/productBase/category";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const ProductBaseCategory = ({
  value,
  onChange = () => {},
  // dataFulfillmentServices,
}) => {
  const [form] = Form.useForm();
  const [{ sellerId }] = useAppValue();
  const [filter, setFilter] = useState({
    search: "",
    fulfillmentId: null,
  });
  const [newCategory, setNewCategory] = useState();
  const [visible, setVisible] = useState(false);
  const { data: categoryBase, refetch } = useQuery(PRODUCT_BASE_CATEGORIES, {
    variables: {
      filter: {
        ...filter,
        sellerId,
      },
    },
    fetchPolicy: "no-cache",
  });
  const [createProductBaseCategory, { loading: createLoading }] = useMutation(
    CREATE_PRODUCT_BASE_CATEGORY
  );
  const dataCategory = categoryBase?.productBaseCategories?.hits;
  const getTreeData = (treeData) => {
    if (!treeData) {
      return [];
    }
    treeData.map((cat) => {
      cat.key = cat.id;
      cat.value = cat.id;
      cat.title = cat.title;
      cat.children = getTreeData(cat.children);
      return cat;
    });
    return treeData;
  };
  const handleAddCategory = (values) => {
    createProductBaseCategory({
      variables: {
        input: { ...values },
      },
    })
      .then((res) => {
        refetch();
        setVisible(false);
        form.resetFields();
        setNewCategory(res.data.createProductBaseCategory.id);
        onChange(res.data.createProductBaseCategory.id);
      })
      .catch((err) => notification.error({ message: err.message }));
  };
  return (
    <div>
      <TreeSelect
        value={newCategory ? newCategory : value}
        showSearch
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        treeData={getTreeData(dataCategory)}
        placeholder="Select a parent category"
        treeDefaultExpandAll
        onChange={(e) => {
          if (e) {
            setNewCategory();
            onChange(e);
          }
        }}
        defaultValue={newCategory}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <AuthElement name={permissions.FulfillmentServiceCreate}>
              <Divider style={{ margin: "4px 0" }} />
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  padding: 8,
                }}
              >
                <Button type="link" onClick={() => setVisible(true)}>
                  <FaPlus className="anticon" /> Add category
                </Button>
              </div>
            </AuthElement>
          </div>
        )}
      />
      <Modal
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        visible={visible}
        title="Add category"
        footer={
          <div>
            <Button
              onClick={() => {
                setVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              loading={createLoading}
              type="primary"
              form="add-cate"
              htmlType="submit"
            >
              Save
            </Button>
          </div>
        }
      >
        <Form
          id="add-cate"
          layout="vertical"
          form={form}
          onFinish={(values) => handleAddCategory(values)}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please input category title!" },
            ]}
          >
            <Input placeholder="Enter category title" />
          </Form.Item>
          {/* <Form.Item label="Fulfillment services" name="fulfillmentId">
            <Select showSearch placeholder="Custom fulfillment service title">
              {dataFulfillmentServices?.map((fulfillment) => (
                <Select.Option key={fulfillment.id} value={fulfillment.id}>
                  {fulfillment.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item label="Parent category" name="parentId">
            <TreeSelect
              allowClear
              showSearch
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={getTreeData(dataCategory)}
              placeholder="Select a parent category"
              treeDefaultExpandAll
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductBaseCategory;
