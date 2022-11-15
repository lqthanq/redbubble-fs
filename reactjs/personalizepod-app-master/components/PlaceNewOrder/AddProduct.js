import { Divider, Form, Input, Table, Modal, Spin, Image } from "antd";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";
import EmptyData from "components/Utilities/EmptyData";
import Scrollbars from "react-custom-scrollbars";
import { cloneDeep, debounce, reduce } from "lodash";
import { useAppValue } from "context";

const Container = styled.div`
  .ant-table-tbody > tr > td {
    z-index: 0;
  }
`;

const AddProduct = ({
  products,
  loading,
  visible,
  setFilter,
  filter,
  setVisible,
}) => {
  const [_, dispatch] = useAppValue();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form] = Form.useForm();
  const changeFilter = (values) => {
    setFilter({
      ...filter,
      ...values,
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const columns = (product) => [
    {
      title: (
        <div>
          <div className="flex item-center">
            <Image.PreviewGroup>
              {product.mockups ? (
                product.mockups.map((mockup, index) => (
                  <Image
                    hidden={index !== 0}
                    key={index}
                    style={{ backgroundColor: "#f5f5f5", objectFit: "cover" }}
                    width="60px"
                    height="60px"
                    preview={{
                      src: `${process.env.CDN_URL}/autoxauto/${mockup.image}`,
                    }}
                    src={`${process.env.CDN_URL}/200x200/${mockup.image}`}
                    fallback={`/no-preview.jpg`}
                  />
                ))
              ) : (
                <Image
                  style={{ backgroundColor: "#f5f5f5", objectFit: "cover" }}
                  width="60px"
                  height="60px"
                  preview={{
                    src: `${process.env.CDN_URL}/autoxauto/`,
                  }}
                  src={`${process.env.CDN_URL}/200x200/`}
                  fallback={`/no-preview.jpg`}
                />
              )}
            </Image.PreviewGroup>
            <span className="ml-15">{product.title}</span>
          </div>
        </div>
      ),
      key: "variant",
      render: (record) =>
        record.productBaseVariant?.attributes
          ?.map((attribute) => attribute.value)
          .join(" / "),
    },
    {
      title: "",
      align: "right",
      key: "variant",
      render: (record) =>
        record.salePrice ? `$ ${record.salePrice}` : `$ ${record.regularPrice}`,
    },
  ];

  const rowSelection = (product) => {
    const findProductIndex = selectedProducts.findIndex(
      (item) => item.id === product.id
    );
    return {
      selectedRowKeys:
        findProductIndex !== -1
          ? selectedProducts[findProductIndex].variantIds
          : [],
      onChange: (selectedRowKeys) => {
        let newSelectedProducts = cloneDeep(selectedProducts);
        if (findProductIndex !== -1) {
          newSelectedProducts[findProductIndex].variantIds = selectedRowKeys;
        } else {
          let newProduct = cloneDeep(product);
          newProduct.variantIds = selectedRowKeys;
          newSelectedProducts.push(newProduct);
        }
        setSelectedProducts(newSelectedProducts);
      },
    };
  };

  const allVariantsSelected = reduce(
    selectedProducts,
    (variants, item) => {
      return variants.concat(item);
    },
    []
  );

  const handleSetVariantsSelected = (data) => {
    const variantsSelected = data.filter((item) => item.variantIds.length);
    dispatch({
      type: "setVariantsSelected",
      payload: {
        newOrder: { variantsSelected },
      },
    });
  };

  return (
    <Modal
      title="Choose a product"
      width={700}
      visible={visible}
      okText="Add Selected Products"
      okButtonProps={{
        disabled: !allVariantsSelected.length,
      }}
      onOk={() => {
        handleSetVariantsSelected(selectedProducts);
        setVisible(false);
      }}
      onCancel={() => {
        setVisible(false);
        handleSetVariantsSelected([]);
      }}
    >
      <Container>
        <div>
          <Form form={form} onValuesChange={debounce(changeFilter, 200)}>
            <Form.Item initialValue={filter.search} name="search">
              <Input
                placeholder="Search product to add"
                prefix={<BiSearch className="anticon custom-icon" />}
              />
            </Form.Item>
          </Form>
          <Divider
            style={{
              width: "-webkit-fill-available",
              minWidth: "-webkit-fill-available",
              margin: "24px -16px",
            }}
            type="horizontal"
          />
        </div>
        <Scrollbars autoHeight autoHeightMax={"calc(100vh - 400px)"}>
          <div>
            {loading ? (
              <div className="flex content-center">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                />
              </div>
            ) : !products?.length ? (
              <EmptyData />
            ) : (
              <div>
                {products.map((product) => {
                  const variantsActive = product.variants.filter(
                    (variant) => variant.active
                  );
                  return (
                    <Table
                      key={product.id}
                      style={{ border: "none" }}
                      dataSource={variantsActive ?? []}
                      pagination={false}
                      rowSelection={rowSelection(product)}
                      rowKey="id"
                      columns={columns(product)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </Scrollbars>
      </Container>
    </Modal>
  );
};

export default AddProduct;
