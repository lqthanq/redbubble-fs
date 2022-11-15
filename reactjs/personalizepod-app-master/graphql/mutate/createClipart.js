import gql from "graphql-tag";
export default gql`
  mutation(
    $title: String!, $file: FileInput!, $categoryID: String!
  ) {
    createClipart(
      title: $title
      file: $file
      categoryID: $categoryID
    ) {
      id
      title
      file {
        id
        key
        fileMime
        fileName
        url
      }
      category {
        id
        title
      }
    }
  }
`;
