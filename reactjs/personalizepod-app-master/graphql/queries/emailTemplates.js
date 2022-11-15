import { gql } from "@apollo/client";

export default gql`
  query {
    EmailTemplates {
      id
      template
      subject
      data
      html
    }
  }
`;
