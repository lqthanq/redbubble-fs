import { useAppValue } from "../../context";
import { Button, Collapse, Input, Popover, Tooltip } from "antd";
import { cloneDeep, get, random, union, omit, pick } from "lodash";
import arrayMove from "array-move";
import {
  FaRegEyeSlash,
  FaRegEye,
  FaImage,
  FaShareSquare,
} from "react-icons/fa";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import { FaFolderOpen } from "react-icons/fa";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { getIDs, initNewLayer, uniqueID } from "./Utilities/helper";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { BiText, BiMoveVertical } from "react-icons/bi";
import { IoMdOptions } from "react-icons/io";
import MediaSelector from "components/Media/MediaSelector";
import Scrollbars from "react-custom-scrollbars";
import { CaretRightOutlined } from "@ant-design/icons";
import LayerSettings from "./Form/LayerSettings";
import SharedLayerSelector from "components/Konva/SharedLayerSelector";
import { ARTWORK } from "../../actions";
import { RiImageAddFill } from "react-icons/ri";
import { ImStackoverflow } from "react-icons/im";
import { MdTextFields } from "react-icons/md";
import ClipartSelector from "components/Clipart/ClipartSelector";

const DragHandle = SortableHandle(() => (
  <BiMoveVertical className="anticon" style={{ fontSize: 15 }} />
));

const layerExtra = (layer) => {
  const [{ workspace }, dispatch] = useAppValue();
  const { selectedLayers } = workspace;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="action-icons"
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
        marginTop: 4,
        fontSize: 13,
      }}
    >
      <DragHandle />
      {layer.type !== "Option" && (
        <span
          style={{ display: "inline-flex" }}
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              type: ARTWORK.SET_LAYER,
              payload: { ...layer, lock: !layer.lock },
            });
          }}
        >
          {layer.lock === false ? (
            <TiLockOpen className="anticon" />
          ) : (
            <TiLockClosed className="anticon" />
          )}
        </span>
      )}
      {layer.type !== "Option" && (
        <span
          style={{ display: "inline-flex" }}
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              type: ARTWORK.SET_LAYER,
              payload: { ...layer, visible: !layer.visible },
            });
            // dispatch({
            //   type: ARTWORK.SET_SELECTED_LAYERS,
            //   payload: selectedLayers.filter((id) => id !== layer.id),
            // });
          }}
        >
          {layer.visible === false ? (
            <FaRegEyeSlash className="anticon" />
          ) : (
            <FaRegEye className="anticon" />
          )}
        </span>
      )}
    </div>
  );
};

