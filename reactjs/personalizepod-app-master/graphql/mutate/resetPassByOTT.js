import gql from "graphql-tag";

export default gql`
  mutation($oneTimeToken: String!, $pass: String!) {
    resetPassByOTT(oneTimeToken: $oneTimeToken, pass: $pass)
  }
`;
