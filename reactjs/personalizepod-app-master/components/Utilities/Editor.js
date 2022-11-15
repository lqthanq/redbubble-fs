import React, { forwardRef, useState, useRef, useMemo, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import MediaSelector from "components/Media/MediaSelector";
import dynamic from "next/dynamic";
const Container = styled.div`
  .quill {
    background: #fff;
  }
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
    min-height: 240px;
  }
  line-height: 24px;
  .ql-snow .ql-picker-options .ql-picker-item {
    outline: none;
  }
`;
let Quill;
let ImageResize;
const QuillSSRSafe = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);
const Editor = forwardRef((props, ref) => {
  const quillRef = useRef(null);
  const { onChange, value = null } = props;
  const [showMedia, setShowMedia] = useState(false);
  useEffect(() => {
    const init = (quill) => {
      console.log(quill);
    };
    Quill = require("react-quill").Quill;
    ImageResize = require("quill-image-resize");
    const check = () => {
      if (quillRef.current) {
        init(quillRef.current);
        return;
      }
      setTimeout(check, 200);
    };
    check();
  }, [quillRef]);
  useEffect(() => {
    if (Quill) {
      Quill.register("modules/imageResize", ImageResize.default);
    }
  }, [Quill]);
  const constModule = useMemo(() => {
    let modules = {
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
        handlers: {
          image: () => {
            setShowMedia(true);
          },
        },
      },
      imageResize: false,
    };
    // if (Quill) {
    //   modules.imageResize = true;
    // }
    return modules;
  }, [Quill]);
  const inserImageToEditor = (files) => {
    if (showMedia) {
      files.forEach((file) => {
        insertImage(process.env.CDN_URL + "300xauto/" + file.key, "image");
      });
    }
  };
  const insertImage = (url, type) => {
    quillRef.current
      .getEditor()
      .insertEmbed(
        quillRef.current.getEditor().getSelection(true).index,
        type,
        url,
        "user"
      );
    quillRef.current.focus();
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

  const handleChange = (html) => {
    onChange(html);
  };
  return (
    <Container>
      <QuillSSRSafe
        value={value}
        forwardedRef={quillRef}
        theme="snow"
        onChange={(value) => handleChange(value)}
        formats={formats}
        modules={constModule}
      />
      <MediaSelector
        multiple={true}
        visible={showMedia}
        onCancel={() => setShowMedia(false)}
        onChange={(files) => inserImageToEditor(files)}
      />
    </Container>
  );
});
export default Editor;
