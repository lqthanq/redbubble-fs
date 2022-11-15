import { gql } from "@apollo/client";

export default gql`
  query productBasesFromFSS($filter: BasesFilter) {
    productBasesFromFSS(filter: $filter) {
      count
      hits {
        id
        title
        sku
        description: defaultContent
        fulfillment {
          fulfillmentId
          fulfillmentTitle
          productId
          productTitle
        }
        image {
          url
          key
        }
        attributes {
          name
          values: options
          slug
        }
        variants {
          id
          attributes {
            name
            value: option
            slug
          }
          cost: sellerPrice
          regularPrice
          salePrice
          fulfillmentProductId
        }
        printAreas: designPositions {
          id
          name
          image {
            key
            url
          }
          width
          height
        }
        fulfillmentSlug
      }
    }
  }
`;
