import gql from "graphql-tag";
export default gql`
  mutation(
    $id: String!
    $title: String!
    $preview: String
    $productBaseID: String!
    $productID: String
    $layers: [Map]
    $settings: MockupSettingsInput
    $ordering: Int
    $isRender: Boolean
    $isSaveToPB: Boolean
  ) {
    updateMockup(
      id: $id
      title: $title
      preview: $preview
      productBaseID: $productBaseID
      productID: $productID
      layers: $layers
      settings: $settings
      ordering: $ordering
      isRender: $isRender
      isSaveToPB: $isSaveToPB
    ) {
      id
      title
      preview
      productBase {
        id
        printAreas {
          width
          height
          name
        }
      }
      productID
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
