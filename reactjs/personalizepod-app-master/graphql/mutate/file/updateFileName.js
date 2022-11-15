import gql from "graphql-tag";

export const UPDATE_FILE_NAME = gql`
  mutation updateFileName($id: String!, $fileName: String!) {
    updateFileName(id: $id, fileName: $fileName) {
      id
      key
      fileName
      fileMime
      fileSize
      url
      createdAt
    }
  }
`;
