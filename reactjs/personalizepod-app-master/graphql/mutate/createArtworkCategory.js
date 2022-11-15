import gql from "graphql-tag";

export default gql`
  mutation($title: String!, $parentID: String, $sellerId: String) {
    createArtworkCategory(
      title: $title
      parentID: $parentID
      sellerId: $sellerId
    ) {
      id
      parentID
      title
      hasChild
    }
  }
`;
