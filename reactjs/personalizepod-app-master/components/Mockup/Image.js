import React, { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
const Image = ({ layer, onClick = () => {} }) => {
  const imageRef = useRef();
  const [img] = useImage(
    process.env.CDN_URL + `autoxauto/` + layer.file.key,
    process.env.APP_URL
  );
  useEffect(() => {
    if (img) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [img]);
  return <KonvaImage {...layer} image={img} ref={imageRef} onClick={onClick} />;
};
export default Image;
