import { useAppValue } from "context";
import React, { useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Transformer as KonvaTransformer,
} from "react-konva";
import Group from "./Group";
import Transformer from "./Transformer";
import { debounce, omit, isEqual, remove, intersection, pick } from "lodash";
import { useRef } from "react";
import { MOCKUP } from "actions";
import { useHotkeys } from "react-hotkeys-hook";
import { cloneLayer } from "./helper";
import { min } from "moment";

const MainDesign = ({ zoom = 1 }) => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockup, selectedLayers, clipboard, ctrl } = mockupWorkspace;
  const { layers } = mockup;
  const mockupLayerRef = useRef();
  useEffect(() => {
    window.layerRefs = window.layerRefs || {};
    window.layerRefs[mockup.id] = mockupLayerRef;
    window.mockupLayerRef = mockupLayerRef;
  }, [mockupLayerRef]);

  const deleteLayer = (layers, ids) => {
    if (remove(layers, (layer) => ids.includes(layer.id)).length < ids.length) {
      layers.forEach((layer, index) => {
        if (layer.layers && layer.layers.length) {
          deleteLayer(layers[index].layers, ids);
        }
      });
    }
  };

  useHotkeys(
    "*",
    (e) => {
      var keyCodes = hotkeys.getPressedKeyCodes().sort();
      if (isEqual(keyCodes, [27])) {
        dispatch({
          type: MOCKUP.SET_SELECTED_LAYERS,
          payload: [],
        });
      }
      if (hotkeys.cmd || hotkeys.command || hotkeys.ctrl) {
        dispatch({
          type: MOCKUP.SET_CTRL,
          payload: e.type === "keydown",
        });
        //setCtr(e.type === "keydown");
      }
      //select all layers
      if (isEqual(keyCodes, [65, 91]) || isEqual(keyCodes, [17, 65])) {
        dispatch({
          type: MOCKUP.SET_SELECTED_LAYERS,
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
          type: MOCKUP.SET_CLIPBOARD,
          payload: selectedLayers.map((id) => layers.search(id)),
        });
      }
      //cut to clipboard
      if (isEqual(keyCodes, [88, 91]) || isEqual(keyCodes, [17, 88])) {
        dispatch({
          type: MOCKUP.SET_CLIPBOARD,
          payload: selectedLayers.map((id) => layers.search(id)),
        });
        deleteLayer(layers, selectedLayers);
        dispatch({
          type: MOCKUP.SET_LAYERS,
          payload: layers,
        });
        dispatch({
          type: MOCKUP.SET_SELECTED_LAYERS,
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
            _l.x = _l.x + 10;
            _l.y = _l.y + 10;
            _l.title = `Copy of ${l.title || l.id}`;
            _l.parent = null;
            newLayers.push(_l);
          });
          dispatch({
            type: MOCKUP.SET_LAYERS,
            payload: [...layers, ...newLayers],
          });
          dispatch({
            type: MOCKUP.SET_SELECTED_LAYERS,
            payload: newLayers.map((l) => l.id),
          });
        }
        return;
      }
      //delete selected layers
      if (isEqual(keyCodes, [8]) || isEqual(keyCodes, [46])) {
        e.preventDefault();
        deleteLayer(layers, selectedLayers);
        dispatch({
          type: MOCKUP.SET_LAYERS,
          payload: layers,
        });
        dispatch({
          type: MOCKUP.SET_SELECTED_LAYERS,
          payload: [],
        });
        return;
      }
      //Undo
      // if (isEqual(keyCodes, [90, 91]) || isEqual(keyCodes, [17, 90])) {
      //   dispatch({
      //     type: ARTWORK.UNDO,
      //   });
      // }
    },
    { keyup: true, keydown: true },
    [layers, selectedLayers, clipboard]
  );
  const getData = (node) => {
    var data = {
      ...omit(node.getAttrs(), [
        "draggable",
        "listening",
        "selectedLayers",
        "text",
        "active",
        "name",
        "image",
        "fill",
        "origin",
        "fillPatternImage",
      ]),
      width: node.width(),
      height: node.height(),
      fill: node.getAttr("origin")?.fill,
    };
    if (node.getClassName() === "Group") {
      var children = node.getChildren((node) => node.getAttr("id"));
      data.layers = children.map((child) => getData(child));
    }
    return data;
  };

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
          type: MOCKUP.SET_SELECTED_LAYERS,
          payload: [...selectedLayers, id],
        });
      }
    } else {
      dispatch({
        type: MOCKUP.SET_SELECTED_LAYERS,
        payload: [id],
      });
    }
  };

  const onUpdate = () => {
    const nodes = mockupLayerRef.current
      .getChildren((node) => {
        return node.getAttr("id");
      })
      .map((node) => ({
        ...getData(node),
      }));
    dispatch({
      type: MOCKUP.SET_LAYERS,
      payload: nodes,
    });
  };

  const ratio = mockup.width <= 800 ? 1 : 800 / mockup.width;
  return (
    <div style={{ height: "fit-content" }}>
      <Stage
        width={mockup.width * ratio * zoom}
        height={mockup.height * ratio * zoom}
        scale={{ x: ratio * zoom, y: ratio * zoom }}
      >
        {mockup.isRender ? (
          <Layer ref={mockupLayerRef} onUpdate={onUpdate}>
            <Rect
              x={0}
              y={0}
              width={mockup.width}
              height={mockup.height}
              fill={mockup.settings?.defaultBgColor}
            />
            <Group
              layer={{ layers: layers, type: null }}
              onLayerSelect={onLayerSelect}
              selectedLayers={selectedLayers}
              mockup={pick(mockup, ["width", "height"])}
            />
            <Transformer
              selectedLayers={selectedLayers}
              onTransformEnd={onUpdate}
              onDragMove={debounce(onUpdate, 200)}
            />
            {/* <KonvaTransformer
              ref={perspectiveRef}
              shouldOverdrawWholeArea={true}
              rotateEnabled={false}
              // onClick={(e) => {
              //   //console.log(e.currentTarget.nodes());
              // }}
              draggable={true}
              dragBoundFunc={function (pos) {
                return { x: 1, y: 1 };
                // //console.log(this, pos, e, b);
                // const { x, y } = this.nodes()[0].parent.getAttrs();
                // //console.log(max([x, pos.x]), max([y, pos.y]));
                // return {
                //   //x: max([x, pos.x]),
                //   //y: max([y, pos.y]),
                //   x: pos.x,
                //   y: 100, //this.absolutePosition().y,
                // };
              }}
            /> */}
          </Layer>
        ) : (
          <Layer ref={mockupLayerRef}>
            <Rect
              x={0}
              y={0}
              width={mockup.width}
              height={mockup.height}
              fill={mockup.settings?.defaultBgColor}
            />
            <Group
              layer={{ layers: layers, type: null }}
              onLayerSelect={() => {}}
              selectedLayers={selectedLayers}
            />
          </Layer>
        )}
      </Stage>
    </div>
  );
};

export default MainDesign;
