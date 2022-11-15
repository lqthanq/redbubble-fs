import { gql } from "@apollo/client";

export default gql`
  query($filter: ProductBaseFilter) {
    productBases(filter: $filter) {
      count
      hits {
        id
        title
        sku
        description
        image {
          id
          key
          url
          fileName
          fileMime
          fileSize
        }
        category {
          id
          title
          hasChild
          parentId
        }
        createdAt
        fulfillment {
          id
          title
          description
          image {
            id
            key
            url
          }
          type
          slug
          author {
            id
            firstName
            lastName
          }
        }
        attributes {
          name
          slug
          values
        }
        variants {
          id
          attributes {
            name
            slug
            value
            slug
          }
          cost
          regularPrice
          salePrice
          fulfillmentProductId
          active
        }
        printAreas {
          id
          productBasePrintAreaId: id
          name
          width
          height
          file {
            id
            key
            url
          }
          fileId
        }
        isUsed
        author {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
