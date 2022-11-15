import { gql } from "@apollo/client";

export default gql`
  query($id: String!) {
    artwork(id: $id) {
      id
      title
      categories {
        id
        title
      }
      width
      height
      templates {
        title
        isDefault
        layers
        preview
        thumbnail
      }
      sharedLayers
      templateDisplayMode
      templateDisplayLabel
    }
  }
`;
