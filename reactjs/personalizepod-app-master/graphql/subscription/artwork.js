import gql from "graphql-tag";

export const ARTWORK_CATEGORY_SUBCRIPTION = gql`
  fragment ArtworkCategorySubField on ArtworkCategory {
    id
    title
    number: numberOfArtworks
    parentID
    children {
      id
      title
    }
    deletedAt
  }
  fragment ArtworkCategorySubRecursive on ArtworkCategory {
    ...ArtworkCategorySubField
    children {
      ...ArtworkCategorySubField
      children {
        ...ArtworkCategorySubField
        children {
          ...ArtworkCategorySubField
          children {
            ...ArtworkCategorySubField
            children {
              ...ArtworkCategorySubField
              children {
                ...ArtworkCategorySubField
                children {
                  ...ArtworkCategorySubField
                  children {
                    ...ArtworkCategorySubField
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
    artworkCategorySubscription(userId: $userId) {
      action
      category {
        ...ArtworkCategorySubRecursive
      }
    }
  }
`;
