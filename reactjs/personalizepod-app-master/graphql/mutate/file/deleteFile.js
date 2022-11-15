import gql from "graphql-tag";

export const DELETE_FILE = gql`
  mutation deleteFile($id: String!) {
    deleteFile(id: $id)
  }
`;
