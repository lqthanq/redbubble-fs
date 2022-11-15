import { Form, Input, notification, Radio, Select } from "antd";
import { CREATE_STORE } from "graphql/mutate/store/mutationStore";
import { useMutation, useQuery } from "@apollo/client";
import _, { debounce } from "lodash";
import { SELLERS } from "graphql/queries/users";
import { useState } from "react";
import { isAdmin } from "components/Utilities/isAdmin";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const SiteAdd = ({ setAutoFocus }) => {
  const [form] = Form.useForm();
  const [createStore, { loading }] = useMutation(CREATE_STORE);
  const [search, setSearch] = useState("");
  const { data } = useQuery(SELLERS, {
    variables: {
      filter: {
        search,
      },
    },
    skip: !isAdmin(),
  });
  const platforms = [
    {
      title: "Shopify",
      value: "shopify",
    },
  ];

  const onSubmit = (values) => {
    createStore({
      variables: {
        ...values,
      },
    })
      .then((res) => {
        window.location = res.data.createStore;
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  const handleSearch = (value) => setSearch(value);

  return [
    <div>
      <Form onFinish={onSubmit} form={form} id="site" {...layout}>
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input your store title!",
            },
          ]}
        >
          <Input
            autoFocus
            ref={(input) => setAutoFocus(input)}
            placeholder="Title"
          />
        </Form.Item>
        <Form.Item
          name="domain"
          label="Domain"
          rules={[
            {
              required: true,
              message: "Please enter domain!",
            },
            {
              type: "url",
              message:
                "Please enter a valid domain! HTTPS protocol is required! (e.g. https://niftyshop.com)",
            },
          ]}
        >
          <Input placeholder="https://" />
        </Form.Item>
        <Form.Item
          label="Platform"
          name="platform"
          rules={[
            {
              required: true,
              message: "Please select your platform!",
            },
          ]}
          initialValue="shopify"
        >
          <Radio.Group>
            {platforms.map((pf) => (
              <Radio key={pf.value} value={pf.value}>
                {pf.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          hidden={!isAdmin()}
          label="Manage by seller"
          name="sellerId"
          rules={[
            {
              required: isAdmin() ? true : false,
              message: "Please select seller!",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Search sellers..."
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onSearch={debounce(handleSearch, 300)}
          >
            {data?.sellers?.hits?.map((seller) => (
              <Select.Option key={seller.id} value={seller.id}>
                {seller.firstName + " " + seller.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>,
    { loading, form },
  ];
};

export default SiteAdd;
