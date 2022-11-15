import { gql } from "@apollo/client";

export default gql`
  query($id: ID!) {
    productBaseById(id: $id) {
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
      attributes {
        name
        slug
        values
      }
      variants {
        id
        attributes {
          name
          value
          slug
        }
        cost
        regularPrice
        salePrice
        fulfillmentProductId
        fssVariantId
        active
      }
      category {
        id
        title
      }
      fulfillment {
        id
        title
        description
        slug
        type
      }
      productCatalog
      shipping {
        us {
          firstProductFee
          additionalProductFee
        }
        canada {
          firstProductFee
          additionalProductFee
        }
        international {
          firstProductFee
          additionalProductFee
        }
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
      fulfillmentType
      isUsed
      fulfillmentProductId
    }
  }
`;
