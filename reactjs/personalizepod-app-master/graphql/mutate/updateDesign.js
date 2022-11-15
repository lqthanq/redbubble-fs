import gql from "graphql-tag";
export default gql`
  mutation($id: String!, $title: String, $data: Map) {
    design: updateDesign(id: $id, title: $title, data: $data) {
      id
      title
      data
    }
  }
`;
