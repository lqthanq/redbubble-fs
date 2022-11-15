import { Card, Image } from "antd";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";
import { isAdmin } from "components/Utilities/isAdmin";
import moment from "moment";
import styled from "styled-components";
import CampaignAction from "./CampaignAction";
import PublishedInStoreView from "./PublishedInStoreView";
import StatusInStoreView from "./StatusInStoreView";
import Link from "next/link";

const Container = styled.div`
  .ant-card-body {
    padding: 10px !important;
  }
  .p-product-grid-status {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .base-detail {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .show-status {
    position: absolute;
    top: 10px;
  }
  .ant-card-bordered .ant-card-cover {
    margin: 0;
    height: 250px;
  }
`;

const ProductGrid = ({ product, refetch, campaign, filter }) => {
  return (
    <Container className="card-item" key={product?.id}>
      <Card
        className="custom-action"
        cover={
          <Image.PreviewGroup>
            {campaign?.products[0].mockups ? (
              campaign?.products[0].mockups.map((mockup, index) => (
                <Image
                  hidden={index !== 0}
                  key={index}
                  style={{
                    backgroundColor: "#f5f5f5",
                    objectFit: "cover",
                    height: 250,
                  }}
                  preview={{
                    src: `${process.env.CDN_URL}/autoxauto/${mockup.image}`,
                  }}
                  src={`${process.env.CDN_URL}/400x400/${mockup.image}`}
                  fallback={`/no-preview.jpg`}
                />
              ))
            ) : (
              <Image
                style={{
                  backgroundColor: "#f5f5f5",
                  objectFit: "cover",
                  height: 250,
                }}
                preview={{
                  src: `${process.env.CDN_URL}/autoxauto/`,
                }}
                src={`${process.env.CDN_URL}/200x200/`}
                fallback={`/no-preview.jpg`}
              />
            )}
          </Image.PreviewGroup>
        }
      >
        {filter.storeId ? (
          <div className="show-status">
            <StatusInStoreView storeId={filter.storeId} item={campaign} />
          </div>
        ) : null}
        <div className="base-detail">
          <b
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              lineHeight: "22px",
            }}
          >
            <Link href="/campaigns/[id]" as={`/campaigns/${campaign?.id}`}>
              {campaign?.title}
            </Link>
          </b>
        </div>
        <div className="flex">
          {moment(product?.createdAt).format("DD MMM YYYY")}{" "}
          <span>
            {isAdmin() ? (
              <CustomizeAvatarOwner
                size={32}
                src={`${process.env.CDN_URL}/300x300/${campaign.author?.avatar?.key}`}
                author={campaign.author}
                showAvatar={false}
              />
            ) : null}
          </span>
        </div>
        <div className="flex item-center space-between">
          {filter.storeId ? (
            <div />
          ) : (
            <PublishedInStoreView grid={true} item={campaign} />
          )}
          <CampaignAction record={campaign} refetch={refetch} />
        </div>
      </Card>
    </Container>
  );
};

export default ProductGrid;
