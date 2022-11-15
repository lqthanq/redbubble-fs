import React, { useState } from "react";
import { useAppValue } from "../../context";
import { Button, Collapse, Input, Tooltip, Popover } from "antd";
import { FaImage } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { BiText } from "react-icons/bi";
import MediaSelector from "../Media/MediaSelector";
import { initNewLayer } from "./Utilities/helper";
import { ARTWORK } from "../../actions";
import styled from "styled-components";
import { random, pick } from "lodash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { CaretRightOutlined } from "@ant-design/icons";
import { EditOutlined, FolderOpenFilled } from "@ant-design/icons";
import LayerSettings from "./Form/LayerSettings";
import { RiImageAddFill } from "react-icons/ri";
import ClipartSelector from "components/Clipart/ClipartSelector";
import { ImStackoverflow } from "react-icons/im";
import { MdTextFields } from "react-icons/md";

const Container = styled.div``;

const SortableItem = SortableElement(({ layer, layers }) => {
  const [{ workspace }, dispatch] = useAppValue();
  const { selectedLayers } = workspace;
  const [edit, setEdit] = useState(false);
  const handleOnChange = (key) => {
    if (key) {
      dispatch({
        type: ARTWORK.SET_SELECTED_LAYERS,
        payload: Array.isArray(key) ? key : [key],
      });
    }
  };
  return (
    <li style={{ listStyle: "none" }}>
      <Collapse
        onChange={handleOnChange}
        activeKey={
          selectedLayers.length === 1 &&
          (layers.parents(selectedLayers[0]).includes(layer.id) ||
            selectedLayers[0] === layer.id)
            ? layer.id
            : null
        }
        accordion={true}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Collapse.Panel
          header={
            <span className="layer-title">
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                {((type) => {
                  if (type === "Text") {
                    return <BiText className="layer-icon" />;
                  }
                  if (type === "Group") {
                    return <FolderOpenFilled className="layer-icon" />;
                  }
                  if (type === "Image") {
                    return <FaImage className="layer-icon" />;
                  }
                  if (type === "Option") {
                    return <IoMdOptions className="layer-icon" />;
                  }
                })(layer.type)}

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
          className={layer.type}
        >
          {layer.type === "Group" && (
            <SortableList layers={layer.layers} lockAxis="y" useDragHandle />
          )}
        </Collapse.Panel>
      </Collapse>
    </li>
  );
});

const SortableList = SortableContainer(({ layers }) => (
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
        />
      );
    })}
  </ul>
));

const SharedLayers = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork } = workspace;
  const { sharedLayers } = artwork;
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [showClipartSelector, setShowClipartSelector] = useState(false);
  const addText = () => {
    const newLayer = initNewLayer();
    newLayer.type = "Text";
    newLayer.fontSize = 30;
    newLayer.letterSpacing = 1;
    newLayer.lineHeight = 1;
    newLayer.x = random(10, 100);
    newLayer.y = random(10, 100);
    newLayer.align = "center";
    newLayer.values[0].text = "Your Text";
    newLayer.fontFamily = "fZ2MKQOI9-regular";
    newLayer.title = `Text #${sharedLayers.length + 1}`;
    dispatch({ type: ARTWORK.ADD_LAYER, payload: newLayer });
  };
  const addOption = () => {
    const newLayer = initNewLayer();
    newLayer.type = "Option";
    newLayer.title = `Option #${sharedLayers.length + 1}`;
    newLayer.display_mode = "dropdown";
    newLayer.options = [{ label: "Option 1", value: "option-1" }];
    dispatch({
      type: ARTWORK.ADD_LAYER,
      payload: newLayer,
    });
  };
  const addImage = (file) => {
    setShowMediaSelector(false);
    const newLayer = initNewLayer();
    newLayer.type = "Image";
    newLayer.title = file.fileName;
    newLayer.values = [
      {
        file: file,
        active: true,
      },
    ];
    dispatch({ type: ARTWORK.ADD_LAYER, payload: newLayer });
  };
  const addClipart = (clipart) => {
    const newImageLayer = initNewLayer();
    newImageLayer.type = "Image";
    newImageLayer.values[0].file = pick(clipart.file, ["id", "key"]);
    newImageLayer.values[0].file.categoryID = clipart.category.id;
    //newImageLayer.categoryID = clipart.category.id;
    newImageLayer.title = `Image #${
      sharedLayers.filter((l) => l.type === "Image").length + 1
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
    setShowClipartSelector(false);
  };
  return (
    <Container id="artwork-design-sidebar">
      <SortableList
        layers={sharedLayers}
        lockAxis="y"
        useDragHandle
      ></SortableList>
      <Button.Group
        style={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: "repeat(4,auto)",
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
      </Button.Group>
      <LayerSettings />
      <MediaSelector
        visible={showMediaSelector}
        onCancel={() => setShowMediaSelector(false)}
        onChange={(files) => {
          addImage(files[0]);
        }}
      />
    </Container>
  );
};

export default SharedLayers;
