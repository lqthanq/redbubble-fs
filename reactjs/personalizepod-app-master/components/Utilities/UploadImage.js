import { notification, Progress, Upload } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { SIGNED_URL } from "../../graphql/mutate/File/signedUrl";
import { useMutation } from "@apollo/client";
import Axios from "axios";
import { CREATE_FILE } from "../../graphql/mutate/file/create";
const Container = styled.div``;
const CDN_URL = process.env.CDN_URL;

const UploadImage = (props) => {
  const {
    setHeight,
    setWidth,
    imageKey,
    accept,
    multiple,
    custom,
    titleUpload,
    onChangeSaveDesign,
    onChange,
    type,
  } = props;
  const [createSignedUrl] = useMutation(SIGNED_URL);
  const [createFile] = useMutation(CREATE_FILE);
  const [percent, setPercent] = useState(0);
  const [imageUrl, setImageUrl] = useState();
  const uploadAction = (file) => {
    createSignedUrl({
      variables: {
        filename: file.name,
        // fileMime: file.type,
      },
    }).then((res) => {
      var key = res.data.createSignedUrl.key;
      Axios.put(res.data.createSignedUrl.url, file, {
        onUploadProgress: (e) => {
          setPercent(Math.round((e.loaded / e.total) * 100));
        },
        headers: { "Content-Type": file.type },
      })
        .then((res) => {
          // setImageUrl(`${CDN_URL}autoxauto/${key}`);
          createFile({
            variables: {
              input: {
                source: "aws",
                key: key,
                fileName: file.name,
                fileMime: file.type,
                fileSize: file.size,
              },
            },
          })
            .then((res2) => {
              if (type && onChange) {
                onChange({ fileId: res2.data.createFile.id, key });
              } else if (onChange) {
                onChange(res2.data.createFile.id);
              }
              if (onChangeSaveDesign) {
                onChangeSaveDesign({
                  id: res2.data.createFile.id,
                  source: res2.data.createFile.source,
                  key,
                  file_name: file.name,
                });
                setImageUrl(null);
              }

              setPercent(0);
            })
            .catch((err) => {
              console.log("vo error");
            });
        })
        .catch((err) => {
          console.log(err);
          // message.error(err.message);
        });
    });
  };

  const uploadButton = (
    <div
      style={{
        width: setWidth ? setWidth : "",
        height: setHeight ? setHeight : "",
        position: setWidth ? "relative" : "",
      }}
    >
      <div
        className="ant-upload-text"
        style={
          setWidth
            ? {
                display: "flex",
                top: "50%",
                left: "50%",
                position: "absolute",
                transform: "translate(-50%,-50%)",
              }
            : {}
        }
      >
        {titleUpload ? titleUpload : "Upload"}
      </div>
    </div>
  );

  return (
    <Container setWidth={setWidth} setHeight={setHeight}>
      <Upload
        {...props}
        name="avatar"
        showUploadList={false}
        {..._.omit(props, ["onChange"])}
        multiple={multiple ? multiple : false}
        // multiple={true}
        className="avatar-uploader"
        accept={accept ? accept : "all"}
        listType={!custom ? "picture-card" : null}
        action={(file) => uploadAction(file)}
      >
        {imageKey ? (
          <img
            style={{
              width: setWidth ? setWidth : 200,
              height: setHeight ? setHeight : 200,
              objectFit: "contain",
            }}
            src={`${CDN_URL}/${imageKey}`}
            alt="imageUpload"
          />
        ) : imageUrl ? (
          <img
            style={{
              width: setWidth ? setWidth : 200,
              height: setHeight ? setHeight : 200,
              objectFit: "contain",
            }}
            src={imageUrl}
            alt="imageUpload"
          />
        ) : custom ? (
          <span href="/#">Bulk Upload</span>
        ) : percent ? (
          <Progress percent={percent} type="circle" width={100} />
        ) : (
          uploadButton
        )}
      </Upload>
    </Container>
  );
};
export default UploadImage;
