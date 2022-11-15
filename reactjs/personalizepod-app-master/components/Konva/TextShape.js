import Konva from "konva";
import { get, omit } from "lodash";
import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const TextShape = (props) => {
  const imageRef = useRef();
  const { _filters, shape } = props;
  const filters = _filters || [];
  const imageUrl = `${process.env.ELEMENT_URL}shape/${shape}?data=${btoa(
    JSON.stringify(
      omit(props, [
        "x",
        "y",
        "draggable",
        "rotation",
        "visible",
        "values",
        "origin",
        "offsetX",
        "offsetY",
        "personalized",
      ])
    )
  )}`;
  const [img, status] = useImage(imageUrl, process.env.APP_URL);

  useEffect(() => {
    if (status === "loaded") {
      const node = imageRef.current;
      node.width(img.width);
      node.height(img.height);
    }
  }, [status]);

  useEffect(() => {
    if (imageRef && imageRef.current && status === "loaded") {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [img, imageRef]);

  const onTransform = () => {
    const node = imageRef.current;
    const width = node.width();
    const height = node.height();
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.width(width * scaleX);
    node.height(height * scaleY);
    node.scale({ x: 1, y: 1 });
    imageRef.current.cache();
  };
  return (
    <KonvaImage
      ref={imageRef}
      {...omit(props, ["fill", "fillPatternImage"])}
      image={img}
      filters={filters.map((filter) => get(Konva.Filters, filter))}
      onTransform={onTransform}
      //onTransformEnd={onTransform}
    />
  );
};
export default TextShape;
