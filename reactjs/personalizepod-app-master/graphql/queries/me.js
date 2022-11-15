import { gql } from "@apollo/client";

export default gql`
  query {
    me {
      token
      expires_in
      user {
        id
        email
        firstName
        lastName
        roles
        permissions
        avatar {
          id
          key
        }
        screenOption
      }
    }
  }
`;
