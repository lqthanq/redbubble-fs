import gql from "graphql-tag";

export const PLAN_MUTATION = gql`
  mutation($input: [NewPlan!]) {
    createOrUpdatePlan(input: $input)
  }
`;
