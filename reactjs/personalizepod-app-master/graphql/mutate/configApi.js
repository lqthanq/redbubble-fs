import gql from "graphql-tag";

export default gql`
  mutation configApi($id: ID!, $apiKey: String, $apiSecret: String) {
    configApi(id: $id, apiKey: $apiKey, apiSecret: $apiSecret)
  }
`;
