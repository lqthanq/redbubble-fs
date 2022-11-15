import React, { useState } from "react";
import MediaSelector from "components/Media/MediaSelector";

const ImagePrintarea = ({ onChange, record, settingColor, uploadOrder }) => {
  const [upload, setUpload] = useState(false);

  const handleUpload = (image) => {
    onChange(image);
  };

  return (
    <div>
      {settingColor ? (
        <div
          onClick={() => {
            setUpload(true);
          }}
          style={{
            width: 80,
            height: 80,
            border: "1px dashed #999",
          }}
        >
          {record?.key ? (
            <div className="main-img">
              <img
                className="image"
                style={{ backgroundColor: "darkgray" }}
                src={`${process.env.CDN_URL}/500x500/${record?.key}`}
              />
            </div>
          ) : (
            <div className="main-img">
              <img className="image" src={"/images/upload-icon.png"} />
            </div>
          )}
        </div>
      ) : record ? (
        <div
          onClick={() => setUpload(true)}
          style={{
            cursor: "pointer",
            position: "relative",
            height: 0,
            paddingBottom: "65%",
            backgroundImage: record.file
              ? `url(${process.env.CDN_URL}/200x200/${record?.file?.key})`
              : `url(https://culturaltrust.org/wp-content/themes/oct/assets/img/no-img.png)`,
            backgroundSize: "contain",
            backgroundColor: record.file ? "#f5f5f5" : "#fff",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            border: "1px dashed #ddd",
            borderRadius: 3,
          }}
        />
      ) : (
        <div
          onClick={() => {
            setUpload(true);
          }}
          style={{
            width: "100%",
            height: 300,
            border: "1px dashed #999",
          }}
        >
          {uploadOrder?.key ? (
            <div
              style={{
                width: "100%",
                height: 300,
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "99%",
                  objectFit: "contain",
                }}
                src={`${process.env.CDN_URL}/500x500/${uploadOrder?.key}`}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: 300,
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                src={"/images/default-img.png"}
              />
            </div>
          )}
        </div>
      )}

      <MediaSelector
        visible={upload}
        showUploadList={true}
        onCancel={() => setUpload(false)}
        onChange={(images) => {
          handleUpload(images[0]);
        }}
      ></MediaSelector>
    </div>
  );
};

export default ImagePrintarea;
