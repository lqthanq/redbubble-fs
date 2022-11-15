import { gql } from "@apollo/client";

export default gql`
  query($parentID: String, $sellerId: String) {
    categories: clipartCategories(parentID: $parentID, sellerId: $sellerId) {
      numberOfCliparts
      hits {
        id
        key: id
        parentID
        title
        numberOfCliparts
        displaySettings
      }
    }
  }
`;
