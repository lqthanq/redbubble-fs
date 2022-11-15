import { gql } from "@apollo/client";

export default gql`
  query($permission: Permission!) {
    hasPermission(permission: $permission)
  }
`;
