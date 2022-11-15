import gql from "graphql-tag";
export default gql`
  mutation($id: ID!, $input: UpdateProductBaseInput!) {
    updateProductBase(id: $id, input: $input) {
      id
      title
      sku
      description
      productCatalog
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
      fulfillment {
        id
        title
        description
        type
        slug
      }
      printAreas {
        id
        name
        width
        height
        fileId
        file {
          id
          url
          key
        }
      }
      category {
        id
        title
      }
      image {
        id
        key
        url
      }
    }
  }
`;
