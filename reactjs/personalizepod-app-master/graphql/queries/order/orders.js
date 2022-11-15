import { gql } from "@apollo/client";

export const ORDER_BY_ID = gql`
  query order($id: String!) {
    order(id: $id) {
      id
      originId
      createdAt
      updatedAt
      shipping {
        id
        firstName
        lastName
        company
        phone
        address1
        address2
        city
        country
        state
        postalCode
      }
      tracking {
        id
        code
        comment
        newCode
        status
      }
      quantity
      price
      status
      baseCost
      product {
        id
        title
        sku
        mockups {
          id
          variantId
          image
        }
        variants {
          id
          active
          regularPrice
          salePrice
          productBaseId
          productBaseVariant {
            id
            attributes {
              name
              value
              slug
            }
          }
        }
        productBases {
          id
          title
          fulfillment {
            id
            title
            slug
            type
            slug
          }
          attributes {
            slug
            name
            values
          }
        }
      }
      productVariant {
        id
        sku
        productBaseId
        productBaseVariantId
        productBase {
          id
          title
          sku
          printAreas {
            id
            name
          }
        }
        productBaseVariant {
          id
          attributes {
            slug
            name
            value
          }
          cost
          productBaseId
          regularPrice
          salePrice
          active
        }
        regularPrice
        salePrice
      }
      orderTimeline {
        id
        createdAt
        title
        type
        user {
          id
          firstName
          lastName
        }
      }
      designs {
        id
        basePrintAreaID
        basePrintAreaName
        status
        file {
          id
          key
          url
        }
      }
      personalizedData {
        printArea
        personalized
        artwork {
          id
          templates {
            layers
          }
        }
      }
    }
  }
`;

export const ORDERS = gql`
  query orders($filter: OrderFilter) {
    orders(filter: $filter) {
      aggs
      count
      hits {
        id
        originId
        customer {
          id
        }
        reason
        store {
          id
          title
          domain
          status
          platform
        }
        billing {
          id
          lastName
          firstName
        }
        shipping {
          id
          country
          postalCode
          company
        }
        quantity
        price
        status
        baseCost
        fulfillment {
          id
          type
          title
          type
        }
        tracking {
          id
          code
          comment
          newCode
          status
        }
        productVariant {
          id
          productBase {
            id
            title
            fulfillment {
              id
              title
              slug
              type
            }
            printAreas {
              id
              name
              width
              height
              fileId
              file {
                id
                url
                key
              }
            }
          }
          productBaseVariant {
            attributes {
              name
              value
            }
          }
        }
        product {
          id
          title
          campaignId
          mockups {
            variantId
            image
          }
          printAreas {
            id
            name
          }
          productBases {
            id
            title
          }
        }
        revenue
        note
        designs {
          id
          basePrintAreaID
          basePrintAreaName
          file {
            id
            key
            url
          }
        }
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
      }
    }
  }
`;

export const ORDERS_STATUS_SUBSCRIPTION = gql`
  subscription orderStatus {
    orderStatus {
      id
      originId
      status
    }
  }
`;
export const REGENDER_SUBSCRIPTION = gql`
  subscription reGeneratePrintFile {
    reGeneratePrintFile {
      id
      status
      originId
      designs {
        id
        basePrintAreaID
        basePrintAreaName
        file {
          id
          key
          url
        }
        status
      }
    }
  }
`;
