import { gql } from "@apollo/client";

export default gql`
  query($search: String, $page: Int, $pageSize: Int) {
    fonts(search: $search, page: $page, pageSize: $pageSize) {
      count
      hits {
        id
        family
        variants {
          variant
          file {
            url
          }
        }
      }
    }
  }
`;
