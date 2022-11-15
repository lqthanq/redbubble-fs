import gql from "graphql-tag";
export default gql`
  mutation($family: String!, $file: FileInput!) {
    createFont(family: $family, file: $file) {
      id
      family
      variants {
        variant
        file {
          url
        }
      }
    }
  }
`;
