import useClipartCategories, {
  makeTree,
  getChildrenIDs,
} from "hooks/useClipartCategories";
import { debounce, omit } from "lodash";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Menu,
  message,
  Modal,
  Tree,
  TreeSelect,
  Button,
} from "antd";
import Search from "antd/lib/input/Search";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import confirm from "antd/lib/modal/confirm";
import {
  QuestionCircleOutlined,
  EditOutlined,
  FolderAddOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Scrollbars from "react-custom-scrollbars";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";
import { permissionCheck } from "components/Utilities/PermissionCheck";

const DELETE_CLIPART_CATEGORY = gql`
  mutation($id: String!) {
    deleteClipartCategory(id: $id)
  }
`;
const CREATE_CLIPART_CATEGORY = gql`
  mutation($title: String!, $parentID: String) {
    category: createClipartCategory(title: $title, parentID: $parentID) {
      id
      key: id
      parentID
      title
      numberOfCliparts
    }
  }
`;
const UPDATE_CLIPART_CATEGORY = gql`
  mutation($id: String!, $title: String!, $parentID: String) {
    category: updateClipartCategory(
      id: $id
      title: $title
      parentID: $parentID
    ) {
      id
      key: id
      parentID
      title
      numberOfCliparts
    }
  }
`;

const checkNode = (node) => {
  if (node.hasClipart) {
    node.disabled = true;
  }
  if (Array.isArray(node.children)) {
    node.children.forEach((n) => checkNode(n));
  }
};

const useClipartCategoryForm = ({ category, onFinish = () => {} }) => {
  const [form] = Form.useForm();
  const { categories } = useClipartCategories({ search: "" });
  const [createClipcartCategory, { loading: createLoading }] = useMutation(
    CREATE_CLIPART_CATEGORY
  );
  const [updateClipcartCategory, { loading: updateLoading }] = useMutation(
    UPDATE_CLIPART_CATEGORY
  );
  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    }
  }, [category]);
  const handSubmit = (values) => {
    if (category.id) {
      updateClipcartCategory({
        variables: { id: category.id, ...values },
      })
        .then((res) => {
          onFinish(res.data.category);
          message.success("Category updated");
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      createClipcartCategory({
        variables: values,
      })
        .then((res) => {
          onFinish(res.data.category);
          message.success("Category created");
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  const childrenIDs =
    category && category.id ? getChildrenIDs(category, categories || []) : [];
  return [
    <Form
      form={form}
      id="clipart-category-form"
      onFinish={handSubmit}
      layout="vertical"
    >
      <Form.Item label="Parent" name="parentID">
        <TreeSelect
          treeDefaultExpandAll={true}
          treeData={makeTree(
            categories.map((cat) => {
              if (
                (category && category.id === cat.id) ||
                cat.hasClipart ||
                childrenIDs.includes(cat.id)
              ) {
                return { ...cat, value: cat.id, disabled: true };
              }
              return { ...cat, value: cat.id };
            })
          )}
          allowClear
          placeholder="--Root--"
        />
      </Form.Item>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Category title is required" }]}
      >
        <Input placeholder="Category title" autoFocus />
      </Form.Item>
    </Form>,
    createLoading || updateLoading,
  ];
};

const ClipartCategories = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const {
    tree,
    numberOfCliparts,
    expandedKeys: searchExpandKeys,
  } = useClipartCategories({
    search: searchValue,
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, loading] = useClipartCategoryForm({
    category: selectedCategory,
    onFinish: () => {
      setShowCategoryForm(false);
    },
  });

  const [deleteCategory] = useMutation(DELETE_CLIPART_CATEGORY);
  const onSearch = (_, values) => {
    setSearchValue(values.search);
  };

  const handleMenuClick = ({ item, key }) => {
    setMenuVisible(false);
    switch (key) {
      case ".$edit":
        setShowCategoryForm(true);
        break;
      case ".$add":
        setSelectedCategory({ parentID: selectedCategory.id, title: "" });
        setShowCategoryForm(true);
        break;
      case ".$settings":
        router.query.settings = 1;
        router.query.categoryID = selectedCategory.id;
        router.push(router);
        break;
      case ".$delete":
        confirm({
          title: `Delete "${selectedCategory.title}" category?`,
          content:
            "It can contain the sub-folders or cliparts, so if you remove it means you remove the nested folders or cliparts too.",
          icon: <QuestionCircleOutlined />,
          type: "warning",
          okButtonProps: { danger: true },
          okText: "Delete",
          onOk: () => {
            deleteCategory({ variables: { id: selectedCategory.id } })
              .then(() => {
                if (selectedCategory.id === router.query.categoryID) {
                  router.query = omit(router.query, "categoryID");
                  router.push(router);
                }
              })
              .catch((err) => {
                message.error(err.message);
              });
          },
        });
        break;
      default:
        break;
    }
  };

  const handleSelect = (keys) => {
    if (keys.length === 0) return;
    if (keys[0]) {
      router.query.categoryID = keys[0];
    } else {
      router.query = omit(router.query, "categoryID");
    }
    router.push(router);
  };

  const availableUpdate = permissionCheck(permissions.ClipartCategoryUpdate);
  const availableDelete = permissionCheck(permissions.ClipartCategoryDelete);
  const availableCreate = permissionCheck(permissions.ClipartCategoryCreate);

  return (
    <div className="p-clipart-category" style={{ padding: 15 }}>
      <div
        className="pb-15 header-category"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Categories</div>
        <AuthElement name={permissions.ClipartCategoryCreate}>
          <Button
            style={{ padding: 0 }}
            type="link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedCategory({ parentID: null, title: "" });
              setShowCategoryForm(true);
            }}
          >
            New category
          </Button>
        </AuthElement>
      </div>
      <Form onValuesChange={debounce(onSearch, 200)}>
        <Form.Item name="search" className="header-filter">
          <Search placeholder="Search..." />
        </Form.Item>
      </Form>
      <Scrollbars style={{ height: `calc(100vh - 227px)` }}>
        <Tree
          className="tree-transparent"
          style={{ paddingRight: 10 }}
          filterTreeNode={(node) => {
            node.title === "Dog";
          }}
          onSelect={handleSelect}
          treeData={[
            { title: "All categories", key: null, id: null, numberOfCliparts },
            ...tree,
          ]}
          autoExpandParent={searchValue !== ""}
          expandedKeys={[...expandedKeys, ...searchExpandKeys]}
          selectedKeys={[router.query.categoryID || []]}
          onExpand={(keys) => setExpandedKeys(keys)}
          showLine={{ showLeafIcon: false }}
          showIcon={null}
          blockNode
          titleRender={(node) => {
            if (node.id === null) {
              return (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{node.title}</span>{" "}
                  <span style={{ color: "#999" }}>
                    {Intl.NumberFormat().format(numberOfCliparts)}
                  </span>
                </div>
              );
            }
            var title = <span>{node.title}</span>;
            if (searchValue) {
              const index = node.title
                .toLocaleLowerCase()
                .indexOf(searchValue.toLowerCase());
              const beforeTitle = node.title.substr(0, index);
              const highlight = node.title.substr(index, searchValue.length);
              const afterTitle = node.title.substr(index + searchValue.length);
              title =
                index > -1 ? (
                  <span>
                    {beforeTitle}
                    <span style={{ color: "var(--primary-color)" }}>
                      {highlight}
                    </span>
                    {afterTitle}
                  </span>
                ) : (
                  <span>{node.title}</span>
                );
            }
            return (
              <ContextMenuTrigger
                collect={() => {
                  setMenuVisible(true);
                  setSelectedCategory(node);
                }}
                categoryId={node.id}
                id="clipart-category-contextmenu"
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <span>{title}</span>{" "}
                  <span style={{ color: "#999" }}>
                    {Intl.NumberFormat().format(node.numberOfCliparts)}
                  </span>
                </div>
              </ContextMenuTrigger>
            );
          }}
        />
      </Scrollbars>

      <ContextMenu id="clipart-category-contextmenu" style={{ zIndex: 99 }}>
        {menuVisible && (
          <div className="ant-popover-inner">
            <AuthElement
              name={[
                permissions.ClipartCategoryCreate,
                permissions.ClipartCategoryDelete,
                permissions.ClipartCategoryUpdate,
              ]}
            >
              <Menu
                style={{
                  borderRight: "none",
                  width: 200,
                  borderRadius: 2,
                }}
                selectedKeys={null}
                onClick={handleMenuClick}
              >
                <Menu.Item
                  hidden={!availableUpdate}
                  key="edit"
                  icon={<EditOutlined />}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  key="add"
                  icon={<FolderAddOutlined />}
                  disabled={selectedCategory?.hasClipart}
                  hidden={!availableCreate}
                >
                  Add Subcategory
                </Menu.Item>
                <Menu.Item
                  key="settings"
                  icon={<SettingOutlined />}
                  hidden={!availableUpdate}
                >
                  Settings
                </Menu.Item>
                {availableDelete ? (
                  <>
                    <Menu.Divider />
                    <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                      Delete
                    </Menu.Item>
                  </>
                ) : null}
              </Menu>
            </AuthElement>
          </div>
        )}
      </ContextMenu>
      <Modal
        visible={showCategoryForm}
        title={selectedCategory?.id ? "Edit Category" : "New Category"}
        onCancel={() => setShowCategoryForm(false)}
        okButtonProps={{
          htmlType: "submit",
          form: "clipart-category-form",
          loading: loading,
        }}
      >
        {categoryForm}
      </Modal>
    </div>
  );
};

export default ClipartCategories;
