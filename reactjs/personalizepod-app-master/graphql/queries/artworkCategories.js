import { gql } from "@apollo/client";

export const ARTWORK_CATEGORY = gql`
  fragment ArtworkCategoryFields on ArtworkCategory {
    id
    key: id
    title
    number: numberOfArtworks
    parentID
    children {
      id
      title
    }
    deletedAt
  }
  fragment ArtworkCategoryRecursive on ArtworkCategory {
    ...ArtworkCategoryFields
    children {
      ...ArtworkCategoryFields
      children {
        ...ArtworkCategoryFields
        children {
          ...ArtworkCategoryFields
          children {
            ...ArtworkCategoryFields
            children {
              ...ArtworkCategoryFields
              children {
                ...ArtworkCategoryFields
                children {
                  ...ArtworkCategoryFields
                  children {
                    ...ArtworkCategoryFields
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
    artworkCategories(parentID: $parentID, sellerId: $sellerId) {
      ...ArtworkCategoryRecursive
    }
  }
`;
