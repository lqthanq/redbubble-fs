import gql from "graphql-tag";

export default gql`
  mutation($id: String!) {
    deleteArtworkCategory(id: $id)
  }
`;
