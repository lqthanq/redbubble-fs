import {
  Button,
  Collapse,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Tag,
  Tree,
  TreeSelect,
} from "antd";
import { forwardRef, useState } from "react";
import styled from "styled-components";
import { forEach } from "lodash";
import { useRouter } from "next/router";
import { PRODUCT_BASE_CATEGORIES } from "graphql/queries/productBase/category";
import { useQuery } from "@apollo/client";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { useAppValue } from "context";

const Container = styled.div`
  .ant-radio-group {
    display: grid;
  }
  .ant-select {
    width: 200px;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .clear-filter-item {
    margin-top: 10px;
    padding: 0;
  }
`;

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const { Option } = Select;

const ProductBaseFilter = ({ filter, setFilter, resetFilter }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState();
  const [{ sellerId }] = useAppValue();
  const { data, loading } = useQuery(FULFILLMENTS, {
    variables: { search: search, sellerId },
  });
  const [filterCat, setFilterCat] = useState({
    search: "",
    sellerId,
  });
  const { data: categoryBase } = useQuery(PRODUCT_BASE_CATEGORIES, {
    variables: { filter: { ...filterCat, sellerId } },
  });
  const listFulfillment = data?.fulfillments;

  const getTreeData = (treeData) => {
    if (!treeData) {
      return [];
    }
    return treeData.map((cat) => ({
      ...cat,
      key: cat.id,
      value: cat.id,
      title: cat.title,
      children: getTreeData(cat.children),
    }));
    // return treeData;
  };
  const hanleChange = (valuesChange, values) => {
    // forEach(values, (value, key) => {
    //   if (value && value.length !== 1 && value !== "all") {
    //     router.query[key] = value;
    //   } else {
    //     delete router.query[key];
    //   }
    // });
    // if (router?.query?.page) {
    //   router.query.page = 1;
    // }
    // router.push(router);
    forEach(values, (value, key) => {
      if (value && value.length !== 0 && value !== null) {
        router.query[key] = value;
      } else {
        delete router.query[key];
      }
      router.push(router);
    });
  };
  return [
    <Container>
      <Form
        form={form}
        onValuesChange={hanleChange}
        className="p-collapse-filter"
      >
        <Collapse
          onChange={(e) => {
            setSelected(e);
          }}
          expandIconPosition="right"
          bordered={false}
        >
          <Collapse.Panel
            header={
              <div>
                <div>Fulfillment</div>
                {selected?.filter((el) => ["0"].includes(el)).length === 0 &&
                router?.query?.fulfillmentId?.length ? (
                  <Tag>
                    {listFulfillment
                      ?.filter((el) =>
                        router?.query?.fulfillmentId?.includes(el.id)
                      )
                      .map((m) => m.title)
                      .join()}
                  </Tag>
                ) : null}
              </div>
            }
          >
            <Input.Search
              placeholder="Filter fulfillment"
              className="mb-10"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Form.Item
              initialValue={filter?.fulfillmentId ?? "all"}
              name="fulfillmentId"
            >
              <Radio.Group>
                {listFulfillment?.map((fulfill) => (
                  <Radio value={fulfill.id} key={fulfill.id}>
                    {fulfill.title}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              type="link"
              disabled={router?.query?.fulfillmentId ? false : true}
              onClick={() => {
                setFilter({
                  ...filter,
                  fulfillmentId: "",
                });
                delete router.query.fulfillmentId;
                router.push(router);
                form.setFieldsValue({
                  fulfillmentId: "",
                });
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <div>
                <div>Category</div>
                {selected?.filter((el) => ["1"].includes(el)).length === 0 &&
                router?.query?.categoryId?.length ? (
                  <Tag>
                    {categoryBase?.productBaseCategories?.hits
                      ?.filter((el) =>
                        router?.query?.categoryId?.includes(el.id)
                      )
                      .map((m) => m.title)
                      .join()}
                  </Tag>
                ) : null}
              </div>
            }
          >
            {/* <Input.Search
              placeholder="Filter category"
              className="mb-10"
              onChange={(e) => setSearch(e.target.value)}
            /> */}

            <Form.Item
              initialValue={filter?.categoryId ?? "all"}
              name="categoryId"
            >
              {/* <Radio.Group>
                {categoryBase?.productBaseCategories?.hits?.map((cate) => (
                  <Radio value={cate.id} key={cate.id}>
                    {cate.title}
                  </Radio>
                ))}
              </Radio.Group> */}
              <TreeSelect
                allowClear
                showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={getTreeData(
                  categoryBase?.productBaseCategories?.hits
                )}
                onSearch={(e) => setFilterCat({ search: e })}
                placeholder="Select a parent category"
                treeDefaultExpandAll
              />
            </Form.Item>
            <Button
              className="clear-filter-item"
              type="link"
              disabled={router?.query?.categoryId ? false : true}
              onClick={() => {
                setFilter({
                  ...filter,
                  categoryId: null,
                });
                delete router.query.categoryId;
                router.push(router);
                form.setFieldsValue({
                  categoryId: null,
                });
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
          <Collapse.Panel
            header="Sort By"
            header={
              <div>
                <div>Sort By</div>
                {selected?.filter((el) => ["2"].includes(el)).length === 0 &&
                router?.query?.sortBy ? (
                  <Tag>
                    {router?.query?.sortBy === "title"
                      ? "Alphabetical"
                      : router?.query?.sortBy === "updated_at"
                      ? "Last edited"
                      : "Date created"}
                  </Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item initialValue={filter?.sortBy} name="sortBy">
              <Radio.Group>
                <Radio style={radioStyle} value="created_at">
                  Date created
                </Radio>
                <Radio style={radioStyle} value="updated_at">
                  Last edited
                </Radio>
                <Radio style={radioStyle} value="title">
                  Alphabetical
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              disabled={router?.query?.sortBy ? false : true}
              type="link"
              onClick={() => {
                setFilter({
                  ...filter,
                  sortBy: "created_at",
                });
                delete router.query.sortBy;
                router.push(router);
                form.setFieldsValue({
                  sortBy: "created_at",
                });
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
          <Collapse.Panel
            header="Order"
            header={
              <div>
                <div>Order</div>
                {selected?.filter((el) => ["3"].includes(el)).length === 0 &&
                router?.query?.order ? (
                  <Tag>{router?.query?.order}</Tag>
                ) : null}
              </div>
            }
          >
            <Form.Item initialValue={filter?.order} name="order">
              <Radio.Group>
                <Radio style={radioStyle} value="DESC">
                  Descending
                </Radio>
                <Radio style={radioStyle} value="ASC">
                  Ascending
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              className="clear-filter-item"
              disabled={router?.query?.order ? false : true}
              type="link"
              onClick={() => {
                setFilter({
                  ...filter,
                  order: "DESC",
                });
                delete router.query.order;
                router.push(router);
                form.setFieldsValue({
                  order: "DESC",
                });
              }}
            >
              Clear
            </Button>
            <Divider />
          </Collapse.Panel>
        </Collapse>
      </Form>
    </Container>,
    { form },
  ];
};

export default ProductBaseFilter;
