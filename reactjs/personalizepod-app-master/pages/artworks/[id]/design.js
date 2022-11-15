import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import DesignLayout from "layouts/design";
import ARTWORKQUERY from "graphql/queries/artwork";
import { useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import ErrorPage from "next/error";
import { ARTWORK } from "../../../actions";
import {
  Button,
  Dropdown,
  Menu,
  notification,
  PageHeader,
  Popover,
  Skeleton,
  Space,
  Tabs,
} from "antd";
import styled from "styled-components";
import Konva from "components/Konva/Konva";
import Scrollbars from "react-custom-scrollbars";
import Zoom from "components/Konva/Zoom";
import LeftToolbar from "components/Konva/LeftToolbar";
import TopToolbar from "components/Konva/TopToolbar";
import TemplateName from "components/Konva/Form/TemplateName";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import { cloneDeep, get, max, omit } from "lodash";
import UPDATEARTWORK from "graphql/mutate/updateArtwork";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { MdContentCopy, MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { DownOutlined } from "@ant-design/icons";
import Head from "next/head";
import useArtworkForm from "hooks/ArtworkForm";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 400px;
  min-height: calc(100vh - 50px);
  height: calc(100vh - 50px);
  overflow: hidden;
  .main-content {
    order: 0;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50px 50px auto;
  }
  .left-toolbar {
    order: 1;
    height: calc(100vh - 50px);
  }
`;

const ArtworkDesign = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork, selectedTemplate } = workspace;
  const [showSetting, setShowSetting] = useState(false);
  const [showTemplateName, setShowTemplateName] = useState(null);
  const [artworkForm, { form, showAddCategory }] = useArtworkForm({ artwork });
  useEffect(() => {
    if (showAddCategory !== null) {
      setShowSetting(!showAddCategory);
    }
  }, [showAddCategory]);
  const router = useRouter();
  const { id } = router.query;
  const [zoom, setZoom] = useState(1);
  const ratio = useMemo(() => {
    var r = max([artwork.width, artwork.height]);
    var res = 10;
    for (; res > 1; res--) {
      if (r * res <= 10000) {
        break;
      }
    }
    return res / 10;
  }, [artwork]);

  const handleQueryCompleted = (data) => {
    dispatch({
      type: ARTWORK.SET,
      payload: cloneDeep(data.artwork),
    });
    dispatch({
      type: ARTWORK.SET_SELECTED_TEMPLATE,
      payload: 0,
    });
    dispatch({
      type: ARTWORK.SET_SELECTED_LAYERS,
      payload: [],
    });
  };

  const [updateArtwork, { loading }] = useMutation(UPDATEARTWORK);
  const [uploadLoading, setLoading] = useState(false);
  const saveArtwork = async (e) => {
    setLoading(true);
    updateArtwork({
      variables: {
        id: artwork.id,
        input: {
          title: artwork.title,
          categoryIds: artwork.categories.map((cat) => cat.id),
          width: artwork.width,
          height: artwork.height,
          templates: artwork.templates.map((template, index) => ({
            ...omit(template, ["__typename"]),
          })),
          sharedLayers: artwork.sharedLayers,
          templateDisplayMode: artwork.templateDisplayMode,
          templateDisplayLabel: artwork.templateDisplayLabel,
        },
      },
    })
      .then(() => {
        setLoading(false);
        notification.success({ message: "Artwork updated" });
      })
      .catch((err) => {
        setLoading(false);
        notification.error({ message: err.message });
      });
  };

  const addTemplate = (from = null) => {
    var newTemplate = {
      title: "New Template",
      layers: [],
    };
    if (from !== null) {
      newTemplate = cloneDeep(artwork.templates[from]);
      newTemplate.title = "Copy of " + artwork.templates[from].title;
    }
    dispatch({
      type: ARTWORK.SET,
      payload: {
        ...artwork,
        templates: [...artwork.templates, newTemplate],
      },
    });
    dispatch({
      type: ARTWORK.SET_SELECTED_LAYERS,
      payload: [],
    });
    dispatch({
      type: ARTWORK.SET_SELECTED_TEMPLATE,
      payload: artwork.templates.length,
    });
  };

  const removeTemplate = (index) => {
    dispatch({
      type: ARTWORK.SET,
      payload: {
        ...artwork,
        templates: artwork.templates.filter((_, i) => `${i}` !== `${index}`),
      },
    });
    dispatch({
      type: ARTWORK.SET_SELECTED_LAYERS,
      payload: [],
    });
    dispatch({
      type: ARTWORK.SET_SELECTED_TEMPLATE,
      payload: 0,
    });
  };

  return (
    <div>
      <Head>
        <title>Edit Artwork {artwork.title}</title>
      </Head>
      <div
        style={{
          borderBottom: "1px solid #d9d9d9",
          display: "grid",
          gridTemplateColumns: "auto 170px",
          alignItems: "center",
          padding: "0 15px",
          height: 50,
        }}
      >
        <PageHeader
          className="artwork-page-header"
          title={
            <>
              {artwork.title}{" "}
              <Popover
                visible={showSetting}
                onVisibleChange={(v) => setShowSetting(v)}
                content={
                  <div>
                    {artworkForm}
                    <AuthElement name={permissions.ArtworkUpdate}>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          onClick={() =>
                            form.validateFields().then((values) => {
                              dispatch({
                                type: ARTWORK.SET,
                                payload: {
                                  ...artwork,
                                  ...values,
                                  categories: values.categoryIds?.map((id) => ({
                                    id: id,
                                  })),
                                },
                              });
                              setShowSetting(false);
                            })
                          }
                        >
                          Update
                        </Button>
                      </div>
                    </AuthElement>
                  </div>
                }
              >
                <DownOutlined style={{ fontSize: 16, cursor: "pointer" }} />
              </Popover>
            </>
          }
          style={{ padding: 0, justifyContent: "center" }}
          onBack={() => router.back()}
        />
        <Space style={{ justifyContent: "flex-end" }}>
          <Button
            type="link"
            onClick={() => router.push("/artworks", "/artworks")}
          >
            Cancel
          </Button>
          <AuthElement name={permissions.ArtworkUpdate}>
            <Button
              type="primary"
              onClick={saveArtwork}
              loading={loading || uploadLoading}
            >
              Save
            </Button>
          </AuthElement>
        </Space>
      </div>
      {id && (
        <Query
          query={ARTWORKQUERY}
          variables={{ id: id }}
          onCompleted={handleQueryCompleted}
        >
          {({ data, loading, error }) => {
            if (error) {
              return <ErrorPage statusCode={404} />;
            }
            if (loading) {
              return <Skeleton />;
            }
            if (data) {
              return (
                <Container>
                  <div className="left-toolbar dark">
                    <Scrollbars
                      style={{ width: "100%", height: "calc(100vh - 50px)" }}
                    >
                      <LeftToolbar />
                    </Scrollbars>
                  </div>
                  <div className="main-content">
                    <Tabs
                      type="editable-card"
                      onEdit={(e, action) => {
                        if (action === "add") {
                          addTemplate();
                        }
                      }}
                      style={{ marginTop: 9 }}
                      tabBarStyle={{ paddingLeft: 15 }}
                      activeKey={`${selectedTemplate}`}
                      onChange={(key) =>
                        dispatch({
                          type: ARTWORK.SET_SELECTED_TEMPLATE,
                          payload: parseInt(key),
                        })
                      }
                    >
                      {artwork.templates.map((tpl, index) => (
                        <Tabs.TabPane
                          tab={tpl.title}
                          closeIcon={
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item
                                    onClick={({ domEvent }) => {
                                      domEvent.stopPropagation();
                                      setShowTemplateName(index);
                                    }}
                                  >
                                    <BiEditAlt className="custom-icon anticon" />
                                    Rename
                                  </Menu.Item>
                                  <Menu.Item
                                    onClick={() => {
                                      addTemplate(index);
                                    }}
                                  >
                                    <MdContentCopy className="custom-icon anticon" />
                                    Duplicate
                                  </Menu.Item>
                                  <Menu.Divider />
                                  <Menu.Item
                                    onClick={() => {
                                      removeTemplate(index);
                                    }}
                                    style={{ color: "var(--error-color)" }}
                                  >
                                    <MdDelete className="custom-icon anticon" />
                                    Delete
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <CgMoreVerticalAlt
                                className="anticon"
                                fontSize={19}
                              />
                            </Dropdown>
                          }
                          key={`${index}`}
                        />
                      ))}
                    </Tabs>
                    <div>
                      <TopToolbar ratio={ratio} />
                    </div>

                    <div style={{ backgroundColor: "#F4F6F8" }}>
                      <Scrollbars
                        style={{ width: "100%", height: "calc(100vh - 147px)" }}
                      >
                        <Konva
                          width={get(artwork, "width", 600) * ratio * zoom}
                          height={get(artwork, "height", 600) * ratio * zoom}
                          ratio={ratio}
                          {...{ scaleX: zoom, scaleY: zoom }}
                          zoom={zoom}
                        />
                        <Zoom value={zoom} onChange={(v) => setZoom(v)} />
                      </Scrollbars>
                    </div>
                  </div>
                  <TemplateName
                    template={showTemplateName}
                    onCancel={() => setShowTemplateName(null)}
                  />
                </Container>
              );
            }
          }}
        </Query>
      )}
    </div>
  );
};

const AD = dynamic(() => Promise.resolve(ArtworkDesign), {
  ssr: false,
});
AD.Layout = DesignLayout;
export default AD;
