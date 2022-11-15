import { gql } from "@apollo/client";
export default gql`
  mutation($input: UserProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      firstName
      lastName
      roles
      avatar {
        id
        key
      }
    }
  }
`;
