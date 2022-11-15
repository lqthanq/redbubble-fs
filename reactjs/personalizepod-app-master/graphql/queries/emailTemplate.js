import { gql } from "@apollo/client";

export default gql`
  query($id: String!) {
    EmailTemplate(id: $id) {
      id
      template
      subject
      data
      html
    }
  }
`;
