import gql from "graphql-tag";
export default gql`
  mutation($input: FileInput!) {
    createFile(input: $input) {
      id
      key
      fileName
      fileSize
      fileMime
      url
    }
  }
`;