import Konva from "konva";
import { get, omit } from "lodash";
import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const Image = (props) => {
  const imageRef = useRef();
  const { file, _filters, absolutePosition, ratio, zoom } = props;
  const filters = _filters || [];

  const [img] = useImage(
    process.env.CDN_URL +
      `${ratio === 1 ? "autoxauto" : ratio * 10 + "10xauto"}/` +
      file?.key,
    process.env.APP_URL
  );

  useEffect(() => {
    if (imageRef && imageRef.current && absolutePosition) {
      imageRef.current.absolutePosition({
        x: absolutePosition.x * zoom,
        y: absolutePosition.y * zoom,
      });
    }
  }, [imageRef, absolutePosition]);

  useEffect(() => {
    if (img && imageRef && imageRef.current) {
      applyCrop(imageRef.current.getAttr("lastCropUsed"));
      imageRef.current.getLayer().dispatchEvent(new Event("update"));
    }
  }, [imageRef, img, props.width, props.height]);

  useEffect(() => {
    if (img) {
      const node = imageRef.current;
      if (!node.getAttr("width")) {
        node.setAttr("width", img.width);
      }
      if (!node.getAttr("height")) {
        node.setAttr("height", img.height);
      }
      applyCrop(node.getAttr("lastCropUsed"));
      // if (
      //   imageRef.current.getAttr("originWidth") !== img.width ||
      //   imageRef.current.getAttr("originHeight") !== img.height
      // ) {
      //   imageRef.current.setAttrs({
      //     width: img.width,
      //     height: img.height,
      //     originWidth: img.width,
      //     originHeight: img.height,
      //     cropX: 0,
      //     cropWidth: img.width,
      //     cropY: 0,
      //     cropHeight: img.height,
      //   });
      // }
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [img]);

  const getCrop = (image, size, clipPosition = "center-middle") => {
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;

    let newWidth;
    let newHeight;

    const imageRatio = image.width / image.height;

    if (aspectRatio >= imageRatio) {
      newWidth = image.width;
      newHeight = image.width / aspectRatio;
    } else {
      newWidth = image.height * aspectRatio;
      newHeight = image.height;
    }

    let x = 0;
    let y = 0;
    if (clipPosition === "left-top") {
      x = 0;
      y = 0;
    } else if (clipPosition === "left-middle") {
      x = 0;
      y = (image.height - newHeight) / 2;
    } else if (clipPosition === "left-bottom") {
      x = 0;
      y = image.height - newHeight;
    } else if (clipPosition === "center-top") {
      x = (image.width - newWidth) / 2;
      y = 0;
    } else if (clipPosition === "center-middle") {
      x = (image.width - newWidth) / 2;
      y = (image.height - newHeight) / 2;
    } else if (clipPosition === "center-bottom") {
      x = (image.width - newWidth) / 2;
      y = image.height - newHeight;
    } else if (clipPosition === "right-top") {
      x = image.width - newWidth;
      y = 0;
    } else if (clipPosition === "right-middle") {
      x = image.width - newWidth;
      y = (image.height - newHeight) / 2;
    } else if (clipPosition === "right-bottom") {
      x = image.width - newWidth;
      y = image.height - newHeight;
    } else if (clipPosition === "scale") {
      x = 0;
      y = 0;
      newWidth = width;
      newHeight = height;
    } else {
      console.error(
        new Error("Unknown clip position property - " + clipPosition)
      );
    }

    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    };
  };

  const applyCrop = (pos) => {
    const node = imageRef.current;
    node.setAttr("lastCropUsed", pos);
    const crop = getCrop(
      node.image(),
      { width: node.width(), height: node.height() },
      pos
    );
    node.setAttrs(crop);
    imageRef.current.cache();
  };

  const onTransform = () => {
    const node = imageRef.current;
    const { scaleX, scaleY } = node.getAttrs();
    node.width(node.width() * scaleX);
    node.height(node.height() * scaleY);
    node.scale({ x: 1, y: 1 });
    applyCrop(node.getAttr("lastCropUsed"));
  };
  return (
    <KonvaImage
      ref={imageRef}
      {...omit(props, ["absolutePosition"])}
      image={img}
      filters={filters.map((filter) => get(Konva.Filters, filter))}
      onTransform={onTransform}
    />
  );
};
export default Image;
