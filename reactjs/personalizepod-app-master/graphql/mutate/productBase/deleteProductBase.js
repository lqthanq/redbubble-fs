import gql from "graphql-tag";
export const DELETE_PRODUCT_BASE = gql`
  mutation deleteProductBase($id: ID!) {
    deleteProductBase(id: $id)
  }
`;
