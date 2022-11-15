import { gql } from "@apollo/client";

export const CLIPART_CATEGORY = gql`
  fragment ClipartCategoryFields on ClipartCategory {
    id
    title
    number: numberOfCliparts
    parentID
    children {
      id
      title
    }
    deletedAt
    displaySettings
    isFolder
  }
  fragment ClipartCategoryRecursive on ClipartCategory {
    ...ClipartCategoryFields
    children {
      ...ClipartCategoryFields
      children {
        ...ClipartCategoryFields
        children {
          ...ClipartCategoryFields
          children {
            ...ClipartCategoryFields
            children {
              ...ClipartCategoryFields
              children {
                ...ClipartCategoryFields
                children {
                  ...ClipartCategoryFields
                  children {
                    ...ClipartCategoryFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  query($parentID: String, $sellerId: String) {
    clipartCategories(parentID: $parentID, sellerId: $sellerId) {
      ...ClipartCategoryRecursive
    }
  }
`;
