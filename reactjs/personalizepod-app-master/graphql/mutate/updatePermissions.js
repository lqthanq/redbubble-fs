import gql from "graphql-tag";
export default gql`
  mutation($input: [RolePermissionInput!]) {
    updatePermissions(input: $input)
  }
`;
