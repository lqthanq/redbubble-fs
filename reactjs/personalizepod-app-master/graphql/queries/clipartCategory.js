import { gql } from "@apollo/client";

export default gql`
  fragment ClipartCategory on ClipartCategory {
    id
    title
    parentID
    hasChild
    displaySettings
    isFolder
    numberOfCliparts
  }

  query($id: String!) {
    clipartCategory(id: $id) {
      ...ClipartCategory
      children {
        ...ClipartCategory
        children {
          ...ClipartCategory
          children {
            ...ClipartCategory
            children {
              ...ClipartCategory
              children {
                ...ClipartCategory
                children {
                  ...ClipartCategory
                  children {
                    ...ClipartCategory
                    children {
                      ...ClipartCategory
                      children {
                        ...ClipartCategory
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
