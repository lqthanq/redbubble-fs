import gql from "graphql-tag";

export const CREATE_EXPORT_TEMPLATE = gql`
  mutation createExportTemplate($input: NewExportTemplate!) {
    createExportTemplate(input: $input) {
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
export const CLONE_EXPORT_TEMPLATE = gql`
  mutation cloneExportTemplate($id: ID!) {
    cloneExportTemplate(id: $id) {
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
export const UPDATE_EXPORT_TEMPLATE = gql`
  mutation editExportTemplate($input: EditExportTemplate!) {
    editExportTemplate(input: $input) {
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
export const DELETE_EXPORT_TEMPLATE = gql`
  mutation deleteExportTemplate($id: ID!) {
    deleteExportTemplate(id: $id)
  }
`;
