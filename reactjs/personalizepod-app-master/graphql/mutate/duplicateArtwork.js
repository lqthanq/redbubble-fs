import gql from "graphql-tag";

export default gql`
  mutation($id: String!) {
    duplicateArtwork(id: $id) {
      id
      title
      categories {
        id
        title
      }
      width
      height
      templates {
        title
        isDefault
        layers
      }
      author {
        id
        firstName
        lastName
      }
    }
  }
`;
