import { Button } from "antd";
import MediaSelector from "components/Media/MediaSelector";
import Upload from "components/Media/Upload";
import { last } from "lodash";
import React, { useState } from "react";

const CustomUploadView = ({
  multiple,
  onlyLibrary,
  fileUploads,
  setFileUploads,
  showUploadList,
}) => {
  const [showMedia, setShowMedia] = useState(false);
  console.log(fileUploads);
  return (
    <div>
      <Upload
        fileList={multiple ? fileUploads : []}
        // disabled={!multiple && fileUploads?.length === 1}
        onUpload={(files) => {
          if (multiple) {
            setFileUploads(files);
          } else {
            const newFile = last(files) ? [last(files)] : [];
            setFileUploads(newFile);
          }
        }}
        showUploadList={showUploadList}
      >
        <p>Drop files to upload or</p>
        <div className="p-title-category p-24">
          <Button
            type="primary"
            className="mr-15"
            onClick={(e) => {
              e.stopPropagation();
              setShowMedia(true);
            }}
          >
            Media Library
          </Button>
          <Button type="primary">Select Files</Button>
        </div>
      </Upload>
      <MediaSelector
        multiple={multiple}
        onlyLibrary={onlyLibrary}
        visible={showMedia}
        onCancel={() => setShowMedia(false)}
        onChange={(files) => setFileUploads(files)}
        accept=".jpg,.png"
      />
    </div>
  );
};

export default CustomUploadView;
