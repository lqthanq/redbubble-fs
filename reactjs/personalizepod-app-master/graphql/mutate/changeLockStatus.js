import gql from "graphql-tag";

export default gql`
  mutation($id: String!, $status: Boolean!) {
    changeLockStatus(id: $id, status: $status)
  }
`;
