import gql from "graphql-tag";
export default gql`
  mutation($file: FileInput!) {
    createPattern(file: $file) {
      id
      file {
        key
        url
      }
    }
  }
`;
