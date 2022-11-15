import gql from "graphql-tag";

export default gql`
  mutation($title: String!, $id: String!, $parentID: String) {
    updateArtworkCategory(title: $title, id: $id, parentID: $parentID) {
      id
      parentID
      title
      hasChild
    }
  }
`;