const SortableItem = SortableElement(
  ({ layer, layers, onChange, layerExtra }) => {
    const [{ workspace }, dispatch] = useAppValue();
    const { selectedLayers, ctrl } = workspace;
    const [edit, setEdit] = useState(false);
    const onLayerSelect = (key) => {
      if (key) {
        if (ctrl) {
          dispatch({
            type: ARTWORK.SET_SELECTED_LAYERS,
            payload: union([...selectedLayers, key]),
          });
        } else {
          dispatch({
            type: ARTWORK.SET_SELECTED_LAYERS,
            payload: key ? [key] : layer.parent ? [layer.parent] : [],
          });
        }
      }
    };
    const onSortEnd = ({ oldIndex, newIndex }) => {
      dispatch({
        type: ARTWORK.SET_LAYER,
        payload: {
          ...layer,
          layers: arrayMove(
            layer.layers,
            layer.layers.length - oldIndex - 1,
            layer.layers.length - newIndex - 1
          ),
        },
      });
    };
    return (
      <li style={{ listStyle: "none" }} key={layer.id}>
        <Collapse
          accordion={true}
          activeKey={
            selectedLayers.length >= 1 &&
            selectedLayers.find((id) => getIDs(layers, id).includes(layer.id))
              ? layer.id
              : null
          }
          onChange={onLayerSelect}
          expandIconPosition={"left"}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Collapse.Panel
            showArrow={layer.type === "Group"}
            header={
              <span
                className="layer-title"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerSelect(layer.id);
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  {(({ type, shared_layer_id }) => {
                    if (shared_layer_id) {
                      return <FaShareSquare className="layer-icon" />;
                    }
                    if (type === "Text") {
                      return <BiText className="layer-icon" />;
                    }
                    if (type === "Group") {
                      return <FaFolderOpen className="layer-icon" />;
                    }
                    if (type === "Image") {
                      return <FaImage className="layer-icon" />;
                    }
                    if (type === "Option") {
                      return <IoMdOptions className="layer-icon" />;
                    }
                  })(layer)}

                  {edit ? (
                    <Input
                      size="small"
                      value={layer.title || `Layer ${layer.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      autoFocus={true}
                      onPressEnter={() => {
                        setEdit(false);
                      }}
                      onChange={(e) => {
                        dispatch({
                          type: ARTWORK.SET_LAYER,
                          payload: { ...layer, title: e.target.value },
                        });
                      }}
                      onBlur={() => setEdit(false)}
                    />
                  ) : (
                    <>
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEdit(true);
                        }}
                      >
                        {layer.title || `Layer ${layer.id}`}
                      </span>{" "}
                      <EditOutlined
                        className="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEdit(true);
                        }}
                      />
                    </>
                  )}
                </span>
              </span>
            }
            key={layer.id}
            extra={layerExtra(layer, onChange)}
            className={`${layer.type} ${
              layer.shared_layer_id ? "shared-layer" : ""
            }`}
          >
            {(() => {
              if (layer.type === "Group" && !layer.shared_layer_id) {
                return (
                  <div>
                    <SortableList
                      layers={layer.layers}
                      selectedLayers={selectedLayers}
                      lockAxis="y"
                      useDragHandle
                      onSortEnd={onSortEnd}
                      onChange={onChange}
                      layerExtra={layerExtra}
                      helperClass="draging"
                      helperContainer={
                        document.getElementsByClassName("layer-list")[0]
                      }
                    />
                  </div>
                );
              }
              return null;
            })()}
          </Collapse.Panel>
        </Collapse>
      </li>
    );
  }
);

const SortableList = SortableContainer(({ layers, layerExtra }) => (
  <ul className="layer-list">
    {layers.map((_, index) => {
      var idx = layers.length - index - 1;
      var layer = layers[idx];
      return (
        <SortableItem
          key={layer.id}
          index={index}
          layer={layer}
          layers={layers}
          layerExtra={layerExtra}
        />
      );
    })}
  </ul>
));

const Layers = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const [showClipartSelector, setShowClipartSelector] = useState(false);
  const { artwork, selectedTemplate, selectedLayers } = workspace;
  const layers =
    get(artwork, `templates[${selectedTemplate}].layers`, []) || [];
  const onSortEnd = ({ oldIndex, newIndex }) => {
    dispatch({
      type: ARTWORK.SET_LAYERS,
      payload: arrayMove(
        layers,
        layers.length - oldIndex - 1,
        layers.length - newIndex - 1
      ),
    });
  };

  const [showMediaSelector, setShowMediaSelector] = useState(false);

  const addText = (e) => {
    e.preventDefault();
    const newTextLayer = initNewLayer();
    newTextLayer.type = "Text";
    newTextLayer.fontSize = 30;
    newTextLayer.letterSpacing = 1;
    newTextLayer.lineHeight = 1;
    newTextLayer.x = random(10, 100);
    newTextLayer.y = random(10, 100);
    newTextLayer.align = "left";
    newTextLayer.values[0].text = "Your Text";
    newTextLayer.fontFamily = "fZ2MKQOI9-regular";
    newTextLayer.fill = "#000";
    newTextLayer.title = `Text #${
      layers.filter((l) => l.type === "Text").length + 1
    }`;
    dispatch({
      type: ARTWORK.ADD_LAYER,
      payload: newTextLayer,
    });
  };

  const addOption = (e) => {
    e.preventDefault();
    const newOptionLayer = initNewLayer();
    newOptionLayer.type = "Option";
    newOptionLayer.title = `Option #${
      layers.filter((l) => l.type === "Option").length + 1
    }`;
    newOptionLayer.display_mode = "dropdown";
    newOptionLayer.options = [{ label: "Option 1", value: "option-1" }];
    dispatch({
      type: ARTWORK.ADD_LAYER,
      payload: newOptionLayer,
    });
  };

  const addImage = (file) => {
    setShowMediaSelector(false);
    const newImageLayer = initNewLayer();
    newImageLayer.type = "Image";
    newImageLayer.values[0].file = pick(file, ["id", "key"]);
    newImageLayer.title = `Image #${
      layers.filter((l) => l.type === "Image").length + 1
    }`;
    dispatch({
      type: ARTWORK.ADD_LAYER,
      payload: newImageLayer,
    });
  };

  const addClipart = (clipart) => {
    setShowClipartSelector(false);
    const newImageLayer = initNewLayer();
    newImageLayer.type = "Image";
    newImageLayer.values[0].file = pick(clipart.file, ["id", "key"]);
    newImageLayer.values[0].file.categoryID = clipart.category.id;
    //newImageLayer.categoryID = clipart.category.id;
    newImageLayer.title = `Image #${
      layers.filter((l) => l.type === "Image").length + 1
    }`;
    newImageLayer.personalized = {
      enable: true,
      type: "clipartCategory",
      clipartCategory: clipart.category.id,
    };
    dispatch({
      type: ARTWORK.ADD_LAYER,
      payload: newImageLayer,
    });
  };

  const addSharedLayer = (l) => {
    const newLayer = cloneDeep(l);
    newLayer.id = uniqueID();
    newLayer.shared_layer_id = l.id;
    dispatch({
      type: ARTWORK.ADD_LAYER,
      payload: newLayer,
    });
  };

  const [offsetTop, setOffsetTop] = useState(0);
  const containerRef = useRef();
  useEffect(() => {
    if (containerRef && containerRef.current) {
      setOffsetTop(containerRef.current.getBoundingClientRect().top);
    }
  }, [containerRef]);
  return (
    <div id="artwork-design-sidebar" ref={containerRef}>
      <Scrollbars autoHeight autoHeightMax={`calc(100vh - ${offsetTop}px)`}>
        <SortableList
          layers={layers}
          lockAxis="y"
          useDragHandle
          onSortEnd={onSortEnd}
          layerExtra={layerExtra}
          helperClass="draging"
          helperContainer={document.getElementsByClassName("layer-list")[0]}
        />
        <Button.Group
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(5,auto)",
            borderRadius: 0,
          }}
        >
          <Tooltip title="Add Image">
            <Button
              style={{ width: "100%", borderRadius: 0, borderLeftWidth: 0 }}
              icon={<RiImageAddFill className="anticon" />}
              onClick={() => setShowMediaSelector(true)}
            />
          </Tooltip>
          <Tooltip title="Add Clipart">
            <Popover
              placement="bottom"
              trigger="click"
              visible={showClipartSelector}
              onVisibleChange={(v) => setShowClipartSelector(v)}
              content={
                <ClipartSelector
                  style={{ width: 355 }}
                  onSelect={(clipart) => addClipart(clipart)}
                />
              }
            >
              <Button
                style={{ width: "100%" }}
                icon={<ImStackoverflow className="anticon" />}
              />
            </Popover>
          </Tooltip>
          <Tooltip title="Add Option">
            <Button
              style={{ width: "100%" }}
              icon={<IoMdOptions className="anticon" />}
              onClick={addOption}
            />
          </Tooltip>
          <Tooltip title="Add Text">
            <Button
              style={{ width: "100%" }}
              icon={<MdTextFields className="anticon" />}
              onClick={addText}
            />
          </Tooltip>
          <Tooltip title="Add Shared Layer">
            <Popover
              placement="bottom"
              content={<SharedLayerSelector onSelect={addSharedLayer} />}
            >
              <Button
                icon={<FaShareSquare className="anticon" />}
                style={{ width: "100%", borderRadius: 0, borderRightWidth: 0 }}
              />
            </Popover>
          </Tooltip>
        </Button.Group>
        <LayerSettings />
        <MediaSelector
          visible={showMediaSelector}
          onCancel={() => setShowMediaSelector(false)}
          onChange={(files) => addImage(files[0])}
        />
        {/* <pre>
          {selectedLayers.length === 1 &&
            JSON.stringify(layers.search(selectedLayers[0]), null, 2)}
        </pre> */}
      </Scrollbars>
    </div>
  );
};

export default Layers;
