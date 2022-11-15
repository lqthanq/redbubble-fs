import { useQuery } from "@apollo/client";
import { Button, Card, Col, Divider, Form, Image, Input, Row, Tag } from "antd";
import { useAppValue } from "context";
import { PRODUCTS } from "graphql/queries/product/products";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import styled from "styled-components";
import ShippingAddress from "../Orders/ShippingAddress";
import AddProduct from "./AddProduct";

const Container = styled.div`
  padding: 0 26px;
`;

const PlaceNewOrderStep1 = () => {
  const [{ newOrder }, dispatch] = useAppValue();
  const { variantsSelected } = newOrder;
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    pageSize: 20,
  });
  const [visible, setVisible] = useState(false);

  const { data, loading } = useQuery(PRODUCTS, {
    variables: {
      filter,
    },
  });
  const products = data?.products?.hits;

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const changeFilter = (values) => {
    setFilter({
      ...filter,
      ...values,
    });
    setVisible(true);
  };

  return (
    <Container>
      <div className="flex space-between item-center mb-15">
        <div className="flex item-center">
          <span style={{ fontSize: 16, marginRight: 15 }}>New Order</span>
          <Tag className="mb-10" className="error">
            Draff
          </Tag>
        </div>
        <div>
          <Button type="primary">Submit Order</Button>
        </div>
      </div>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Choose a product">
            <div className="flex item-center">
              <Form
                form={form}
                style={{ width: "100%" }}
                onValuesChange={changeFilter}
              >
                <Form.Item
                  style={{ marginBottom: 0 }}
                  initialValue={filter.search}
                  name="search"
                >
                  <Input
                    placeholder="Search product to add"
                    prefix={<BiSearch className="anticon custom-icon" />}
                  />
                </Form.Item>
              </Form>
              <Button className="ml-15" onClick={() => setVisible(true)}>
                Browse
              </Button>
            </div>
            <Divider type="horizontal" />
            {variantsSelected.map((product) => {
              return product.variantIds.map((variantId) => {
                const matchVariant = product.variants.find(
                  (variant) => variant.id === variantId
                );
                const fileMockup = product?.mockups?.find(
                  (el) => el.variantId === matchVariant.id
                );
                return (
                  <div className="mt-15">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "160px auto",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          backgroundColor: "#f5f5f5",
                          objectFit: "contain",
                        }}
                        width="150px"
                        height="150px"
                        preview={{
                          src: `${
                            process.env.CDN_URL
                          }/autoxauto/${product?.mockups
                            ?.filter((el) => el.variantId === matchVariant.id)
                            .map((e) => e.image)}`,
                        }}
                        src={`${
                          process.env.CDN_URL
                        }/300x300/${product?.mockups
                          ?.filter((el) => el.variantId === matchVariant.id)
                          .map((e) => e.image)}`}
                        fallback={`/images/default-img.png`}
                      />
                      <div>
                        <h3>{product.title}</h3>
                        <span>{matchVariant.productBase?.title}</span>
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ShippingAddress edit={edit} setEdit={setEdit} />
          </Card>
        </Col>
      </Row>
      <AddProduct
        products={products}
        loading={loading}
        filter={filter}
        visible={visible}
        setFilter={setFilter}
        setVisible={setVisible}
      />
    </Container>
  );
};

export default PlaceNewOrderStep1;
