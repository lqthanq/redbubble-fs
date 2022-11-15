import { Transformer as KonvaTransformer } from "react-konva";
import { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";

const Transformer = ({
  selectedLayers,
  onTransformEnd = () => {},
  onDragMove = () => {},
}) => {
  const [recheckNodes, setRecheckNodes] = useState(false);
  const trRef = useRef();
  const perspectiveRef = useRef();
  const selectedNodes = useMemo(() => {
    if (trRef && trRef.current) {
      const stage = trRef.current.getStage();
      return stage.find(
        (n) => selectedLayers.includes(n.getAttr("id")) && n.visible()
      );
    }
    return new Konva.Collection();
  }, [selectedLayers, trRef, recheckNodes]);

  useEffect(() => {
    window.selectedNodes = selectedNodes;
  }, [selectedNodes]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) === false &&
        ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(e.key) &&
        window.trRef &&
        window.trRef.current &&
        window.selectedNodes &&
        window.selectedNodes.filter((node) => node.getAttr("lock") !== true)
          .length > 0
      ) {
        e.preventDefault();
        e.stopPropagation();
        switch (e.key) {
          case "ArrowUp":
            window.selectedNodes
              .filter((node) => !node.lock)
              .forEach((node) => node.y(node.y() - 1));
            break;
          case "ArrowDown":
            window.selectedNodes
              .filter((node) => !node.lock)
              .forEach((node) => node.y(node.y() + 1));
            break;
          case "ArrowLeft":
            window.selectedNodes
              .filter((node) => !node.lock)
              .forEach((node) => node.x(node.x() - 1));
            break;
          case "ArrowRight":
            window.selectedNodes
              .filter((node) => !node.lock)
              .forEach((node) => node.x(node.x() + 1));
            break;
          default:
            break;
        }
        window.trRef.current.getLayer().batchDraw();
        window.trRef.current.getLayer().dispatchEvent(new Event("update"));
      }
    });
  }, []);

  const isLooked = selectedNodes.some((node) => node.getAttr("lock") === true);
  const isText =
    selectedNodes.length === 1 &&
    selectedNodes.some((node) => node.getClassName() === "Text");
  const isPrintArea =
    selectedNodes.length === 1 &&
    selectedNodes.some((node) => typeof node.getAttr("printArea") === "object");

  useEffect(() => {
    window.trRef = trRef;
    if (trRef && trRef.current && selectedNodes) {
      trRef.current.getLayer().find(".overlay").destroy();
      trRef.current.nodes(selectedNodes);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedLayers, selectedNodes]);

  useEffect(() => {
    if (perspectiveRef && perspectiveRef.current && isPrintArea) {
      perspectiveRef.current.nodes(
        selectedNodes[0].find((n) => n.getAttr("class") === "perspective")
      );
      perspectiveRef.current.getLayer().batchDraw();
    }
  }, [selectedNodes, isPrintArea, perspectiveRef]);

  const enabledAnchors = useMemo(() => {
    if (isLooked) {
      return [];
    }
    if (isPrintArea) {
      return ["top-left", "top-right", "bottom-left", "bottom-right"];
    }
    if (isText) {
      return ["middle-right", "middle-left"];
    }
    return [
      "top-left",
      "top-center",
      "top-right",
      "middle-right",
      "middle-left",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
  }, [selectedLayers, isText]);
  return (
    <>
      <KonvaTransformer
        onMouseEnter={() => setRecheckNodes(true)}
        onMouseLeave={() => setRecheckNodes(false)}
        ref={trRef}
        onTransformEnd={onTransformEnd}
        onDragMove={onDragMove}
        enabledAnchors={enabledAnchors}
        rotateEnabled={!isLooked}
        draggable={!isLooked}
        rotateAnchorOffset={50}
        rotateAnchorCursor="pointer"
        anchorCornerRadius={2}
        //rotationDeg={120}
        rotateAnchorOffset={50}
        //shouldOverdrawWholeArea={true}
        //shouldOverdrawWholeArea={true}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 1) {
            return oldBox;
          }
          return newBox;
        }}
        //rotationSnaps={[1, 1]}
      />
      {isPrintArea && (
        <KonvaTransformer
          ref={perspectiveRef}
          shouldOverdrawWholeArea={true}
          rotateEnabled={false}
        />
      )}
    </>
  );
};

export default Transformer;
