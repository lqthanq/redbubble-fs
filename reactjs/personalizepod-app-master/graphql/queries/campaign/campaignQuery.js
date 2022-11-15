import { gql } from "@apollo/client";

export const CAMPAIGNS = gql`
  query($filter: CampaignFilter) {
    campaigns(filter: $filter) {
      count
      hits {
        id
        title
        updatedAt
        author {
          id
          firstName
          lastName
          email
          avatar {
            id
            key
          }
        }
        products {
          mockups {
            id
            mockupId
            productId
            variantId
            image
          }
          id
          title
          excludeMockups
          createdAt
          mockups {
            id
            image
          }
        }
        campaignStores {
          id
          status
          storeId
          pushStatus
          campaignId
          pushedAt
          permaLink
        }
        status
      }
    }
  }
`;

export const CAMPAIGN_BY_ID = gql`
  query($id: String!) {
    campaign(id: $id) {
      id
      settings
      updatedAt
      products {
        id
        title
        description
        sku
        status
        excludeMockups
        mockups {
          id
          mockupId
          productId
          variantId
          image
        }
        productBases {
          id
          title
          fulfillment {
            id
            title
            slug
            type
            slug
          }
          image {
            id
            key
          }
          variants {
            id
            attributes {
              name
              slug
              value
            }
            cost
            regularPrice
            salePrice
            fulfillmentProductId
            active
          }
          printAreas {
            id
            name
            width
            height
            fileId
            file {
              id
              key
            }
          }
          attributes {
            name
            slug
            values
          }
        }
        collections {
          id
          title
        }
        tags
        hasVariant
        variants {
          id
          sku
          regularPrice
          productBaseId
          productBaseVariantId
          sorting
          salePrice
          active
        }
        printAreas {
          id
          productBaseId
          name
          productBasePrintAreaId
          artworkId
          artwork {
            id
            templates {
              title
              preview
              thumbnail
            }
          }
        }
        excludeMockups
        createdAt
      }
      campaignStores {
        id
        storeId
        campaignId
        status
        pushStatus
        pushedAt
        permaLink
      }
    }
  }
`;
export const CAMPAIGN_STORE_UPDATING_SUPSCRIPTION = gql`
  subscription {
    CampaignStoreUpdating {
      id
      storeId
      campaignId
      status
      pushStatus
      pushedAt
      permaLink
    }
  }
`;
