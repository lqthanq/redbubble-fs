import { gql } from "@apollo/client";

export const PRODUCT_COLLECTION = gql`
  query productCollections($search: String) {
    productCollections(search: $search) {
      id
      title
    }
  }
`;

export const PRODUCTS = gql`
  query($filter: ProductFilter) {
    products(filter: $filter) {
      count
      hits {
        id
        title
        sku
        status
        productBases {
          id
          title
        }
        mockups {
          id
          variantId
        }
        variants {
          id
          sku
          regularPrice
          productBaseId
          productBase {
            id
            title
          }
          productBaseVariant {
            id
            attributes {
              name
              slug
              value
            }
          }
          salePrice
          active
        }
        createdAt
        updatedAt
      }
    }
  }
`;
