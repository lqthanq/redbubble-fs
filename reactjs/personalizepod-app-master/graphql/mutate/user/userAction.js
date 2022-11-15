import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation($input: CreateUser!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      email
      avatar {
        id
        key
        fileName
        fileSize
        fileMime
        url
      }
      roles
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($id: String!, $input: UpdateUser) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      avatar {
        id
        key
        fileName
        fileSize
        fileMime
        url
      }
      roles
    }
  }
`;

export const DELETE_USER = gql`
  mutation($id: String!) {
    deleteUser(id: $id)
  }
`;

export const VERIFY_USER = gql`
  mutation($oneTimeToken: String!) {
    verifyUser(oneTimeToken: $oneTimeToken)
  }
`;

export const BLOCK_USER = gql`
  mutation($id: String!, $block: Boolean!) {
    blockUser(id: $id, block: $block)
  }
`;
