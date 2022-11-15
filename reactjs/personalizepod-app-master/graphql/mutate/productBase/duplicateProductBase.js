import gql from "graphql-tag";
export const DUPLICATE_PRODUCT_BASE = gql`
  mutation duplicateProductBase($id: String!) {
    duplicateProductBase(id: $id) {
      id
      title
      sku
      description
      category {
        id
        title
        hasChild
        parentId
      }
      createdAt
      fulfillment {
        id
        title
        description
        image {
          id
          key
          url
        }
        type
        slug
      }
      attributes {
        name
        slug
        values
      }
      variants {
        id
        attributes {
          name
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
        file {
          id
          key
          url
        }
        fileId
      }
    }
  }
`;
