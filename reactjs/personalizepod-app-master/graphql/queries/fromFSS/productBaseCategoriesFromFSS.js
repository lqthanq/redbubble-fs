import { gql } from "@apollo/client";

export const PRODUCT_BASE_CATEGORIES_FROM_FSS = gql`
  fragment categoryBaseFromFSS on FSSCategory {
    id
    description
    title: name
    hasChild
    parentID
    image {
      key
      url
    }
  }
  query productBaseCategoriesFromFSS($fulfillmentSlug: [String!]) {
    productBaseCategoriesFromFSS(fulfillmentSlug: $fulfillmentSlug) {
      count
      hits {
        ...categoryBaseFromFSS
        children {
          ...categoryBaseFromFSS
          children {
            ...categoryBaseFromFSS
            children {
              ...categoryBaseFromFSS
              children {
                ...categoryBaseFromFSS
                children {
                  ...categoryBaseFromFSS
                  children {
                    ...categoryBaseFromFSS
                    children {
                      ...categoryBaseFromFSS
                      children {
                        ...categoryBaseFromFSS
                        children {
                          ...categoryBaseFromFSS
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
