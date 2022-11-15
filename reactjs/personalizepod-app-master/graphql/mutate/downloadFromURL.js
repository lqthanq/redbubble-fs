import gql from "graphql-tag";

export default gql`
  mutation($url: String!) {
    downloadFromURL(url: $url) {
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
