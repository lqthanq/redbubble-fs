import { Image } from "antd";

const S3Image = ({
  src,
  preset = "100xauto",
  preview = null,
  style = {},
  onClick = () => {},
}) => {
  return (
    <Image
      preview={
        preview !== null
          ? preview
          : { src: `${process.env.CDN_URL}autoxauto/${src}` }
      }
      src={`${process.env.CDN_URL}${preset}/${src}`}
      style={style}
      onClick={onClick}
      fallback={`/no-preview.jpg`}
    />
  );
};

export default S3Image;
