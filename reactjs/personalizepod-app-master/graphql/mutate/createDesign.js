import gql from "graphql-tag";
export default gql`
  mutation($title: String!, $data: Map) {
    design: createDesign(title: $title, data: $data) {
      id
      title
      data
    }
  }
`;
