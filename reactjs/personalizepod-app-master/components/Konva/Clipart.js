import Konva from "konva";
import { get } from "lodash";
import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const Clipart = (props) => {
  const imageRef = useRef();
  const { id, onSelect, clipart, _filters, groupId, ratio } = props;
  const filters = _filters || [];
  const [img] = useImage(
    process.env.CDN_URL + `${ratio * 10}10xauto/` + clipart.url,
    "http://localhost:3000"
  );
  useEffect(() => {
    if (img) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [img]);
  return (
    <KonvaImage
      ref={imageRef}
      {...props}
      image={img}
      onClick={() => onSelect(groupId || id)}
      onTap={() => onSelect(groupId || id)}
      onDblClick={() => onSelect(id)}
      filters={filters.map((filter) => get(Konva.Filters, filter))}
    />
  );
};
export default Clipart;
