import gql from "graphql-tag";

export default gql`
  mutation(
    $email: String!
    $pass: String!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      email: $email
      pass: $pass
      lastName: $lastName
      firstName: $firstName
    ) {
      id
      firstName
      lastName
      email
      roles
    }
  }
`;
