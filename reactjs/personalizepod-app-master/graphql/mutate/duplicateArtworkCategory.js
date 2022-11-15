import gql from "graphql-tag";

export default gql`
  mutation($id: String!) {
    duplicateArtworkCategory(id: $id) {
      id
      parentID
      title
      hasChild
    }
  }
`;
