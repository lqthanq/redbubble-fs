import { gql } from "@apollo/client";

export default gql`
  query {
    roles: userRoles
    permissions
    rolePermissions {
      role
      permission
      allow
    }
  }
`;
