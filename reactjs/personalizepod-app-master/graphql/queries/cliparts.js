import { gql } from "@apollo/client";
export default gql`
  query(
    $page: Int
    $pageSize: Int
    $categoryID: [String]
    $search: String
    $sellerId: String
  ) {
    cliparts(
      page: $page
      pageSize: $pageSize
      categoryID: $categoryID
      search: $search
      sellerId: $sellerId
    ) {
      count
      hits {
        id
        title
        color
        order
        file {
          id
          key
          fileMime
          fileName
        }
        category {
          id
          title
        }
        author {
          id
          firstName
          lastName
          email
          avatar {
            id
            key
            url
          }
        }
        createdAt
      }
    }
  }
`;
