import { gql } from "@apollo/client";

export default gql`
  query($categoryID: String!) {
    cliparts: clipartsByCategory(categoryID: $categoryID) {
      id
      category {
        id
        title
      }
      file {
        id
        key
      }
    }
  }
`;
