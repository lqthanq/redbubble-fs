import gql from "graphql-tag";

export default gql`
  subscription($token: String!) {
    artwork: artworkImportPSD(token: $token) {
      id
    }
  }
`;
