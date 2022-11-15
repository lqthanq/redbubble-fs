import gql from "graphql-tag";

export default gql`
  mutation($id: String!) {
    deleteArtwork(id: $id)
  }
`;
