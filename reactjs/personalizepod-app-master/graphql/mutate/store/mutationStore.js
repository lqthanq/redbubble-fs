import gql from "graphql-tag";
export const CREATE_STORE = gql`
  mutation createStore(
    $title: String!
    $domain: String!
    $platform: String!
    $sellerId: String
  ) {
    createStore(
      title: $title
      domain: $domain
      platform: $platform
      sellerId: $sellerId
    )
  }
`;

export const UPDATE_WEBHOOK = gql`
  mutation updateStoreSettings($id: String!) {
    updateStoreSettings(id: $id)
  }
`;

export const DISCONNECT_STORE = gql`
  mutation disconnectStore($id: String!) {
    disconnectStore(id: $id)
  }
`;

export const RECONNECT_STORE = gql`
  mutation reconnectStore($id: String!) {
    reconnectStore(id: $id)
  }
`;

export const REMOVE_STORE = gql`
  mutation removeStore($id: String!) {
    removeStore(id: $id)
  }
`;
