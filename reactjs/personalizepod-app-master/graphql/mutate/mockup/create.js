import gql from "graphql-tag";
export default gql`
  mutation(
    $fileID: String!
    $productBaseID: String!
    $ordering: Int
    $isRender: Boolean
    $isSaveToPB: Boolean
    $isProductBaseMockup: Boolean
    $productID: String
  ) {
    mockup: createMockup(
      fileID: $fileID
      productBaseID: $productBaseID
      ordering: $ordering
      isRender: $isRender
      productID: $productID
      isSaveToPB: $isSaveToPB
      isProductBaseMockup: $isProductBaseMockup
    ) {
      id
      productID
      isRender
      ordering
      isSaveToPB
      productBase {
        id
        printAreas {
          id
          name
          width
          height
        }
      }
      settings {
        defaultBgColor
        changeBgColorByVariantColor
        applyToVariants
      }
      layers
      preview
    }
  }
`;
