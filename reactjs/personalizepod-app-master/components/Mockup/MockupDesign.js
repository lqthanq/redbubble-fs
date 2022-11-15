import Scrollbars from "react-custom-scrollbars";
import styled from "styled-components";
import MainDesign from "./MainDesign";
import LeftToolbar from "./LeftToolbar";
import MOCKUPQUERY from "graphql/queries/mockup/mockup";
import MOCKUPS from "graphql/queries/mockup/mockupsByProductBase";
import { useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import { Button, Checkbox, message, Skeleton, Space } from "antd";
import ErrorPage from "next/error";
import { useAppValue } from "context";
import { MOCKUP } from "../../actions";
import UPDATEMOCKUP from "graphql/mutate/mockup/update";
import { search } from "./helper";
import { cloneDeep, omit, orderBy } from "lodash";
import Zoom from "components/Konva/Zoom";
import { useState } from "react";
Array.prototype.search = function (id) {
  return search(this, id);
};

// Return array of parent ids of an layer by id
Array.prototype.parents = function (id, tree = true) {
  var layer = this.search(id);
  if (layer === null) {
    return [];
  }
  if (!layer.parent) {
    return [];
  }
  return [layer.parent, ...this.parents(layer.parent)];
};

const timeout = (delay) => {
  return new Promise((res) => setTimeout(res, delay));
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 350px auto;
  background: #fff;
  margin: 0 15px;
  gap: 0px;
`;
const MockupDesign = ({
  id,
  onFinish = () => {},
  onCancel = () => {},
  campaignView,
  refetch,
  setNewMockupIds,
  newMockupIds,
}) => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockup, mockupsManage } = mockupWorkspace;
  const [zoom, setZoom] = useState(1);
  const [previewloading, setPreviewLoading] = useState(false);
  const [updateMockup, { loading: updateLoading }] = useMutation(UPDATEMOCKUP);

  const saveMockup = async (e) => {
    setPreviewLoading(true);
    await Promise.all(
      mockupsManage.map((item, index) => {
        var mockupItem = item;
        if (mockupItem.id === mockup.id) {
          mockupItem = mockup;
        }
        return new Promise((resolve, reject) => {
          updateMockup({
            variables: {
              id: mockupItem.id,
              title: mockupItem.title,
              preview: mockupItem.preview,
              isSaveToPB: mockupItem.isSaveToPB,
              productID: mockupItem.isSaveToPB ? null : mockupItem.productID,
              productBaseID: mockupItem.productBase.id,
              layers: mockupItem.layers,
              isRender: mockupItem.isRender,
              ordering: index,
              settings: omit(mockupItem.settings, ["__typename"]),
            },
          })
            .then((res) => {
              resolve(res.data.updateMockup);
            })
            .catch((err) => reject(err));
        });
      })
    )
      .then(() => {
        setPreviewLoading(false);
        if (setNewMockupIds) {
          setNewMockupIds([]);
        }
        onFinish();
        if (refetch) {
          refetch();
        }
      })
      .catch((err) => {
        setPreviewLoading(false);
        message.error(err.message);
      });
  };

  return (
    <div>
      <Query
        query={MOCKUPQUERY}
        fetchPolicy="network-only"
        variables={{ id }}
        onCompleted={(data) => {
          const matchMockup = mockupsManage.find((item) => item.id === id);
          dispatch({
            type: MOCKUP.SET,
            payload:
              campaignView && matchMockup
                ? { ...cloneDeep(data.mockup), ...matchMockup }
                : { ...cloneDeep(data.mockup) },
          });
          if (!campaignView) {
            dispatch({
              type: MOCKUP.SET_MOCKUPS,
              payload: [{ ...cloneDeep(data.mockup) }],
            });
          }
        }}
      >
        {({ data, loading, error, refetch: refetchMockup }) => {
          if (loading) {
            return <Skeleton />;
          }
          if (error) {
            return <ErrorPage statusCode={404} />;
          }
          if (data) {
            return (
              <Container>
                <div
                  style={{ borderRight: "1px solid #f5f5f5", paddingRight: 15 }}
                >
                  <Scrollbars
                    autoHeight
                    autoHeightMax={`calc(100vh - ${
                      campaignView ? "200px" : "74px"
                    })`}
                  >
                    <LeftToolbar
                      setNewMockupIds={setNewMockupIds}
                      newMockupIds={newMockupIds}
                      campaignView={campaignView}
                    />
                  </Scrollbars>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: "auto 66px",
                    height: `calc(100vh - ${campaignView ? "200px" : "74px"})`,
                  }}
                >
                  {/* <TopToolbar /> */}
                  <div
                    style={{
                      overflow: "auto",
                      backgroundColor: "rgb(237, 240, 242)",
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: 30,
                      paddingBottom: 30,
                      position: "relative",
                    }}
                  >
                    <MainDesign zoom={zoom} key={mockup?.id} />
                    <Zoom
                      value={zoom}
                      onChange={setZoom}
                      style={{ left: 380, bottom: 80 }}
                    />
                  </div>
                  <div className="flex item-center space-between">
                    <div>
                      {campaignView && mockup?.isRender ? (
                        <Checkbox
                          className="ml-15"
                          checked={mockup.isSaveToPB}
                          disabled={
                            !newMockupIds.includes(mockup?.id) &&
                            mockup.status === "Done" &&
                            mockup.isSaveToPB
                          }
                          onChange={(e) => {
                            let newMockups = cloneDeep(mockupsManage);
                            if (e.target.checked) {
                              setNewMockupIds([...newMockupIds, mockup.id]);
                            }
                            newMockups = newMockups.map((item) => {
                              if (item.id === mockup?.id) {
                                dispatch({
                                  type: MOCKUP.SET,
                                  payload: {
                                    ...mockup,
                                    isSaveToPB: e.target.checked,
                                  },
                                });
                                return {
                                  ...item,
                                  isSaveToPB: e.target.checked,
                                };
                              }
                              return { ...item };
                            });
                            dispatch({
                              type: MOCKUP.SET_MOCKUPS,
                              payload: newMockups,
                            });
                          }}
                        >
                          Save this mockup to product base mockups for using
                          later.
                        </Checkbox>
                      ) : null}
                    </div>
                    <Space className="align-right">
                      <Button
                        onClick={() => {
                          onCancel();
                          refetchMockup();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        onClick={saveMockup}
                        loading={updateLoading || previewloading}
                      >
                        Save
                      </Button>
                    </Space>
                  </div>
                </div>
              </Container>
            );
          }
        }}
      </Query>
    </div>
  );
};

export default MockupDesign;
