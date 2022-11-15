import { gql } from "@apollo/client";

export const EXPORT_TEMPLATES = gql`
  query exportTemplates($search: String) {
    exportTemplates(search: $search) {
      id
      name
      author {
        id
        firstName
        lastName
      }
      columns {
        name
        type
        value
      }
    }
  }
`;

export const EXPORT_TEMPLATES_BY_ID = gql`
  query exportTemplateById($id: ID!) {
    exportTemplateById(id: $id) {
      id
      name
      author {
        id
        firstName
        lastName
      }
      columns {
        name
        type
        value
      }
    }
  }
`;
export const EXPORT_TEMPLATE_COLUMNS = gql`
  query exportTemplateColumns {
    exportTemplateColumns {
      label
      value
    }
  }
`;
