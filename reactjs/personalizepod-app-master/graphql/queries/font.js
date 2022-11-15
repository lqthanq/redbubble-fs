import { gql } from "@apollo/client";

export default gql`
  query($id: String!) {
    font(id: $id) {
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
