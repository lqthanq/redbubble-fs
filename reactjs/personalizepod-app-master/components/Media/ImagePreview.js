import styled from "styled-components";

const { useState, useEffect } = require("react");
const { FileIcon, defaultStyles } = require("react-file-icon");

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  svg {
    max-height: 100%;
  }
`;
const ImagePreview = ({ styles = {}, file, size = 200 }) => {
  const [src, setSrc] = useState(
    file?.type ? null : `${process.env.CDN_URL}/${size}xauto/${file?.key}`
  );
  useEffect(() => {
    if (
      [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/tif",
        "image/tiff",
        "image/svg",
      ].includes(file?.type)
    ) {
      var reader = new FileReader();
      reader.onload = (e) => {
        setSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);
  return src ? (
    <div
      style={{
        position: "relative",
        height: 0,
        paddingBottom: "67%",
        backgroundImage: `url(${src})`,
        backgroundSize: "contain",
        backgroundColor: "#f5f5f5",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        border: "1px solid #ddd",
        borderRadius: 3,
        ...styles,
      }}
    ></div>
  ) : (
    <div
      style={{
        position: "relative",
        height: 0,
        paddingBottom: "67%",
        border: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        borderRadius: 3,
        ...styles,
      }}
    >
      <Container>
        <FileIcon
          extension="psd"
          {...defaultStyles}
          radius={0}
          fold={false}
          color="#5C6AC4"
        />
      </Container>
    </div>
  );
};

export default ImagePreview;
