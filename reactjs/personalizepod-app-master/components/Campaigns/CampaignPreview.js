import { ARTWORK, CAMPAIGN, MOCKUP } from "actions";
import {
  Button,
  Card,
  Carousel,
  Col,
  Row,
  Space,
  Tooltip,
  Modal,
  Switch,
  Collapse,
  message,
  Skeleton,
  Popconfirm,
} from "antd";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import styled from "styled-components";
import MOCKUPS from "graphql/queries/mockup/campaignMockups";
import CREATEMOCKUP from "graphql/mutate/mockup/create";
import { useQuery, useMutation } from "@apollo/client";
import S3Image from "components/Utilities/S3Image";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import MediaSelector from "components/Media/MediaSelector";
import MockupDesign from "components/Mockup/MockupDesign";
import PreviewDetail from "./PreviewDetail";
import PushCampaignModal from "./PushCampaignModal";
import DELETEMOCKUP from "graphql/mutate/mockup/delete";
import Scrollbars from "components/Utilities/Scrollbars";
import SortMockupList from "./SortMockupList";
import { AiFillDelete } from "react-icons/ai";
import { get, last, maxBy, orderBy, times, uniqBy } from "lodash";
import MockupPreview from "components/Mockup/MockupPreview";
import ArtworkPreview from "components/Artworks/ArtworkPreview";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  background: #fff;
  .ant-collapse {
    background: #fff !important;
    .ant-collapse-item.ant-collapse-item-active.ant-collapse-item-disabled.ant-collapse-no-arrow {
      height: 100%;
      border-bottom: none !important;
    }
  }
  .ant-image {
    height: 100%;
    .ant-image-img {
      height: 100%;
      object-fit: contain;
    }
  }
  .ant-carousel {
    background: #f4f6f8;
    border: 1px solid rgb(240, 240, 240);
    .ant-image {
      img {
        height: 300px;
      }
    }
  }
  .ant-collapse-content-box {
    padding: 0 !important;
  }
