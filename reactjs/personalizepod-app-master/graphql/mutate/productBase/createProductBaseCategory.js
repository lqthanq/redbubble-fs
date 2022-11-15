import gql from "graphql-tag";

export const CREATE_PRODUCT_BASE_CATEGORY = gql`
  fragment category on ProductBaseCategory {
    id
    title
    hasChild
    createdAt
    parentId
    fulfillment {
      id
      title
      description
      type
      slug
    }
  }
  mutation($input: ProductBaseCategoryInput!) {
    createProductBaseCategory(input: $input) {
      ...category
      children {
        ...category
        children {
          ...category
          children {
            ...category
            children {
              ...category
              children {
                ...category
                children {
                  ...category
                  children {
                    ...category
                    children {
                      ...category
                      children {
                        ...category
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

export const UPDATE_PRODUCT_BASE_CATEGORY = gql`
  fragment categoryField on ProductBaseCategory {
    id
    title
    hasChild
    createdAt
    parentId
    fulfillment {
      id
      title
      description
      type
    }
  }
  mutation($id: String!, $input: ProductBaseCategoryInput!) {
    updateProductBaseCategory(id: $id, input: $input) {
      ...categoryField
      children {
        ...categoryField
        children {
          ...categoryField
          children {
            ...categoryField
            children {
              ...categoryField
              children {
                ...categoryField
                children {
                  ...categoryField
                  children {
                    ...categoryField
                    children {
                      ...categoryField
                      children {
                        ...categoryField
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

export const DELETE_PRODUCT_BASE_CATEGORY = gql`
  mutation deleteProductBaseCategory($id: String!) {
    deleteProductBaseCategory(id: $id)
  }
`;
