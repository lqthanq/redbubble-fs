import gql from "graphql-tag";
export default gql`
  mutation($input: ProductBaseInput!) {
    createProductBase(input: $input) {
      id
      title
      sku
      description
      category {
        id
        title
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
          slug
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
      fulfillment {
        id
        title
        description
        type
        slug
      }
    }
  }
`;
