import Avatar from "antd/lib/avatar/avatar";
import { pick } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import MediaSelector from "./MediaSelector";
const FileField = ({
  value,
  onChange = () => {},
  onClick = () => {},
  size = 32,
  style = {},
  editable = true,
}) => {
  const [file, setFile] = useState(value);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  useEffect(() => {
    setFile(value);
  }, [value]);
  return (
    <div style={style} onClick={onClick}>
      <Avatar
        onClick={() => {
          if (editable) {
            setShowMediaSelector(true);
          }
        }}
        src={file ? `${process.env.CDN_URL}100x100/${file.key}` : null}
        size={size}
        shape={"square"}
        style={{ cursor: "pointer", backgroundColor: "#ddd" }}
        className="object-fix-contain"
      />
      <MediaSelector
        visible={showMediaSelector}
        onChange={(files) => {
          onChange(pick(files[0], ["id", "key"]));
          setShowMediaSelector(false);
        }}
        onCancel={() => setShowMediaSelector(false)}
      />
    </div>
  );
};

export default FileField;
