import { gql } from "@apollo/client";

export default gql`
  query($search: String, $page: Int, $pageSize: Int) {
    photos(search: $search, page: $page, pageSize: $pageSize) {
      count
      hits {
        id
        file {
          key
        }
      }
    }
  }
`;
