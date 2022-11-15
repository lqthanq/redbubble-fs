import gql from "graphql-tag";
export default gql`
  mutation($file: FileInput!) {
    createPhoto(file: $file) {
      id
      file {
        id
        key
        url
      }
    }
  }
`;
