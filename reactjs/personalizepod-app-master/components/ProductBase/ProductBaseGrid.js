import { Button, Card, Tag, Tooltip } from "antd";
import React from "react";
import { BiDownload } from "react-icons/bi";
import moment from "moment";
import ProductBaseAction from "./ProductBaseAction";
import { useRouter } from "next/router";
import { useAppValue } from "context";
import Link from "next/link";
import styled from "styled-components";
import { FaUserEdit } from "react-icons/fa";
const Container = styled.div`
  .ant-card-cover {
    margin: 0;
  }
`;
const ProductBaseGrid = ({ el, baseImport, refetch }) => {
  const router = useRouter();
  const clearTypeName = (data) => {
    if (data && data.length) {
      return data.map((el) => _.omit(el, ["__typename"]));
    }
    return [];
  };
  const [{ baseVariants }, dispatch] = useAppValue();
  return (
    <Container className="card-item">
      <Card
        className="custom-action"
        cover={
          <img
            style={{
              width: "100%",
              height: 215,
              objectFit: "contain",
              background: "rgb(242 244 247)",
            }}
            alt="example"
            src={
              el?.image
                ? `${process.env.CDN_URL}/400x400/${el?.image?.key}`
                : `https://culturaltrust.org/wp-content/themes/oct/assets/img/no-img.png`
            }
          />
        }
      >
        <div className="base-detail">
          <div className="description">
            <Tooltip title={el.title}>
              <b>
                {baseImport ? (
                  el.title
                ) : (
                  <Link
                    as={`/product-bases/${el.id}`}
                    href={`/product-bases/[id]`}
                  >
                    {el.title}
                  </Link>
                )}
              </b>
            </Tooltip>
            {!baseImport ? <br /> : null}
            {!baseImport ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Tag>{el.fulfillment ? el.fulfillment.title : null}</Tag>
                {el.author ? (
                  <>
                    <FaUserEdit />
                    {el.author.firstName + " " + el.author.lastName}
                  </>
                ) : null}
              </div>
            ) : null}
            {/* <br /> */}
            {!baseImport ? (
              <div className="flex space-between">
                <div style={{ padding: "2px 0" }}>
                  {moment(el.createdAt).format("DD MMM YYYY")}
                </div>
                <div className="custom-action-show">
                  <ProductBaseAction action={el} refetch={refetch} />
                </div>
              </div>
            ) : null}
            {baseImport ? (
              <div
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tag>{el?.fulfillment?.fulfillmentTitle}</Tag>
                <Button
                  onClick={() => {
                    router.push(
                      "/product-bases/add-product-base",
                      "/product-bases/add-product-base"
                    );
                    dispatch({
                      type: "setProductBaseImport",
                      payload: {
                        productBaseImport: el,
                      },
                    });
                    dispatch({
                      type: "changeActiveVariant",
                      payload: {
                        baseVariants: el?.variants.map((variant) => {
                          return {
                            ...variant,
                            active: true,
                          };
                        }),
                      },
                    });
                  }}
                >
                  <BiDownload className="anticon" /> Import
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default ProductBaseGrid;
