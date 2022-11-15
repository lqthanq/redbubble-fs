import { Button, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MediaSelector from "components/Media/MediaSelector";
import { AiTwotoneDelete } from "react-icons/ai";
import { last } from "lodash";

const Container = styled.div`
  .ant-upload {
    padding: 0px !important;
  }
`;

const ProductBaseImage = ({ onChange = () => {}, image }) => {
  const [upload, setUpload] = useState(false);
  const [newImage, setNewImage] = useState(image ?? null);
  useEffect(() => {
    onChange(newImage ? newImage.id : null);
  }, [newImage]);

  return (
    <Container>
      <div onClick={() => setUpload(true)}>
        {newImage ? (
          <div>
            <img
              style={{ width: "100%", height: "auto", cursor: "pointer" }}
              src={`${process.env.CDN_URL}/500x500/${newImage.key}`}
            />
          </div>
        ) : (
          <div
            style={{
              paddingTop: 24,
              textAlign: "center",
              border: "1px dashed #999",
              cursor: "pointer",
            }}
          >
            <p>Drop files to upload or</p>
            <div className="p-title-category p-24">
              <Button onClick={() => setUpload(true)} type="primary">
                Select Files
              </Button>
            </div>
          </div>
        )}
      </div>
      {newImage ? (
        <div className="align-center" style={{ marginTop: 20 }}>
          <Tooltip title="Delete" placement="bottom">
            <AiTwotoneDelete
              style={{ color: "var(--error-color)" }}
              onClick={() => {
                setNewImage();
              }}
              className="anticon custom-icon"
            />
          </Tooltip>
        </div>
      ) : null}
      <MediaSelector
        visible={upload}
        showUploadList={true}
        onCancel={() => setUpload(false)}
        onChange={(files) => {
          setNewImage(last(files));
        }}
      />
    </Container>
  );
};

export default ProductBaseImage;
