import { gql } from "@apollo/client";

export default gql`
  query($productBaseID: String!) {
    mockups: mockupsByProductBase(productBaseID: $productBaseID) {
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
