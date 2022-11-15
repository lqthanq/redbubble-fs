import { gql } from "@apollo/client";

export default gql`
  query stores($filter: StoreFilter) {
    stores(filter: $filter) {
      count
      hits {
        id
        title
        platform
        status
        domain
        team_id
        author {
          id
          firstName
          lastName
          email
          avatar {
            id
            key
          }
        }
        numberOfOrders
        numberOfCampaigns
      }
    }
  }
`;
