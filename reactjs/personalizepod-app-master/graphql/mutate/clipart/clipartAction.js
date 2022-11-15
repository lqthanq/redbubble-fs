import gql from "graphql-tag";

export const DELETE_CLIPART = gql`
  mutation deleteClipart($id: String!) {
    deleteClipart(id: $id)
  }
`;

export const UPDATE_CLIPART_TITLE = gql`
  mutation($id: String!, $title: String!) {
    updateClipartTitle(id: $id, title: $title) {
      id
      title
      createdAt
    }
  }
`;

export const UPDATE_CLIPART_COLOR = gql`
  mutation($id: String!, $color: String) {
    updateClipartColor(id: $id, color: $color) {
      id
      title
      color
      createdAt
    }
  }
`;

export const UPDATE_CLIPART_ORDERS = gql`
  mutation($input: [ClipartOrder!]!) {
    updateClipartOrders(input: $input) {
      id
      title
      order
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation updateClipartCategoryDisplaySettings(
    $id: String!
    $data: ClipartCategorySettings!
  ) {
    updateClipartCategoryDisplaySettings(id: $id, data: $data) {
      id
      title
    }
  }
`;
