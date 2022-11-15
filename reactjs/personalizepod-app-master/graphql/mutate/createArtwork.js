import gql from "graphql-tag";

export default gql`
  mutation($input: NewArtwork!) {
    artwork: createArtwork(input: $input) {
      id
      title
      lock
      categories {
        title
      }
    }
  }
`;
