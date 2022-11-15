import { gql } from "@apollo/client";

export const FULFILLMENTS = gql`
  query fulfillments(
    $search: String
    $isReady: Boolean
    $type: FulfillmentServiceType
    $sellerId: String
  ) {
    fulfillments(
      search: $search
      isReady: $isReady
      type: $type
      sellerId: $sellerId
    ) {
      id
      title
      description
      slug
      type
      api
      secret
      image {
        id
        key
        fileName
        fileMime
        fileSize
        url
      }
    }
  }
`;

export const FULFILLMENT_BY_ID = gql`
  query FulfillmentById($id: ID!) {
    FulfillmentById(id: $id) {
      id
      title
      description
      image {
        id
        key
        fileName
        fileMime
        fileSize
        url
      }
    }
  }
`;
