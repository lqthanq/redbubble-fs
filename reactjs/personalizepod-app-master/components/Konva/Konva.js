import {
  debounce,
  get,
  intersection,
  isEqual,
  omit,
  pick,
  remove,
} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage, Rect } from "react-konva";
import styled from "styled-components";
import { useAppValue } from "../../context";
import Group from "./Group";
import Transformer from "./Transformer";
import { ARTWORK } from "../../actions";
import { useHotkeys } from "react-hotkeys-hook";
import hotkeys from "hotkeys-js";
import { cloneLayer } from "./Utilities/helper";
import useFont from "../../hooks/Font";
import { Button, Popover } from "antd";
import { SketchPicker } from "react-color";
import { IoMdColorPalette } from "react-icons/io";
import { IoMdGrid } from "react-icons/io";
const Container = styled.div`
  position: relative;
  padding: 0 20px;
  .konvajs-content {
    margin: 20px auto;
    canvas {
      background-color: ${(props) => props.bgColor}!important;
      background-image: ${(props) =>
        props.showGrid ? "url(/grid.svg)" : "transparent"} !important;
      background-position: top center !important;
      border: 1px solid #f5f5f5;
    }
  }
`;
const getData = (node, zoom) => {
  var originData = node.getAttr("origin");
  var data = {
    ...omit(node.getAttrs(), [
      "draggable",
      "listening",
      "selectedLayers",
      "text",
      "active",
      "file",
      "name",
      "image",
      "fill",
      "origin",
      "fillPatternImage",
      "sharedLayers",
      "absolutePosition",
    ]),
    width: node.width(),
    height: node.height(),
    fill: originData?.fill,
  };
  if (
    originData.personalized &&
    originData.personalized.enable &&
    originData.personalized.type === "shared-layer"
  ) {
    data = {
      ...data,
      ...omit(originData, ["id", "x", "y", "visible", "absolutePosition"]),
    };
  }
  if (node.getClassName() === "Group") {
    var children = node.getChildren((node) => node.getAttr("id"));
    data.layers = children.map((child) => getData(child, zoom));
  }
  var categoryID = get(data, "personalized.default.file.categoryID");
  if (
    originData.personalized &&
    originData.personalized.enable &&
    originData.personalized.type === "clipartCategory" &&
    categoryID
  ) {
    data.custom = { ...(data.custom || {}) };
    data.custom[categoryID] = pick(data, [
      "x",
      "y",
      "width",
      "height",
      "scaleX",
      "scaleY",
      "cropWidth",
      "cropHeight",
      "cropX",
      "cropY",
      "rotation",
    ]);
    var absolutePosition = node.absolutePosition();
    if (absolutePosition) {
      data.custom[categoryID].absolutePosition = {
        x: absolutePosition.x / zoom,
        y: absolutePosition.y / zoom,
      };
    }
  }
  return omit(data, "absolutePosition");
};
const deleteLayer = (layers, ids) => {
  if (remove(layers, (layer) => ids.includes(layer.id)).length < ids.length) {
    layers.forEach((layer, index) => {
      if (layer.layers && layer.layers.length) {
        deleteLayer(layers[index].layers, ids);
      }
    });
  }
};
const Konva = (props) => {
  const stageRef = useRef();
  const rectRef = useRef();
  const [bgColor, setBgColor] = useState("hsl(0, 0%, 90%)");
  const [showGrid, setShowGrid] = useState(false);
  const [{ workspace }, dispatch] = useAppValue();
  const { zoom } = props;
  const {
    artwork,
    selectedTemplate,
    selectedLayers,
    clipboard,
    ctrl,
  } = workspace;
  const { sharedLayers = [] } = artwork;
  const layers = useMemo(() => {
    return selectedTemplate === -1
      ? sharedLayers
      : get(artwork, `templates[${selectedTemplate}].layers`) || [];
  }, [artwork, selectedTemplate]);
  useFont("fZ2MKQOI9-regular");
  const layerRef = useRef();
  useEffect(() => {
    dispatch({ type: ARTWORK.SET_SELECTED_LAYERS, payload: [] });
  }, [selectedTemplate]);

  useEffect(() => {
    if (layerRef && layerRef.current) {
      window.layerRef = layerRef;
    }
  }, [selectedLayers, layers.length]);

  const onLayerSelect = (id) => {
    if (ctrl) {
      // Check if selectedLayers is contain parent of id
      for (let i = 0; i < selectedLayers.length; i++) {
        if (layers.parents(selectedLayers[i]).includes(id)) {
          return;
        }
      }
      if (intersection(selectedLayers, layers.parents(id)).length === 0) {
        dispatch({
          type: ARTWORK.SET_SELECTED_LAYERS,
          payload: [...selectedLayers, id],
        });
      }
    } else {
      dispatch({
        type: ARTWORK.SET_SELECTED_LAYERS,
        payload: [id],
      });
    }
  };

  const onUpdate = () => {
    const nodes = layerRef.current
      .getChildren((node) => {
        return node.getAttr("id");
      })
      .map((node) => ({
        ...getData(node, zoom),
      }));
    dispatch({
      type: ARTWORK.SET_LAYERS,
      payload: nodes,
    });
  };

  // Hotkeys
  useHotkeys(
    "*",
    (e) => {
      var type = e.type;
      var keyCodes = hotkeys.getPressedKeyCodes().sort();
      if (isEqual(keyCodes, [27])) {
        dispatch({
          type: ARTWORK.SET_SELECTED_LAYERS,
          payload: [],
        });
      }
      if (hotkeys.cmd || hotkeys.command || hotkeys.ctrl) {
        dispatch({
          type: ARTWORK.SET_CTRL,
          payload: e.type === "keydown",
        });
        //setCtr(e.type === "keydown");
      }
      //select all layers
      if (isEqual(keyCodes, [65, 91]) || isEqual(keyCodes, [17, 65])) {
        dispatch({
          type: ARTWORK.SET_SELECTED_LAYERS,
          payload: layers
            .filter((layer) => {
              return layer.type !== "Option";
            })
            .map((l) => l.id),
        });
        return;
      }
      //copy to clipboard
      if (isEqual(keyCodes, [67, 91]) || isEqual(keyCodes, [17, 67])) {
        dispatch({
          type: ARTWORK.SET_CLIPBOARD,
          payload: selectedLayers.map((id) => layers.search(id)),
        });
      }
      //cut to clipboard
      if (isEqual(keyCodes, [88, 91]) || isEqual(keyCodes, [17, 88])) {
        dispatch({
          type: ARTWORK.SET_CLIPBOARD,
          payload: selectedLayers.map((id) => layers.search(id)),
        });
        deleteLayer(layers, selectedLayers);
        dispatch({
          type: ARTWORK.SET_LAYERS,
          payload: layers,
        });
        dispatch({
          type: ARTWORK.SET_SELECTED_LAYERS,
          payload: [],
        });
        return;
      }
      //paste from clipboard
      if (isEqual(keyCodes, [86, 91]) || isEqual(keyCodes, [17, 86])) {
        if (Array.isArray(clipboard)) {
          var newLayers = [];
          clipboard.forEach((l) => {
            var _l = cloneLayer(l);
            _l.title = `Copy of ${l.title || l.id}`;
            _l.parent = null;
            //_l.x = l.x + 10;
            //_l.y = l.y + 10;
            newLayers.push(_l);
          });
          dispatch({
            type: ARTWORK.ADD_LAYER,
            payload: newLayers,
          });
          // dispatch({
          //   type: ARTWORK.SET_SELECTED_LAYERS,
          //   payload: newLayers.map((l) => l.id),
          // });
        }
        return;
      }
      //delete selected layers
      if (
        type === "keydown" &&
        (isEqual(keyCodes, [8]) || isEqual(keyCodes, [46]))
      ) {
        e.preventDefault();
        var parentID = null;
        selectedLayers.forEach((id) => {
          var l = layers.search(id);
          if (l && l.parent) {
            parentID = l.parent;
          }
        });
        dispatch({
          type: ARTWORK.SET_SELECTED_LAYERS,
          payload: parentID ? [parentID] : [],
        });
        deleteLayer(layers, selectedLayers);
        dispatch({
          type: ARTWORK.SET_LAYERS,
          payload: layers,
        });
        return;
      }
      //Undo
      if (isEqual(keyCodes, [90, 91]) || isEqual(keyCodes, [17, 90])) {
        dispatch({
          type: ARTWORK.UNDO,
        });
      }
    },
    { keyup: true, keydown: true },
    [layers, selectedLayers, clipboard]
  );

  return (
    <Container bgColor={bgColor} showGrid={showGrid}>
      <Stage
        {...props}
        ref={stageRef}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
      >
        {/* Attach layers data to attrs */}
        <Layer ref={layerRef} layers={layers} onUpdate={onUpdate}>
          <Group
            layers={layers}
            sharedLayers={sharedLayers}
            data={null}
            selectedLayers={selectedLayers}
            onLayerSelect={onLayerSelect}
            onSelect={onLayerSelect}
            onClick={() => onLayerSelect(layer.id)}
            ratio={props.ratio}
            zoom={zoom}
          />
          <Rect ref={rectRef} fill="rgba(0,0,255,0.5)" visible={false} />
          <Transformer
            selectedLayers={selectedLayers}
            onTransformEnd={onUpdate}
            onDragMove={debounce(onUpdate, 200)}
          />
        </Layer>
      </Stage>
      {/* <Stage
        {...props}
        ref={stageRef2}
        style={{ transform: "scale(0)", display: "none" }}
      >
        <Layer layers={layers} onUpdate={onUpdate}>
          <Group
            layers={layers}
            sharedLayers={sharedLayers}
            data={null}
            selectedLayers={selectedLayers}
            onLayerSelect={() => {}}
            onSelect={() => {}}
            onClick={() => {}}
            ratio={props.ratio}
            zoom={zoom}
          />
        </Layer>
      </Stage> */}
      <div style={{ right: 430, bottom: 30, position: "fixed" }}>
        <Button.Group>
          <Popover
            content={
              <SketchPicker
                color={bgColor}
                onChange={({ hex, rgb }) => setBgColor(hex)}
                disableAlpha
                className="no-shadow"
                styles={{ boxShadow: "none" }}
              />
            }
          >
            <Button
              icon={
                <IoMdColorPalette
                  className="anticon"
                  style={{ fontSize: 25 }}
                />
              }
            />
          </Popover>
          <Button
            onClick={() => setShowGrid(!showGrid)}
            type={showGrid ? "primary" : "default"}
            icon={<IoMdGrid className="anticon" style={{ fontSize: 26 }} />}
          />
        </Button.Group>
      </div>
    </Container>
  );
};
export default Konva;
