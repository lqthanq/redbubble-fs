import { gql } from "@apollo/client";

export const SELLERS = gql`
  query sellers($filter: SellerFilter) {
    sellers(filter: $filter) {
      count
      hits {
        id
        verified
        firstName
        lastName
        email
        status
        roles
        avatar {
          id
          key
          fileName
          fileSize
          fileMime
          url
        }
        numberOfStores
        numberOfCliparts
        numberOfArtworks
        numberOfCampaigns
        numberOfOrders
      }
    }
  }
`;
