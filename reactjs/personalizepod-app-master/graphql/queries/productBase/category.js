import { gql } from "@apollo/client";

export const PRODUCT_BASE_CATEGORIES = gql`
  fragment categoryBase on ProductBaseCategory {
    id
    title
    fulfillment {
      id
      title
      description
      type
      slug
    }
    parentId
    hasChild
    createdAt
  }
  query productBaseCategories($filter: ProductBaseCategoriesFilter) {
    productBaseCategories(filter: $filter) {
      count
      hits {
        ...categoryBase
        children {
          ...categoryBase
          children {
            ...categoryBase
            children {
              ...categoryBase
              children {
                ...categoryBase
                children {
                  ...categoryBase
                  children {
                    ...categoryBase
                    children {
                      ...categoryBase
                      children {
                        ...categoryBase
                        children {
                          ...categoryBase
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

export const PRODUCT_BASE_CATEGORY_BY_ID = gql`
  fragment categoryInBase on ProductBaseCategory {
    id
    title
    fulfillment {
      id
      title
      description
      type
    }
    parentId
    hasChild
    createdAt
    children {
      id
      title
    }
  }
  query productBaseCategoryByID($id: String!) {
    productBaseCategoryByID(id: $id) {
      ...categoryInBase
      children {
        ...categoryInBase
        children {
          ...categoryInBase
          children {
            ...categoryInBase
            children {
              ...categoryInBase
              children {
                ...categoryInBase
                children {
                  ...categoryInBase
                  children {
                    ...categoryInBase
                    children {
                      ...categoryInBase
                      children {
                        ...categoryInBase
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
