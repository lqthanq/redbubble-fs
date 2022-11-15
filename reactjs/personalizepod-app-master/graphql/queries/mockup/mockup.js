import { gql } from "@apollo/client";

export default gql`
  query($id: String!) {
    mockup(id: $id) {
      id
      title
      productBase {
        id
        attributes {
          name
          slug
          values
        }
        printAreas {
          id
          name
          width
          height
        }
      }
      status
      preview
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
