import { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Alert, Checkbox, Divider, Spin } from "antd";
import Grid from "components/Utilities/Grid";
import FileField from "components/Media/FileField";
import Scrollbars from "react-custom-scrollbars";
import { debounce, forEach, get, groupBy, pick } from "lodash";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const Container = styled.div`
  .ant-checkbox-wrapper {
    position: absolute;
    left: 5px;
    top: 0;
  }
  .image-item {
    .delete-icon {
      display: none;
      position: absolute;
      right: 3px;
      top: 3px;
      font-size: 20px;
      fill: var(--error-color);
      cursor: pointer;
    }
    &:hover {
      .delete-icon {
        display: block;
      }
    }
  }
`;

const CLIPARTSQUERY = gql`
  query($page: Int, $pageSize: Int, $categoryID: [String], $search: String) {
    cliparts(
      page: $page
      pageSize: $pageSize
      categoryID: $categoryID
      search: $search
    ) {
      count
      hits {
        id
        file {
          id
          key
          fileName
        }
        category {
          id
          title
        }
      }
    }
  }
`;

const Cliparts = ({ categoryID, value, onChange = () => {} }) => {
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  const [cliparts, setCliparts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { data, loading } = useQuery(CLIPARTSQUERY, {
    variables: {
      categoryID: [categoryID],
      pageSize: -1,
    },
    onCompleted: (data) => {
      //const xx = groupBy(data.cliparts.hits, "category.id");
      //console.log(xx);
      setCliparts(groupBy(data.cliparts.hits, "category.id"));
      // if (!value) {
      //   console.log(categoryID);
      //   var firstClipart = get(data, "cliparts.hits[0]", null);
      //   if (firstClipart) {
      //     onChange(pick(firstClipart, ["file.id", "file.key", "category.id"]));
      //   }
      // }
    },
  });
  // useEffect(() => {
  //   setPage(1);
  //   setEnd(false);
  //   setCliparts([]);
  //   if (categoryID) {
  //     loadCliparts({
  //       variables: {
  //         categoryID: [categoryID],
  //         pageSize: -1,
  //       },
  //     });
  //   }
  // }, [categoryID]);

  // const handleScroll = async (values) => {
  //   const { scrollTop, scrollHeight, clientHeight } = values;
  //   const t = scrollTop / (scrollHeight - clientHeight);
  //   if (t >= 1 && !end) {
  //     setLoadingMore(true);
  //     await fetchMore({
  //       variables: {
  //         page: page + 1,
  //       },
  //       updateQuery: (data, { fetchMoreResult }) => {
  //         if (fetchMoreResult.cliparts.hits.length > 0) {
  //           setCliparts([...cliparts, ...fetchMoreResult.cliparts.hits]);
  //           setPage(page + 1);
  //         } else {
  //           setEnd(true);
  //         }
  //       },
  //     });
  //     setLoadingMore(false);
  //   }
  // };

  if (!categoryID)
    return <Alert message="Please select clipart categories" type="warning" />;
  return (
    <Container>
      <Scrollbars
        autoHeight
        autoHeightMax={300}
        //onUpdate={debounce(handleScroll, 200)}
      >
        {Object.keys(cliparts).map((catID) => {
          var _cliparts = cliparts[catID];
          var categoryTitle = get(_cliparts, "[0].category.title");
          return (
            <div key={catID}>
              <Divider orientation="left">{categoryTitle}</Divider>
              <Grid width={64} gap={5}>
                {_cliparts.map((clipart, index) => (
                  <div
                    key={`${clipart.id}`}
                    className="image-item"
                    style={{
                      border: "1px solid #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <FileField
                      size={64}
                      value={clipart.file}
                      editable={false}
                      onClick={() =>
                        onChange({
                          file: {
                            ...pick(clipart.file, ["id", "key"]),
                            categoryID: catID,
                          },
                        })
                      }
                    />
                    {value && value.file.id === clipart.file.id && (
                      <Checkbox checked={true} />
                    )}
                  </div>
                ))}
              </Grid>
            </div>
          );
        })}
        {(loading || loadingMore) && (
          <div style={{ textAlign: "center" }}>
            <Spin indicator={<LoadingOutlined />} />
          </div>
        )}
      </Scrollbars>
    </Container>
  );
};

export default Cliparts;
