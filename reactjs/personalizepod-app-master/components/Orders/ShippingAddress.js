import { Button, Form, Input, notification } from "antd";
import { UPDATE_ORDER } from "graphql/mutate/order/orderAction";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { BiEditAlt } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { permissions } from "components/Utilities/Permissions";
import AuthElement from "components/User/AuthElement";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const ShippingAddress = ({ edit, setEdit, order, detail, refetch }) => {
  const [form] = Form.useForm();
  const [updateShipping, { loading: mutationLoading }] = useMutation(
    UPDATE_ORDER
  );
  console.log("order?.shipping", order);
  const [shippings, setShippings] = useState();

  useEffect(() => {
    if (order) {
      setShippings(order?.shipping);
    }
  }, [order]);

  const shippingInfo = [
    {
      value: "firstName",
      name: "First name",
      required: true,
    },
    {
      value: "lastName",
      name: "Last name",
      required: true,
    },
    {
      value: "address1",
      name: "Address 1",
      required: true,
    },
    {
      value: "address2",
      name: "Address 2",
    },
    {
      value: "company",
      name: "Company",
    },
    {
      value: "city",
      name: "City",
      required: true,
    },
    {
      value: "state",
      name: "State",
    },
    {
      value: "postalCode",
      name: "Zip code",
      required: true,
    },
    {
      value: "country",
      name: "Country",
      required: true,
    },
    {
      value: "phone",
      name: "Phone",
    },
  ];

  const handleSaveUpdate = (values) => {
    updateShipping({
      variables: {
        id: order.id,
        input: {
          shipping: { ...values },
        },
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: "The shipping address updated successfully!",
        });
        setShippings({ ...shippings, ...values });
        setEdit(false);
        form.resetFields();
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  return (
    <div>
      <div className="flex space-between">
        <h3>SHIPPING ADDRESS</h3>
        <AuthElement name={permissions.OrderUpdate}>
          <Button
            onClick={() => {
              setEdit(!edit);
              form.resetFields();
            }}
            type="link"
            icon={
              edit ? (
                <GrClose className="custom-icon anticon" />
              ) : (
                <BiEditAlt className="custom-icon anticon" />
              )
            }
          />
        </AuthElement>
      </div>
      {console.log(shippings)}
      {edit ? (
        <Form form={form} {...layout} onFinish={handleSaveUpdate}>
          {shippingInfo.map((item) => (
            <Form.Item
              key={item.value}
              initialValue={shippings ? shippings[item.value] : ""}
              name={item.value}
              label={item.name}
              rules={[
                {
                  required: item.required,
                  message: `${item.name} can't be blank.`,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ))}
          <div className="align-right mt-15">
            <Button
              disabled={mutationLoading}
              onClick={() => {
                setEdit(false);
                form.resetFields();
              }}
              className="mr-15"
            >
              Cancel
            </Button>
            <Button loading={mutationLoading} htmlType="submit" type="primary">
              Save Changes
            </Button>
          </div>
        </Form>
      ) : (
        shippingInfo.map((item) => (
          <div key={item.value}>
            <p>
              <strong> {item.name}: </strong>
              &nbsp;
              {shippings ? shippings[item.value] : null}
            </p>
          </div>
        ))
      )}
      <div hidden={!detail} style={{ marginTop: 20 }}>
        <h3>BILLING ADDRESS</h3>
        <p>Same as shipping address</p>
      </div>
    </div>
  );
};

export default ShippingAddress;
