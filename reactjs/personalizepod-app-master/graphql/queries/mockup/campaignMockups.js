import { gql } from "@apollo/client";

export default gql`
  query($productBaseIDs: [String!], $productID: String!) {
    mockups: campaignMockups(
      productBaseIDs: $productBaseIDs
      productID: $productID
    ) {
      id
      title
      preview
      productID
      productBase {
        id
        attributes {
          name
          slug
          values
        }
        printAreas {
          id
          width
          height
          name
        }
      }
      status
      isRender
      ordering
      isSaveToPB
      width
      height
      layers
      settings {
        defaultBgColor
        changeBgColorByVariantColor
        applyToVariants
      }
    }
  }
`;
