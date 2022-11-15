import gql from "graphql-tag";

export const CREATE_FULFILLMENT = gql`
  mutation($input: FulfillmentInput!) {
    createFulfillment(input: $input) {
      id
      title
      description
      image {
        id
        key
      }
    }
  }
`;

export const UPDATE_FULFILLMENT = gql`
  mutation($input: UpdateFulfillmentInput!) {
    updateFulfillment(input: $input) {
      id
      title
      description
      image {
        id
        key
      }
    }
  }
`;

export const DELETE_FULFILLMENT = gql`
  mutation deleteFulfillment($id: ID!) {
    deleteFulfillment(id: $id)
  }
`;
