import gql from "graphql-tag";

export const PRICING_PLANS = gql`
  query {
    plans {
      id
      createdAt
      planName
      badge
      pricing
      billingCycle
      features {
        label
        key
        prefix
        value
        suffix
        fieldType
      }
      buttonText
      sorting
    }
  }
`;
