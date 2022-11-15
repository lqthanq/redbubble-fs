import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  notification,
  // Select,
  Skeleton,
  TreeSelect,
} from "antd";
import { messageSave } from "components/Utilities/message";
import {
  CREATE_PRODUCT_BASE_CATEGORY,
  UPDATE_PRODUCT_BASE_CATEGORY,
} from "graphql/mutate/productBase/createProductBaseCategory";
import {
  PRODUCT_BASE_CATEGORIES,
  PRODUCT_BASE_CATEGORY_BY_ID,
} from "graphql/queries/productBase/category";
// import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const CategoryForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [{ sellerId }] = useAppValue();
  const [createProductBaseCategory, { loading: createLoading }] = useMutation(
    CREATE_PRODUCT_BASE_CATEGORY
  );
  const [updateProductBaseCategory, { loading: updateLoading }] = useMutation(
    UPDATE_PRODUCT_BASE_CATEGORY
  );

  // const { data: fulfillmentData } = useQuery(FULFILLMENTS, {
  //   variables: {
  //     search: "",
  //     page: 1,
  //     pageSize: 20,
  //     sellerId,
  //   },
  //   fetchPolicy: "network-only",
  // });

  const { data: categoriesData } = useQuery(PRODUCT_BASE_CATEGORIES, {
    variables: {
      filter: { search: "", page: 1, pageSize: 20, sellerId },
    },
    fetchPolicy: "network-only",
  });

  const categories = categoriesData?.productBaseCategories?.hits ?? [];

  const removeCurrentCate = (currentData, id) => {
    let data = cloneDeep(currentData);
    var newCate = [];
    for (var i = 0; i < data.length; i++) {
      if (data && data[i].children && data[i].children.length) {
        data[i].children = removeCurrentCate(data[i].children, id);
      }
      if (data[i].id !== id) {
        newCate.push(data[i]);
      }
    }
    return newCate;
  };

  const { data, loading, error, refetch } = useQuery(
    PRODUCT_BASE_CATEGORY_BY_ID,
    {
      variables: {
        id,
      },
      skip: !id,
    }
  );

  if (loading) return <Skeleton />;
  if (error) return `${error.message}`;

  const categoryById = data?.productBaseCategoryByID;

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

  const onSaveCategory = (values) => {
    if (!id) {
      createProductBaseCategory({
        variables: {
          input: { ...values, sellerId },
        },
      })
        .then(() => {
          messageSave("Category");
          router.push("/product-bases/categories", "/product-bases/categories");
        })
        .catch((err) => {
          notification.error({ message: get(err, "[0].message") });
        });
    } else {
      updateProductBaseCategory({
        variables: {
          id,
          input: { ...values },
        },
      })
        .then(() => {
          messageSave("Category");
          router.push("/product-bases/categories", "/product-bases/categories");
        })
        .catch((err) => {
          notification.error({ message: get(err, "[0].message") });
        });
    }
  };
  return (
    <div style={{ margin: "0px 24px" }}>
      <h3 style={{ marginLeft: 32 }}>
        {id ? categoryById.title : "New Category"}
      </h3>
      <Card>
        <Form {...layout} onFinish={(values) => onSaveCategory(values)}>
          <Form.Item
            label="Title"
            name="title"
            initialValue={categoryById?.title ?? ""}
            rules={[
              { required: true, message: "Please input category title!" },
            ]}
          >
            <Input placeholder="Enter category title" />
          </Form.Item>
          {/* <Form.Item
            label="Fulfillment services"
            name="fulfillmentId"
            initialValue={categoryById?.fulfillment?.id ?? null}
          >
            <Select showSearch placeholder="Custom fulfillment service title">
              {fulfillmentData?.fulfillments?.map((fulfillment) => (
                <Select.Option key={fulfillment.id} value={fulfillment.id}>
                  {fulfillment.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item
            label="Parent category"
            name="parentId"
            initialValue={categoryById?.parentId ?? null}
          >
            <TreeSelect
              allowClear
              showSearch
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={getTreeData(removeCurrentCate(categories, id))}
              placeholder="Select a parent category"
              treeDefaultExpandAll
            />
          </Form.Item>
          <Divider type="horizontal" />
          <div style={{ textAlign: "right" }}>
            <Button
              className="mr-15"
              onClick={() =>
                router.push(
                  "/product-bases/categories",
                  "/product-bases/categories"
                )
              }
            >
              Cancel
            </Button>
            <AuthElement name={permissions.ProductBaseCategoryUpdate}>
              <Button
                loading={createLoading || updateLoading}
                type="primary"
                htmlType="submit"
              >
                {id ? "Update" : "Create"} Category
              </Button>
            </AuthElement>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryForm;
