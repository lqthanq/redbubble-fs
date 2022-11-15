import gql from "graphql-tag";

export default gql`
  mutation($email: String!, $pass: String!) {
    login(email: $email, pass: $pass) {
      token
      expires_in
      user {
        id
        email
        firstName
        lastName
        roles
      }
    }
  }
`;
