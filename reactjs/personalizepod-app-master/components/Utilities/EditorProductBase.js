import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import ReactQuill from "react-quill";

const Container = styled.div`
  .ql-toolbar.ql-snow .ql-formats {
    margin-right: 0px;
  }
  .ql-snow .ql-picker-label::before {
    line-height: 0px;
  }
  .ql-picker-label {
    outline: none;
  }
  .ql-editor {
    min-height: 300px;
  }
  line-height: 24px;
  .ql-snow .ql-picker-options .ql-picker-item {
    outline: none;
  }
`;


const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["link", "image", "video"],

      ["clean"],
    ],
  },
};

const formats = [
  "background",
  "bold",
  "color",
  "font",
  "code",
  "italic",
  "link",
  "size",
  "strike",
  "script",
  "underline",
  "blockquote",
  "header",
  "indent",
  "list",
  "align",
  "direction",
  "code-block",
  "image",
  "video",
];

const EditorProductBase = (props) => {

  const { onChange, value } = props;

  const handleChange = (value) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Container>
      <ReactQuill
        theme="snow"
        value={value ? value : ""}
        onChange={(value) => handleChange(value)}
        formats={formats}
        modules={modules}
      />
    </Container>
  )
}

export default EditorProductBase;
