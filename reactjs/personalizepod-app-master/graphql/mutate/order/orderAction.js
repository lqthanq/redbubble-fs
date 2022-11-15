import gql from "graphql-tag";

export const CANCEL_ORDER = gql`
  mutation($id: String!) {
    cancelOrder(id: $id)
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation($id: String!, $status: String!) {
    updateOrderStatus(id: $id, status: $status)
  }
`;

export const UPDATE_ORDER = gql`
  mutation($id: String!, $input: OrderUpdateInput!) {
    updateOrder(id: $id, input: $input)
  }
`;

export const FETCH_ORDER = gql`
  mutation($storeId: String!, $orderId: String!) {
    fetchOrder(storeId: $storeId, orderId: $orderId)
  }
`;

export const ADD_TRACKING = gql`
  mutation($orderId: ID!, $data: [TrackingInput!]) {
    addTracking(orderId: $orderId, data: $data)
  }
`;

export const UPLOAD_DESIGN = gql`
  mutation($orderId: String!, $input: [OrderDesignInput!]!) {
    uploadDesign(orderId: $orderId, input: $input)
  }
`;

export const ACCEPT_DESIGN = gql`
  mutation($orderId: String!, $accept: Boolean!) {
    acceptDesign(orderId: $orderId, accept: $accept)
  }
`;
export const UPDATE_TRACKING_STATUS = gql`
  mutation($id: ID!, $status: String!) {
    updateTrackingStatus(id: $id, status: $status)
  }
`;
export const SAVE_SCREEN_OPTION = gql`
  mutation($options: [String]) {
    saveScreenOption(options: $options)
  }
`;
export const EXPORT_ORDERS = gql`
  mutation exportOrders($input: ExportOrderInput!) {
    exportOrders(input: $input)
  }
`;
export const RE_TRACKING = gql`
  mutation reTracking($trackingCode: String!) {
    reTracking(trackingCode: $trackingCode)
  }
`;
export const RE_SUBMIT = gql`
  mutation reSubmitOrder($originID: String!) {
    reSubmitOrder(originID: $originID)
  }
`;
export const REGENDER_PRINTFILE = gql`
  mutation reGeneratePrintFile($orderId: String!, $designID: String) {
    reGeneratePrintFile(orderId: $orderId, designID: $designID)
  }
`;
