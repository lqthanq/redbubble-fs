import { gql } from "@apollo/client";

export const COLOR_MANAGEMENT = gql`
  query colors($filter: ColorFilter) {
    colors(filter: $filter) {
      count
      hits {
        id
        name
        code
        fulfillment {
          id
          title
          type
          slug
        }
        pattern {
          id
          key
          url
        }
        active
      }
    }
  }
`;
