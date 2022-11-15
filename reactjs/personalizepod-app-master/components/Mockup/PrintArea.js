import React, { useRef } from "react";
import { Label, Text, Tag, Rect, Group } from "react-konva";
const PrintArea = ({
  layer,
  mockup = { width: 1000, height: 1000 },
  onClick = () => {},
}) => {
  console.log(layer);
  const { printArea = { width: 1000, height: 1000 } } = layer;
  const layerRef = useRef();
  const perspectiveRef = useRef();
  const {
    perspectiveEnable,
    perspective = {
      x: 0,
      y: 0,
      width: layer.width,
      height: layer.height,
    },
  } = layer;
  const props = { ...layer };
  const printAreaRatio = printArea.width / printArea.height;
  if (!props.width) {
    props.width = mockup.width;
  }
  props.height = props.width / printAreaRatio;
  const onTransformEnd = (e) => {
    const node = e.currentTarget;
    node.setAttrs({
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
      scale: { x: 1, y: 1 },
    });
    const { x, y, width, height } = node.getAttrs();
    layerRef.current.setAttrs({
      perspective: {
        x,
        y,
        width,
        height,
      },
    });
    layerRef.current.getLayer().dispatchEvent(new Event("update"));
  };
  return (
    <Group
      {...props}
      ref={layerRef}
      onClick={onClick}
      fill="#5c6ac4"
      class="Printarea"
    >
      <Rect
        width={props.width}
        height={props.height}
        fill="#5c6ac4"
        opacity={0.8}
      />
      <Label width={props.width} height={props.height} opacity={0.2}>
        <Tag fill="#5c6ac4" opacity={0.8} />
        <Text
          text={`Printarea\n${layer.printArea.name}`}
          align="center"
          verticalAlign="middle"
          width={props.width}
          height={props.height}
          fontSize={props.width / 8}
          fill={"#f0f000"}
        />
      </Label>
      {perspectiveEnable && (
        <Rect
          {...perspective}
          fill="green"
          opacity={0.8}
          onClick={(e) => {
            if (
              perspectiveRef &&
              perspectiveRef.current &&
              window.perspectiveRef &&
              window.perspectiveRef.current
            ) {
              window.perspectiveRef.current.nodes([perspectiveRef.current]);
            }
          }}
          draggable={true}
          ref={perspectiveRef}
          onDragEnd={onTransformEnd}
          onTransformEnd={onTransformEnd}
          class="perspective"
        />
      )}
    </Group>
  );
};
export default PrintArea;
