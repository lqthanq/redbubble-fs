import gql from "graphql-tag";

export default gql`
  mutation($id: String!, $input: UpdateArtwork) {
    updateArtwork(id: $id, input: $input) {
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
        preview
        layers
      }
    }
  }
`;
