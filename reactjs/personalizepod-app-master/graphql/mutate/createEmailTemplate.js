import gql from "graphql-tag";

export default gql`
  mutation($title: String!, $data: Map, $html: String!) {
    createEmailTemplate(title: $title, data: $data, html: $html) {
      id
      title
      data
    }
  }
`;
