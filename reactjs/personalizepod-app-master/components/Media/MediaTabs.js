import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  notification,
  Row,
  Tabs,
  Form,
  Progress,
  Popconfirm,
} from "antd";
import styled from "styled-components";
import Upload from "./Upload";
import { UploadMajor } from "@shopify/polaris-icons";
import Library from "./Library";
import ImportFromURLs from "./ImportFromURLs";
import { useMutation } from "@apollo/client";
import { AiTwotoneDelete } from "react-icons/ai";
import prettyBytes from "pretty-bytes";
import ImagePreview from "./ImagePreview";
import { remove } from "lodash";
import { defaultStyles, FileIcon } from "react-file-icon";
import { DELETE_FILE } from "graphql/mutate/file/deleteFile";
import { UPDATE_FILE_NAME } from "graphql/mutate/file/updateFileName";
import moment from "moment";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Container = styled.div`
  .ant-tabs-content-holder {
    position: relative;
  }
  .upload-icon {
    width: 30px;
    fill: #404040;
  }
  .file-upload-preview {
    margin: 5px -5px 0 !important;
    .ant-col {
      position: relative;
    }
    img {
      max-width: 100%;
    }
    .delete {
      width: 25px;
      fill: #de3618;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
  .attachment-detail {
    position: relative;
    z-index: 75;
    overflow: auto;
    background: #f4f6f8;
    border-left: 0.1rem solid #f0f0f0;
    .ant-card-body {
      padding: 0;
    }
  }
  .ant-card-head-title {
    padding: 6px 0;
  }
  .file-icon {
    max-width: 120px;
  }
  .attach-fileName {
    font-weight: 600;
    color: #444;
    font-size: 12px;
    margin-top: 5px;
  }
  h2 {
    font-weight: 600;
    font-size: 14px;
    color: #666;
    margin: 24px 0 8px;
  }
  .descrip {
    color: #666;
    font-size: 12px;
    line-height: 1.5;
  }
  .edit-content {
    overflow: hidden;
    min-height: 60px;
    line-height: 1.5;
    color: #666;
    border-top: 1px solid #ddd;
    padding-top: 11px;
  }
`;
const CDN_URL = process.env.CDN_URL;
const MediaTabs = ({
  setSource,
  source,
  importURL,
  select,
  setSelect,
  setFiles,
  files,
  accept,
  multiple,
  fileUploads,
  setFileUploads,
  preview,
  onlyLibrary,
  mediaRef,
  onImportURL,
  setClosable,
  limit,
}) => {
  const [form] = Form.useForm();
  const childRef = useRef();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(null);
  const [updateFileName] = useMutation(UPDATE_FILE_NAME);
  const [deleteFile] = useMutation(DELETE_FILE);

  useEffect(() => {
    form.resetFields();
  }, [select]);

  const handleSaveTitle = ({ title }) => {
    if (select.fileName !== title) {
      setTitle(title);
      updateFileName({
        variables: {
          id: select.id,
          fileName: title,
        },
      })
        .then(() => {
          setEdit(false);
          childRef.current.handleRenameFiles({ ...select, title });
        })
        .catch((err) => notification.error(err.message));
    }
  };

  const onConfirmDelete = () => {
    deleteFile({
      variables: {
        id: select.id,
      },
    })
      .then((res) => {
        const newFiles = files.filter((el) => el.id !== select.id);
        setFiles(newFiles);
        childRef.current.handleSetLibraryFiles();
        const newFilesUpload = fileUploads.filter((el) => el.id !== select.id);
        setFileUploads(newFilesUpload);
      })
      .catch((err) => notification.error(err.message));
  };

  useEffect(() => {
    setTitle();
    setEdit(false);
  }, [select]);
  useEffect(() => {
    if (source === "upload") {
      setClosable(false);
    } else {
      setClosable(true);
    }
  }, [source]);
  return (
    <Container>
      <Tabs
        className="p-media-main-tab"
        style={{ marginBottom: 0 }}
        activeKey={source}
        onChange={(source) => {
          setSource(source);
        }}
      >
        {!onlyLibrary && (
          <Tabs.TabPane key="upload" tab="Upload">
            <div
              style={{
                height: 300,
                marginRight: 16,
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <Upload
                limit={limit}
                multiple={multiple}
                fileList={fileUploads}
                disabled={!multiple && fileUploads.length >= 1}
                accept={accept}
                onChange={(files) => setFileUploads(files)}
                showUploadList={false}
              >
                <div style={{ padding: "100px 0", color: "#888" }}>
                  <UploadMajor className="upload-icon" />
                  <p>Click or drag and drop file(s) here to upload</p>
                </div>
              </Upload>
            </div>
            <Row className="file-upload-preview" gutter={[10, 10]}>
              {fileUploads.map((f) => (
                <Col key={f.uid} span={12} md={4} lg={3}>
                  <ImagePreview file={f.originFileObj} />
                  <Progress percent={Math.round(f.percent)} size="small" />
                  <AiTwotoneDelete
                    className="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(fileUploads, (file) => file.uid === f.uid);
                      setFileUploads([...fileUploads]);
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>
        )}
        <Tabs.TabPane key="library" tab="Library">
          <Row gutter={24}>
            <Col
              span={24}
              md={preview ? 18 : 24}
              style={{ paddingRight: 16, paddingTop: 16 }}
            >
              <Library
                limit={limit}
                accept={accept}
                ref={childRef}
                onChange={(files) => {
                  setFiles(files);
                }}
                files={files}
                multiple={multiple}
                select={select}
                setSelect={setSelect}
              />
            </Col>
            <Col
              hidden={!preview}
              className="attachment-detail"
              span={24}
              md={6}
            >
              {select ? (
                <div style={{ marginTop: 16, padding: "0 16px 16px 4px" }}>
                  <h2>ATTACHMENT DETAILS</h2>
                  {select.fileMime.includes("image") &&
                  !select.key.includes("psd") ? (
                    <Card
                      style={{
                        maxWidth: 140,
                        maxHeight: 140,
                      }}
                      cover={
                        <img
                          style={{
                            margin: "0 auto",
                            display: "flex",
                            maxWidth: 140,
                            maxHeight: 140,
                            objectFit: "contain",
                            boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)",
                          }}
                          src={`${CDN_URL}200xauto/${select?.key}`}
                        />
                      }
                    />
                  ) : (
                    <div className="file-icon">
                      <FileIcon
                        className="file-icon"
                        extension={select.key.substr(select.key.length - 3)}
                        {...defaultStyles[
                          select.key.substr(select.key.length - 3)
                        ]}
                      />
                    </div>
                  )}
                  <div className="attach-fileName">
                    {title ?? select?.fileName}
                  </div>
                  <div className="descrip">
                    {moment(select.createdAt).format("DD MMM YYYY")}
                  </div>
                  <div className="descrip">{prettyBytes(select?.fileSize)}</div>
                  <Popconfirm
                    title="Are you sure to delete this file?"
                    okButtonProps={{
                      danger: true,
                    }}
                    onConfirm={onConfirmDelete}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      style={{ padding: "0 0 10px", height: "auto" }}
                      className="descrip delete-button-color"
                      type="link"
                    >
                      Delete Permanently
                    </Button>
                  </Popconfirm>
                  <div className="edit-content">
                    <Form
                      {...layout}
                      className="no-margin-form-item mr-15"
                      form={form}
                      onValuesChange={(changedValues) =>
                        handleSaveTitle(changedValues)
                      }
                    >
                      <Form.Item
                        name="title"
                        colon="false"
                        label="Title"
                        initialValue={title ?? select?.fileName}
                      >
                        <Input defaultValue={select?.fileName} />
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </Col>
          </Row>
        </Tabs.TabPane>
        {importURL && !onlyLibrary && (
          <Tabs.TabPane key="url" tab="Import From URLs">
            <ImportFromURLs
              limit={limit}
              ref={mediaRef}
              onUpload={(files) => {
                if (onImportURL) {
                  onImportURL(files);
                }
              }}
              files={files}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Container>
  );
};

export default MediaTabs;
