import { Transformer as KonvaTransformer, Image } from "react-konva";
import { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { debounce, get, random } from "lodash";
import { useHotkeys } from "react-hotkeys-hook";
import useImage from "use-image";

const triggerUpdate = debounce(() => {
  window.trRef.current.getLayer().batchDraw();
  window.trRef.current.getLayer().dispatchEvent(new Event("update"));
}, 300);

const Transformer = ({
  selectedLayers,
  onTransformEnd = () => {},
  onDragMove = () => {},
}) => {
  const [reloadIcon] = useImage("/reload.png");
  const [recheckNodes, setRecheckNodes] = useState(false);
  const trRef = useRef();
  const selectedNodes = useMemo(() => {
    if (trRef && trRef.current) {
      const stage = trRef.current.getStage();
      return stage.find((n) => {
        return selectedLayers.includes(n.getAttr("id")) && n.visible();
      });
    }
    return new Konva.Collection();
  }, [selectedLayers, trRef, recheckNodes]);

  useEffect(() => {
    setTimeout(() => {
      setRecheckNodes(random());
    }, 200);
  }, [selectedLayers]);

  useEffect(() => {
    window.selectedNodes = selectedNodes;
  }, [selectedNodes]);
  // Hotkeys
  useHotkeys(
    "*",
    (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
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
        triggerUpdate();
      }
    },
    { keydown: true },
    []
  );
  const isLooked = selectedNodes.some((node) => node.getAttr("lock") === true);
  const isText =
    selectedNodes.length === 1 &&
    selectedNodes.some((node) => node.getClassName() === "Text");
  const isAutoFit = isText && selectedNodes[0].getAttr("autofit");
  const isImage =
    selectedNodes.length === 1 &&
    selectedNodes.some((node) => node.getClassName() === "Image");
  const isSharedLayer = useMemo(() => {
    return (
      selectedNodes.length === 1 &&
      get(selectedNodes[0].getAttr("origin"), "shared_layer_id")
    );
  }, [selectedNodes]);

  useEffect(() => {
    window.trRef = trRef;
    if (trRef && trRef.current && selectedNodes) {
      trRef.current.getLayer().find(".overlay").destroy();
      trRef.current.nodes(selectedNodes);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedLayers, selectedNodes]);

  const enabledAnchors = useMemo(() => {
    if (isLooked) {
      return [];
    }
    if (isSharedLayer) {
      return [];
    }
    if (isAutoFit) {
      return ["bottom-center", "middle-right", "middle-left"];
    }
    if (isText) {
      return ["middle-right", "middle-left", "bottom-center"];
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
    <KonvaTransformer
      onMouseEnter={() => {
        setRecheckNodes(true);
      }}
      onMouseLeave={() => setRecheckNodes(false)}
      ref={trRef}
      onTransformEnd={onTransformEnd}
      onDragMove={onDragMove}
      enabledAnchors={enabledAnchors}
      rotateEnabled={!isLooked}
      draggable={!isLooked}
      borderStrokeWidth={1}
      shouldOverdrawWholeArea={true}
      onDragEnd={() => {
        window.trRef.current.getLayer().batchDraw();
        window.trRef.current.getLayer().dispatchEvent(new Event("update"));
      }}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 1) {
          return oldBox;
        }
        return newBox;
      }}
    >
      {isImage && (
        <Image
          onClick={() => {
            selectedNodes.each((node) => {
              node.setAttrs({
                width: node.image().width,
                height: node.image().height,
                cropWidth: node.image().width,
                cropHeight: node.image().height,
                cropX: 0,
                cropY: 0,
              });
              node.getLayer().batchDraw();
              node.getLayer().dispatchEvent(new Event("update"));
            });
          }}
          x={0}
          y={-20}
          image={reloadIcon}
          onMouseEnter={function () {
            this.setAttr("opacity", 1);
            this.getStage().getContainer().style.cursor = "pointer";
          }}
          onMouseLeave={function () {
            this.setAttr("opacity", 0.5);
            this.getStage().getContainer().style.cursor = "default";
          }}
        />
      )}
    </KonvaTransformer>
  );
};

export default Transformer;
