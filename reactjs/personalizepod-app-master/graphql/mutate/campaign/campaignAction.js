import gql from "graphql-tag";

export const CREATE_CAMPAIGN = gql`
  mutation createCampaign($input: CampaignInput!) {
    createCampaign(input: $input) {
      id
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
          image {
            id
            key
          }
          fulfillment {
            id
            title
            slug
            type
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
            productBasePrintAreaId: id
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

export const UPDATE_CAMPAIGN = gql`
  mutation updateCampaign($id: String!, $input: CampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
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
          image {
            id
            key
          }
          fulfillment {
            id
            title
            slug
            type
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

export const PUSH_CAMPAIGN = gql`
  mutation pushCampaign($id: String!, $storeIds: [ID!]) {
    pushCampaign(id: $id, storeIds: $storeIds)
  }
`;

export const DELETE_DRAFT_MOCKUP = gql`
  mutation deleteDraftMockup($productBaseID: String!) {
    deleteDraftMockup(productBaseID: $productBaseID)
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation deleteCampaign($id: String!) {
    deleteCampaign(id: $id)
  }
`;

export const CREATE_COLLECTION = gql`
  mutation createCollection($title: String!) {
    createCollection(title: $title) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const RETRY_PUSH_CAMPAIGN = gql`
  mutation retryPushCampaign($id: String!) {
    retryPushCampaign(id: $id)
  }
`;

export const DUPLICATE_CAMPAIGN = gql`
  mutation duplicateCampaign($id: String!) {
    duplicateCampaign(id: $id) {
      id
      title
      products {
        id
        title
      }
    }
  }
`;
