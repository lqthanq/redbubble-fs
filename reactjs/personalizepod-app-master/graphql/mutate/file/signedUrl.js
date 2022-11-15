import gql from "graphql-tag";
export default gql`
  mutation($filename: String!, $path: String) {
    createSignedUrl(filename: $filename, path: $path) {
      key
      url
    }
  }
`;