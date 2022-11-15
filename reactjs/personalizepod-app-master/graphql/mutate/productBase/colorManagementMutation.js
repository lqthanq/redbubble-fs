import gql from "graphql-tag";

export const ADD_COLOR = gql`
  mutation addColor($input: NewColor!) {
    addColor(input: $input) {
      id
      name
      code
      fulfillment {
        id
        description
        title
        type
        slug
      }
      pattern {
        id
        key
        url
      }
      active
    }
  }
`;

export const DELETE_COLOR = gql`
  mutation deleteColor($id: String!) {
    deleteColor(id: $id)
  }
`;

export const FETCH_COLORS = gql`
  mutation fetchColors {
    fetchColors
  }
`;

export const UPDATE_COLORS = gql`
  mutation updateColor($input: [UpdateColor!]!) {
    updateColor(input: $input)
  }
`;
