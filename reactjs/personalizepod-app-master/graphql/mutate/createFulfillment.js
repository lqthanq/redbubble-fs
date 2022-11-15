import gql from "graphql-tag";
export default gql`
  mutation($input: FulfillmentInput!) {
    createFulfillment(input: $input) {
      id
      title
      description
      image {
        id
        fileName
        fileMime
        fileSize
        url
      }
    }
  }
`;
