import {
  Alert,
  Card,
  message,
  Modal,
  Skeleton,
  Tooltip,
  Popconfirm,
  Image,
  Space,
} from "antd";
import Grid from "components/Utilities/Grid";
import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import styled from "styled-components";
import MediaSelector from "components/Media/MediaSelector";
import CREATEMOCKUP from "graphql/mutate/mockup/create";
import DELETEMOCKUP from "graphql/mutate/mockup/delete";
import MOCKUPS from "graphql/queries/mockup/mockupsByProductBase";
import { useMutation } from "@apollo/client";
import { Mutation, Query } from "@apollo/client/react/components";
import MockupDesign from "components/Mockup/MockupDesign";
import {permissions} from "../Utilities/Permissions"
import AuthElement from "components/User/AuthElement";

import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const Container = styled.div`
  .ant-avatar > img {
    object-fit: contain;
    background: lightgray;
  }
  .mockup-toolbar {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 10;
  }
  img.fit-content {
    object-fit: contain;
  }
  .ant-card-cover {
    margin: 0;
  }
  .disable-upload {
    background: gainsboro;
    cursor: not-allowed;
    pointer-events: unset;
  }
`;

const ProductBaseMockup = ({ productBase, type }) => {
  const [mockup, setMockup] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [showEditMockup, setShowEditMockup] = useState(false);
  const [createMockup, { data, loading, error }] = useMutation(CREATEMOCKUP, {
    refetchQueries: [
      {
        query: MOCKUPS,
        variables: {
          productBaseID: productBase?.id,
        },
      },
    ],
  });
  return (
    <Container>
      <Card title="Mockups">
        <Grid width={120} gap={24}>
          {productBase && (
            <Query
              query={MOCKUPS}
              variables={{ productBaseID: productBase.id }}
            >
              {({ data, loading, error }) => {
                if (loading) {
                  return <Skeleton />;
                }
                if (error) {
                  return <Alert message={error.message} type="error" />;
                }
                if (data) {
                  return data.mockups.map((mk) => (
                    <Card
                      key={mk.id}
                      size="small"
                      style={{ height: 120 }}
                      cover={
                        <div>
                          <Image
                            src={`${process.env.CDN_URL}200x200/${mk.preview}`}
                            preview={{
                              src: `${process.env.CDN_URL}autoxauto/${mk.preview}`,
                            }}
                            className="fit-content"
                            fallback="/no-preview.jpg"
                            height={120}
                            width="100%"
                          />
                           <AuthElement name={permissions.UpdateProductBase}>
                          <Space className="mockup-toolbar">                           
                            <EditOutlined
                              style={{ color: "var(--primary-color)" }}
                              onClick={() => {
                                setMockup(mk);
                                setShowEditMockup(true);
                              }}
                            />                                                  
                            <Mutation
                              mutation={DELETEMOCKUP}
                              refetchQueries={[
                                {
                                  query: MOCKUPS,
                                  variables: { productBaseID: productBase.id },
                                },
                              ]}
                            >
                              {(deteleMockup, { loading, error }) => (
                                <Popconfirm
                                  title="Delete this mockup?"
                                  okButtonProps={{
                                    danger: true,
                                  }}
                                  onConfirm={() => {
                                    deteleMockup({
                                      variables: {
                                        id: mk.id,
                                      },
                                    })
                                      .then(() => {
                                        message.success("Mockup deleted");
                                      })
                                      .catch((err) => {
                                        message.error(err.message);
                                      });
                                  }}
                                >
                                  {loading ? (
                                    <LoadingOutlined />
                                  ) : (
                                    <DeleteOutlined
                                      style={{ color: "var(--error-color)" }}
                                    />
                                  )}
                                </Popconfirm>
                              )}
                            </Mutation>
                          </Space>
                          </AuthElement>
                        </div>
                      }
                      bodyStyle={{ display: "none" }}
                    />
                  ));
                }
              }}
            </Query>
          )}
           <AuthElement name={permissions.UpdateProductBase}>
          <Card
            bodyStyle={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              height: "100%",
              minHeight: 120,
            }}
            className={productBase ? "" : "disable-upload"}
          >
            {loading ? (
              <LoadingOutlined style={{ fontSize: 30 }} />
            ) : (
              <Tooltip
                title={
                  productBase
                    ? "Add new"
                    : "Please save your product base before add mockup"
                }
              >
                <FaPlusCircle
                  onClick={(e) => {
                    e.preventDefault();
                    if (productBase) {
                      setShowMedia(true);
                    }
                  }}
                  className={productBase ? "" : "disable-upload"}
                  style={{ cursor: productBase ? "pointer" : "not-allowed" }}
                  size={20}
                />
              </Tooltip>
            )}
          </Card>
          </AuthElement>
        </Grid>
      </Card>
      <MediaSelector
        limit={10}
        visible={showMedia}
        multiple={false}
        onChange={(files) => {
          setShowMedia(false);
          createMockup({
            variables: {
              fileID: files[0].id,
              productBaseID: productBase?.id,
              isRender: type ? (type == "base" ? true : false) : false,
              isSaveToPB: type ? (type == "base" ? true : false) : false,
              isProductBaseMockup: type
                ? type == "base"
                  ? true
                  : false
                : false,
            },
          })
            .then((res) => {
              setMockup(res.data.mockup);
              setShowEditMockup(true);
            })
            .catch((err) => {
              message.error(err.message);
            });
        }}
        onCancel={() => setShowMedia(false)}
        accept=".jpg,.jpeg,.png,.psd"
      />
      <Modal
        visible={showEditMockup}
        title="Edit Mockup"
        width={"100vw"}
        footer={null}
        closable={false}
        maskClosable={false}
        bodyStyle={{ padding: "15px 0 0" }}
        // onCancel={() => setShowEditMockup(false)}
        className="modal-fixed"
      >
        {mockup && (
          <MockupDesign
            id={mockup.id}
            onFinish={() => {
              setShowEditMockup(false);
              setMockup(null);
            }}
            onCancel={() => {
              setShowEditMockup(false);
              setMockup(null);
            }}
          />
        )}
      </Modal>
    </Container>
  );
};

export default ProductBaseMockup;
