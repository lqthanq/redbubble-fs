import { gql } from "@apollo/client";

export default gql`
  query(
    $categoryID: String
    $search: String
    $page: Int
    $pageSize: Int
    $sortBy: String
    $order: String
    $sellerId: String
  ) {
    artworks(
      categoryID: $categoryID
      search: $search
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      sellerId: $sellerId
    ) {
      count
      hits {
        id
        title
        categories {
          id
          title
        }
        lock
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
        templates {
          title
          preview
          thumbnail
        }
        usedIn
        width
        height
      }
    }
  }
`;
