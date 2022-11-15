import React from "react";
import MediaSelector from "components/Media/MediaSelector";
import { useState } from "react";
import { Avatar } from "antd";
import { BsCardImage } from "react-icons/bs";
const ImageField = ({ value, onChange, size = 32, style = {} }) => {
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  return (
    <div style={style}>
      <Avatar
        src={`${process.env.CDN_URL}100x100/${value}`}
        onClick={() => setShowMediaSelector(true)}
        icon={<BsCardImage className="anticon" />}
        shape="square"
        style={{ cursor: "pointer" }}
        size={size}
      />
      <MediaSelector
        visible={showMediaSelector}
        onCancel={() => setShowMediaSelector(false)}
        onChange={(files) => {
          onChange(files[0].key);
          setShowMediaSelector(false);
        }}
      />
    </div>
  );
};

export default ImageField;
