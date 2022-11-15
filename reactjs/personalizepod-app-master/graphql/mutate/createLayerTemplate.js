import gql from "graphql-tag";
export default gql`
  mutation($data: Jsonb!) {
    layerTemplate: createLayerTemplate(data: $data) {
      id
      data
    }
  }
`;
