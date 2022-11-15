import gql from "graphql-tag";
export default gql`
  mutation($title: String!, $parentID: String) {
    createClipartCategory(title: $title, parentID: $parentID) {
      id
      title
      hasChild
      parentID
    }
  }
`;
