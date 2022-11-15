import { Col, message, Modal, Row, Button } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import CREATEFILE from "../../graphql/mutate/file/create";
import { useMutation } from "@apollo/client";
import Avatar from "antd/lib/avatar/avatar";
import MediaTabs from "./MediaTabs";
import { defaultStyles, FileIcon } from "react-file-icon";

const MediaSelector = ({
  visible = false,
  multiple = false,
  accept = "*",
  onChange = () => {},
  onCancel = () => {},
  importURL = true,
  preview = true,
  onlyLibrary = false,
  showSelected = true,
  defaultSource = "upload",
  limit,
  fileType = "media",
}) => {
  const childRef = useRef();
  const [files, setFiles] = useState([]);
  const [closable, setClosable] = useState(true);
  const [fileUploads, setFileUploads] = useState([]);
  const [loading, setLoading] = useState([]);
  const [source, setSource] = useState(onlyLibrary ? "library" : defaultSource);
  const [showAll, setShowAll] = useState(false);
  const [createFileMutation] = useMutation(CREATEFILE);
  const [select, setSelect] = useState(null);

  const okDisabled = useMemo(() => {
    if (source === "library") {
      return (
        files.find((file) => file.fileSize / (1024 * 1024) > limit) ||
        files.length === 0
      );
    } else if (source === "url") {
      return false;
    } else if (source === "upload") {
      return (
        fileUploads.length === 0 ||
        fileUploads.some((file) => file.percent < 100)
      );
    } else {
      return true;
    }
  });

  useEffect(() => {
    setLoading(false);
    setShowAll(false);
  }, [visible]);

  const handleOnOK = () => {
    if (source === "library") {
      setLoading(true);
      onChange(files);
      setFiles([]);
      onCancel();
      setFileUploads([]);
    } else if (source === "url") {
      childRef.current.handleImportURL();
      setLoading(true);
      onCancel();
    } else {
      setLoading(true);
      Promise.all(
        fileUploads.map(
          (file) =>
            new Promise((resolve, reject) => {
              createFileMutation({
                variables: {
                  input: {
                    key: file.key,
                    fileName: file.name,
                    fileMime: file.type,
                    fileSize: file.size,
                    type: fileType,
                  },
                },
              })
                .then((res) => resolve(res.data.createFile))
                .catch((err) => reject(err));
            })
        )
      )
        .then((files) => {
          setLoading(false);
          onChange(files);
          setFileUploads([]);
          onCancel();
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  const onClear = () => {
    setFiles([]);
    setSelect();
    setFileUploads([]);
  };

  const onClickImg = (index) => {
    const a = files && files.find((el, id) => id === index);
    setSelect(a);
  };

  var elmnt = document.getElementsByClassName("item-wrapper");
  const lengthLimit = Math.floor((elmnt[0]?.offsetWidth - 500) / 40) - 1;
  const MediaTab = () => (
    <MediaTabs
      limit={limit}
      mediaRef={childRef}
      onlyLibrary={onlyLibrary}
      preview={preview}
      setSource={setSource}
      source={source}
      importURL={importURL}
      select={select}
      setSelect={setSelect}
      setFiles={setFiles}
      files={files}
      accept={accept}
      multiple={multiple}
      fileUploads={fileUploads}
      setFileUploads={setFileUploads}
      onImportURL={onChange}
      setClosable={(v) => setClosable(v)}
    />
  );

  const limitWarning = () => {
    switch (source) {
      case "library":
        return !!files.find((file) => file.fileSize / (1024 * 1024) > limit);
      case "upload":
        return !!fileUploads.find((file) => file.size / (1024 * 1024) > limit);
      default:
        return false;
    }
  };

  return (
    <div>
      <Modal
        visible={visible}
        title="Media Library"
        width={"80%"}
        okText="Select"
        onCancel={onCancel}
        maskClosable={closable}
        footer={
          <div className="flex item-center space-between item-wrapper">
            {limit && limitWarning() ? (
              <span style={{ color: "var(--error-color)", lineHeight: "42px" }}>
                File size must smaller than {limit}MB
              </span>
            ) : (
              <div
                className="w-100"
                style={{
                  visibility: source === "library" ? "initial" : "hidden",
                }}
              >
                <div
                  hidden={!files.length || !showSelected}
                  className="flex item-center"
                >
                  <div style={{ minWidth: 80 }} className="align-center">
                    {files.length} item{`${files.length > 1 ? "s" : ""}`}
                  </div>
                  <Button hidden={!files.length} type="link" onClick={onClear}>
                    Clear
                  </Button>
                  <Row hidden={!files.length} className="w-100">
                    {(showAll
                      ? files
                      : files.slice(0, Math.abs(lengthLimit))
                    ).map((el, index) => (
                      <Col
                        style={{ margin: "1px 5px" }}
                        key={el.id}
                        onClick={() => onClickImg(index)}
                      >
                        <div
                          style={
                            select && select.id === el.id
                              ? {
                                  border: "2px solid #5c6ac4",
                                }
                              : { border: "1px solid rgb(221, 221, 221)" }
                          }
                        >
                          <Avatar
                            shape="square"
                            size={36}
                            src={`${process.env.CDN_URL}100x100/${el.key}`}
                            style={{ objectFit: "contain" }}
                            icon={
                              <FileIcon
                                extension={el.key.substr(el.key.length - 3)}
                                {...defaultStyles[
                                  el.key.substr(el.key.length - 3)
                                ]}
                              />
                            }
                          />
                        </div>
                      </Col>
                    ))}
                    {files.length > Math.abs(lengthLimit) && !showAll ? (
                      <Col
                        style={{ cursor: "pointer", margin: "2px 0" }}
                        onClick={() => setShowAll(true)}
                      >
                        {files.length - Math.abs(lengthLimit) > 1 && (
                          <div className="wrapper-img">
                            +{files.length - Math.abs(lengthLimit)}
                          </div>
                        )}
                        <Avatar
                          shape="square"
                          size={40}
                          style={{
                            objectFit: "contain",
                          }}
                          src={`${process.env.CDN_URL}100x100/${files[lengthLimit]?.key}`}
                          icon={
                            <FileIcon
                              extension={files[lengthLimit]?.key.substr(
                                files[lengthLimit].key.length - 3
                              )}
                              {...defaultStyles[
                                files[lengthLimit]?.key.substr(
                                  files[lengthLimit].key.length - 3
                                )
                              ]}
                            />
                          }
                        />
                      </Col>
                    ) : null}
                  </Row>
                </div>
              </div>
            )}
            <div className="flex">
              <Button
                onClick={() => {
                  onClear();
                  onCancel();
                  if (childRef.current) {
                    childRef.current.handleResetForm();
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOnOK}
                type="primary"
                style={{ marginLeft: 15 }}
                disabled={okDisabled}
                loading={loading}
              >
                {source === "url" ? "Import" : "Select"}
              </Button>
            </div>
          </div>
        }
        className="p-modal-media"
      >
        {MediaTab()}
      </Modal>
    </div>
  );
};

export default MediaSelector;
