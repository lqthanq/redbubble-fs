import gql from "graphql-tag";

export default gql`
  mutation($id: String!) {
    duplicateClipartCategory(id: $id) {
      id
      parentID
      title
      hasChild
      displaySettings
    }
  }
`;
