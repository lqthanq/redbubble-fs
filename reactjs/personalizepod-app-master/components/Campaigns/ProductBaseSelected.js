import { CAMPAIGN } from "actions";
import { Button, Card, Divider, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import Scrollbars from "components/Utilities/Scrollbars";
import { useAppValue } from "context";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";

const Container = styled.div`
  background: #f4f6f8;
  .ant-card-cover img {
    border-radius: 4px 0 0 4px;
  }
  h3 {
    line-height: 21px;
    margin-bottom: 0;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .productbases-selected {
    .ant-card {
      display: grid;
      grid-template-columns: 100px calc(100% - 100px);
    }
    .ant-card-cover {
      width: 100px;
    }
    .ant-card-body {
      width: 100%;
    }
  }
  .ant-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .ant-card-bordered .ant-card-cover {
    margin: 0;
    transform: inherit;
  }
`;

const ProductBaseSelected = () => {
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases } = campaign;
  return (
    <Container>
      <h3 className="p-15">
        {productBases?.length}
        {productBases?.length === 1
          ? " Product base is"
          : " Product bases are"}{" "}
        chosen
      </h3>
      <Divider type="horizontal" />
      <div className="productbases-selected mt-15 ml-15">
        <Scrollbars style={{ width: "auto", height: "calc(100vh - 130px)" }}>
          {productBases?.map((base) => (
            <div key={base.id} className="mb-15 mr-15">
              <Card
                cover={
                  <img
                    style={{
                      height: 100,
                      width: "100px !important",
                      objectFit: "contain",
                      borderRight: "1px solid #e6e6e6",
                    }}
                    alt="example"
                    src={
                      base.image
                        ? `${process.env.CDN_URL}/300x300/${base.image.key}`
                        : "/no-preview.jpg"
                    }
                  />
                }
              >
                <Meta
                  title={<Tooltip title={base.title}>{base.title}</Tooltip>}
                />
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const baseExited = productBases.filter(
                      (baseAdded) => baseAdded.id !== base.id
                    );
                    dispatch({
                      type: CAMPAIGN.SET,
                      payload: {
                        campaign: {
                          ...campaign,
                          productBases: baseExited,
                        },
                      },
                    });
                  }}
                  icon={
                    <Tooltip title="Remove">
                      <AiOutlineClose
                        style={{
                          color: "var(--error-color)",
                        }}
                        className="custom-icon anticon"
                      />
                    </Tooltip>
                  }
                />
              </Card>
            </div>
          ))}
        </Scrollbars>
      </div>
      <Divider type="horizontal" />
    </Container>
  );
};

export default ProductBaseSelected;
