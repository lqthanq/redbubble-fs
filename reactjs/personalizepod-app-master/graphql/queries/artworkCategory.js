import { gql } from "@apollo/client";
export default gql`
  query($ID: String) {
    artworkCategory(ID: $ID) {
      id
      parentID
      title
      hasChild
    }
  }
`;
