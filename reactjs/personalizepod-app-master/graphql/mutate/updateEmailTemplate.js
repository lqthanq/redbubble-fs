import gql from "graphql-tag";

export default gql`
  mutation(
    $id: String!
    $subject: String!
    $data: Map
    $html: String!
    $template: String!
  ) {
    updateEmailTemplate(
      id: $id
      subject: $subject
      data: $data
      html: $html
      template: $template
    ) {
      id
    }
  }
`;
