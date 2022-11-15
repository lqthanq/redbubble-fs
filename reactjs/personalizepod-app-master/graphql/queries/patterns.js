import { gql } from "@apollo/client";

export default gql`
  query {
    patterns {
      hits {
        id
        file {
          key
          url
        }
      }
    }
  }
`;
