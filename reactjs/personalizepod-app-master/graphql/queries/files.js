import { gql } from "@apollo/client";

export default gql`
  query(
    $mime: [String]
    $from: Time
    $to: Time
    $search: String
    $page: Int
    $pageSize: Int
    $type: String
    $sellerId: String
  ) {
    files(
      mime: $mime
      from: $from
      to: $to
      search: $search
      page: $page
      pageSize: $pageSize
      type: $type
      sellerId: $sellerId
    ) {
      count
      hits {
        id
        key
        url
        fileName
        fileMime
        fileSize
        createdAt
      }
    }
  }
`;
