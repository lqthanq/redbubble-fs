import { gql } from "@apollo/client";

export default gql`
  query {
    layerTemplates {
      id
      data
    }
  }
`;
