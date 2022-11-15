import gql from "graphql-tag";

export default gql`
  mutation($fileID: String!, $categoryID: String!, $sellerId: String) {
    importArtworkFromPSD(fileID: $fileID, categoryID: $categoryID, sellerId: $sellerId)
  }
`;
