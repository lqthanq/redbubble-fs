import gql from "graphql-tag";

export const CLIPART_CATEGORY_SUBCRIPTION = gql`
  fragment ClipartCategorySubField on ClipartCategory {
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
  fragment ClipartCategorySubRecursive on ClipartCategory {
    ...ClipartCategorySubField
    children {
      ...ClipartCategorySubField
      children {
        ...ClipartCategorySubField
        children {
          ...ClipartCategorySubField
          children {
            ...ClipartCategorySubField
            children {
              ...ClipartCategorySubField
              children {
                ...ClipartCategorySubField
                children {
                  ...ClipartCategorySubField
                  children {
                    ...ClipartCategorySubField
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  subscription($userId: String!) {
    clipartCategorySubscription(userId: $userId) {
      category {
        ...ClipartCategorySubRecursive
      }
      action
    }
  }
`;