`;

const CampaignPreview = ({ loading, form, setAddMorePage }) => {
  const router = useRouter();
  const [
    { campaign, mockupWorkspace, artworkPreviews },
    dispatch,
  ] = useAppValue();
  const { mockupsManage } = mockupWorkspace;
  const { baseSelected, productInput, productBases, settings } = campaign;
  const [mockup, setMockup] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [pushModal, setPushModal] = useState(false);
  const [newMockupIds, setNewMockupIds] = useState([]);
  const [showEditMockup, setShowEditMockup] = useState(false);
  const carouselRef = useRef();
  const [timesRepeat, setTimesRepeat] = useState(1);
  const mockupFilter = {
    productBaseIDs: [baseSelected.id],
    productID: productInput?.productId,
  };

  const { data, loading: mockupLoading, refetch } = useQuery(MOCKUPS, {
    variables: mockupFilter,
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data?.mockups) {
      dispatch({
        type: MOCKUP.SET_MOCKUPS,
        payload: orderBy(data.mockups, ["ordering"], ["asc"]),
      });
    }
  }, [data]);

  const [deleteMockup] = useMutation(DELETEMOCKUP);

  const [
    createMockup,
    { data: newMockupData, loading: newMockupLoading, error },
  ] = useMutation(CREATEMOCKUP, {
    refetchQueries: [
      {
        query: MOCKUPS,
        variables: mockupFilter,
      },
    ],
  });

  const missingArtwork = () => {
    Modal.error({
      title: "Error",
      content: "Artwork is required!",
    });
  };

  const checkMissingArtWork = () => {
    const allPrintFiles = productBases.reduce(
      (init, item) => init.concat(item.printAreas),
      []
    );
    const checkedMissingArtwork = allPrintFiles.find(
      (printFile) => !printFile.artwork
    );
    return !!checkedMissingArtwork;
  };

  const handleDeleteMockup = (mockupItem) => {
    deleteMockup({
      variables: {
        id: mockupItem.id,
      },
    })
      .then(() => {
        refetch();
        const newMockupsManage = mockupsManage.filter(
          (item) => item.id !== mockupItem.id
        );
        const reRenderMockup = newMockupsManage.length
          ? newMockupsManage[0]
          : {
              layers: [],
            };
        if (!newMockupsManage.length) {
          setShowEditMockup(false);
        }
        if (mockupItem.id === mockupWorkspace.mockup.id) {
          dispatch({
            type: MOCKUP.SET,
            payload: reRenderMockup,
          });
          setMockup(reRenderMockup);
        }
      })
      .catch((err) => message.error(err.message));
  };

  const uploadCard = times(timesRepeat, (i) => (
    <Card
      key={i}
      style={{ width: 100 }}
      bodyStyle={{
        height: 100,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <Tooltip tmockupLoadingitle="Upload manual mockup">
        {newMockupLoading ? (
          <LoadingOutlined style={{ fontSize: 18 }} />
        ) : (
          <PlusOutlined
            style={{ fontSize: 18 }}
            onClick={() => {
              setShowMedia(true);
            }}
          />
        )}
      </Tooltip>
    </Card>
  ));

  const mediaModal = (modal) => (
    <MediaSelector
      limit={10}
      visible={showMedia}
      multiple={true}
      onChange={async (files) => {
        setTimesRepeat(files.length);
        const maxOrdering = maxBy(
          mockupWorkspace.mockupsManage,
          (mockup) => mockup.ordering
        );
        await Promise.all(
          files.map((file, index) => {
            return new Promise((resolve, reject) => {
              createMockup({
                variables: {
                  fileID: file.id,
                  productBaseID: baseSelected.id,
                  productID: productInput?.products
                    ? productInput.products[0].id
                    : productInput.productId,
                  ordering: maxOrdering ? maxOrdering.ordering + 1 + index : 0,
                },
              })
                .then((res) => {
                  resolve(res.data.mockup);
                  setNewMockupIds([...newMockupIds, res.data.mockup?.id]);
                })
                .catch((err) => reject(err))
                .catch((err) => message.error(err.message));
            });
          })
        )
          .then((res) => {
            setShowMedia(false);
            refetch();
            setMockup(last(res));
            if (!modal) {
              setShowEditMockup(true);
            }
            setTimesRepeat(1);
          })
          .catch((err) => message.error(err.message));
      }}
      onCancel={() => setShowMedia(false)}
      accept=".jpg,.jpeg,.png,.psd"
    />
  );

  var elmnt = document.getElementsByClassName("carousel-wrapper");
  const lengthLimit = elmnt[0] && Math.floor(elmnt[0].offsetWidth / 100);

  if (mockupLoading) return <Skeleton active={true} />;

  return (
    <Container>
      <Collapse
        defaultActiveKey={["preview"]}
        expandIconPosition="right"
        bordered={false}
      >
        <Collapse.Panel
          bordered={false}
          collapsible="disabled"
          header={
            <div className="flex item-center space-between h-100">
              <span>Preview</span>
              <Space>
                <Button
                  disabled={loading}
                  onClick={() => {
                    dispatch({
                      type: CAMPAIGN.RESET,
                    });
                    form.resetFields();
                    router.push("/campaigns", "/campaigns");
                  }}
                >
                  Cancel
                </Button>
                <AuthElement name={permissions.CampaignCreate}>
                  <Button
                    loading={loading}
                    onClick={() => {
                      if (checkMissingArtWork()) {
                        missingArtwork();
                      } else {
                        form.submit();
                      }
                    }}
                    style={{ backgroundColor: "#254a75", width: 80 }}
                    type="primary"
                  >
                    Save
                  </Button>
                </AuthElement>
                <AuthElement name={permissions.CampaignUpdate}>
                  <Button
                    disabled={!productInput?.campaignId}
                    onClick={() => setPushModal(true)}
                    type="primary"
                  >
                    Push to store
                  </Button>
                </AuthElement>
              </Space>
            </div>
          }
          key="preview"
          showArrow={false}
        >
          <Scrollbars style={{ width: "auto", height: "calc(100vh - 112px)" }}>
            <Row className="p-15">
              <Col span={12}>
                {mockupsManage.length ? (
                  <Carousel ref={carouselRef} swipe={true} draggable={true}>
                    {orderBy(mockupsManage, ["ordering"], ["asc"]).map(
                      (mockup) => {
                        if (
                          productInput.excludeMockups &&
                          !productInput.excludeMockups.includes(mockup.id)
                        ) {
                          return (
                            <MockupPreview
                              mockup={mockup}
                              printAreas={baseSelected?.printAreas}
                              key={mockup.id}
                            />
                          );
                        }
                      }
                    )}
                  </Carousel>
                ) : null}
                <Space style={{ marginTop: 15 }} wrap>
                  {orderBy(mockupsManage, ["ordering"], ["asc"]).map(
                    (mockup, index) => (
                      <div
                        key={mockup.id}
                        style={{
                          width: 100,
                          height: 100,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "1px solid #f0f0f0",
                          borderRadius: 4,
                          position: "relative",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <S3Image
                          src={mockup.preview}
                          preview={false}
                          onClick={() => {
                            setShowEditMockup(true);
                            dispatch({
                              type: MOCKUP.SET,
                              payload: mockupsManage.find(
                                (mk) => mk.id === mockup.id
                              ),
                            });
                            setMockup(mockup);
                          }}
                          style={{
                            cursor: "pointer",
                            width: 100,
                            maxWidth: "100%",
                          }}
                        />
                        {mockup.isRender ? (
                          <Switch
                            onChange={(value) => {
                              let newExcludeMockups = [
                                ...productInput.excludeMockups,
                              ];
                              if (value) {
                                newExcludeMockups = newExcludeMockups.filter(
                                  (el) => el !== mockup.id
                                );
                              } else {
                                newExcludeMockups.push(mockup.id);
                              }
                              dispatch({
                                type: CAMPAIGN.SET,
                                payload: {
                                  campaign: {
                                    ...campaign,
                                    productInput: {
                                      ...productInput,
                                      excludeMockups: newExcludeMockups,
                                    },
                                  },
                                },
                              });
                            }}
                            checked={
                              !productInput?.excludeMockups?.includes(mockup.id)
                            }
                            size="small"
                            style={{
                              position: "absolute",
                              right: 5,
                              top: 5,
                            }}
                          />
                        ) : (
                          <Popconfirm
                            title="Are you sure to delete this mockup?"
                            onConfirm={() => {
                              handleDeleteMockup(mockup);
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              style={{
                                position: "absolute",
                                right: "-5px",
                                top: "-5px",
                              }}
                              type="link"
                              icon={
                                <AiFillDelete
                                  style={{
                                    color: "var(--error-color)",
                                  }}
                                  className="custom-icon anticon "
                                />
                              }
                            />
                          </Popconfirm>
                        )}
                      </div>
                    )
                  )}
                  {uploadCard}
                </Space>
                {(() => {
                  var artworks = uniqBy(
                    (baseSelected?.printAreas || []).map((p) => p.artwork),
                    "id"
                  );
                  return artworks
                    .filter((artwork) => artwork)
                    .map((artwork) => {
                      return (
                        <div key={artwork.id} style={{ display: "none" }}>
                          <ArtworkPreview
                            artworkId={artwork.id}
                            personalized={get(
                              settings,
                              `default[${artwork.id}]`,
                              { template: 0 }
                            )}
                            onDraw={(data) => {
                              dispatch({
                                type: ARTWORK.SET_PREVIEW,
                                payload: {
                                  [artwork.id]: data,
                                },
                              });
                            }}
                          />
                        </div>
                      );
                    });
                })()}
              </Col>
              <Col style={{ paddingLeft: 15 }} span={12}>
                <PreviewDetail setAddMorePage={setAddMorePage} />
              </Col>
            </Row>
          </Scrollbars>
        </Collapse.Panel>
      </Collapse>
      {mediaModal(false)}
      <Modal
        visible={showEditMockup}
        title="Edit Mockup"
        width={"100vw"}
        footer={null}
        maskClosable={false}
        bodyStyle={{ padding: "0" }}
        onCancel={() => {
          setShowEditMockup(false);
          setMockup(null);
          dispatch({
            type: MOCKUP.SET_MOCKUPS,
            payload: data.mockups,
          });
        }}
        className="modal-fixed"
      >
        <div style={{ background: "white", height: "calc(100vh - 70px)" }}>
          <SortMockupList
            mockupSelected={mockup}
            setMockup={setMockup}
            lengthLimit={lengthLimit}
            uploadCard={uploadCard}
            mediaModal={mediaModal}
            handleDeleteMockup={handleDeleteMockup}
          />
          {mockup && (
            <MockupDesign
              id={mockup.id}
              refetch={refetch}
              onFinish={() => {
                setShowEditMockup(false);
                setMockup(null);
              }}
              onCancel={() => {
                setShowEditMockup(false);
                setMockup(null);
                dispatch({
                  type: MOCKUP.SET_MOCKUPS,
                  payload: data.mockups,
                });
              }}
              setNewMockupIds={setNewMockupIds}
              newMockupIds={newMockupIds}
              campaignView={true}
            />
          )}
        </div>
      </Modal>
      <PushCampaignModal pushModal={pushModal} setPushModal={setPushModal} />
    </Container>
  );
};

export default CampaignPreview;
