import React, { useState } from "react";
import { MOCKUP } from "actions";
import { useAppValue } from "context";
import MediaSelector from "components/Media/MediaSelector";
import { Button, Collapse, Dropdown, Menu, Input } from "antd";
import styled from "styled-components";
import { FaRegEyeSlash, FaRegEye, FaImage } from "react-icons/fa";
import { EditOutlined } from "@ant-design/icons";
import { AiFillFolderOpen } from "react-icons/ai";
import { BiText, BiMoveVertical } from "react-icons/bi";
import { SiMaterialdesignicons } from "react-icons/si";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { cloneDeep, get } from "lodash";
import { uniqueID, getIDs } from "./helper";
import LayerSettings from "./LayerSettings";
import arrayMove from "array-move";

const Container = styled.div``;

const DragHandle = SortableHandle(() => (
  <BiMoveVertical className="anticon" style={{ fontSize: 15 }} />
));

const layerExtra = (layer) => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockup, selectedLayers } = mockupWorkspace;
  const { layers } = mockup;
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

      <span
        style={{ display: "inline-flex" }}
        onClick={(e) => {
          e.preventDefault();
          dispatch({
            type: MOCKUP.SET_LAYER,
            payload: { ...layer, visible: !layer.visible },
          });
        }}
      >
        {layer.visible === false ? (
          <FaRegEyeSlash className="anticon" />
        ) : (
          <FaRegEye className="anticon" />
        )}
      </span>
    </div>
  );
};

const SortableItem = SortableElement(
  ({ layer, layers, onChange, layerExtra, index }) => {
    const [{ mockupWorkspace }, dispatch] = useAppValue();
    const { mockup, selectedLayers } = mockupWorkspace;
    const [edit, setEdit] = useState(false);
    const onLayerSelect = (key) => {
      dispatch({
        type: MOCKUP.SET_SELECTED_LAYERS,
        payload: key ? [key] : layer.parent ? [layer.parent] : [],
      });
    };
    const onSortEnd = ({ oldIndex, newIndex }) => {
      dispatch({
        type: MOCKUP.SET_LAYER,
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
            selectedLayers.length === 1 &&
            selectedLayers.find((id) => getIDs(layers, id).includes(layer.id))
              ? layer.id
              : null
          }
          onChange={onLayerSelect}
          expandIconPosition="left"
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
                      return <AiFillFolderOpen className="layer-icon" />;
                    }
                    if (type === "Image") {
                      return <FaImage className="layer-icon" />;
                    }
                    if (type === "Option") {
                      return <IoMdOptions className="layer-icon" />;
                    }
                    if (type === "Printarea") {
                      return <SiMaterialdesignicons className="layer-icon" />;
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
                          type: MOCKUP.SET_LAYER,
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
            className={layer.type}
          >
            {(() => {
              switch (layer.type) {
                case "Text":
                  return null;
                // return (
                //   <>
                //     <Collapse
                //       expandIconPosition="right"
                //       defaultActiveKey="layer-settings"
                //     >
                //       <Collapse.Panel
                //         header={<span>Layer settings</span>}
                //         key="layer-settings"
                //       >
                //         <TextForm layer={layer} />
                //       </Collapse.Panel>
                //       <Collapse.Panel
                //         header={<span>Advance settings</span>}
                //         key="advance-settings"
                //       >
                //         <AdvanceSettings layer={layer} />
                //       </Collapse.Panel>
                //     </Collapse>
                //   </>
                // );
                case "Image":
                  return null;
                case "Group":
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
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </Collapse.Panel>
        </Collapse>
      </li>
    );
  }
);

const SortableList = SortableContainer(
  ({ layers, onLayerSelect, layerExtra }) => (
    <ul className="layer-list">
      {/* {(() => {
        for (let i = layers.length - 1; i >= 0; i--) {
          return (
            <SortableItem
              key={layers[i].id}
              index={i}
              layer={layers[i]}
              layers={layers}
              onLayerSelect={onLayerSelect}
              layerExtra={layerExtra}
            />
          );
        }
      })()} */}
      {layers.map((_, index) => {
        var idx = layers.length - index - 1;
        var layer = layers[idx];
        return (
          <SortableItem
            key={layer.id}
            index={index}
            layer={layer}
            layers={layers}
            onLayerSelect={onLayerSelect}
            layerExtra={layerExtra}
          />
        );
      })}
    </ul>
  )
);

const Layers = () => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockup, selectedLayers, mockupsManage } = mockupWorkspace;
  const { layers } = mockup;

  const setMockupList = (layers) => {
    if (mockupsManage.length) {
      let newListMockup = cloneDeep(mockupsManage);
      if (newListMockup.length) {
        newListMockup = newListMockup.map((item) => {
          if (item.id === mockup.id) {
            return {
              ...mockup,
              layers,
            };
          }
          return { ...item };
        });
      }
      dispatch({
        type: MOCKUP.SET_MOCKUPS,
        payload: newListMockup,
      });
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    let newLayers = arrayMove(
      layers,
      layers.length - oldIndex - 1,
      layers.length - newIndex - 1
    );
    dispatch({
      type: MOCKUP.SET,
      payload: {
        ...mockup,
        layers: newLayers,
      },
    });
    setMockupList(newLayers);
  };

  const [showMediaSelector, setShowMediaSelector] = useState(false);

  const addPrintare = (printArea) => {
    const { width, height } = mockup;
    var printareaLayer = {
      title: `Printarea: ${get(printArea, "name")}`,
      id: uniqueID(),
      type: "Printarea",
      x: (width - 100) / 2,
      y: (height - 100) / 2,
      printArea: printArea,
    };
    dispatch({
      type: MOCKUP.SET,
      payload: {
        ...mockup,
        layers: [...mockup.layers, printareaLayer],
      },
    });
    setMockupList([...mockup.layers, printareaLayer]);
  };

  const addImage = (file) => {
    var imgLayer = {
      id: uniqueID(),
      type: "Image",
      file: file,
      x: 20,
      y: 20,
    };
    dispatch({
      type: MOCKUP.SET,
      payload: {
        ...mockup,
        layers: [...mockup.layers, imgLayer],
      },
    });
    setMockupList([...mockup.layers, imgLayer]);
  };

  const printAreas = get(mockup, "productBase.printAreas", []) || [];
  return (
    <Container id="mockup-design-sidebar">
      <SortableList
        layers={layers}
        selectedLayers={selectedLayers}
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
          gridTemplateColumns: "repeat(2,auto)",
          borderRadius: 0,
          marginTop: 30,
        }}
      >
        <Button
          onClick={() => setShowMediaSelector(true)}
          style={{ borderRadius: 0 }}
        >
          Add Image
        </Button>
        <Dropdown
          placement="bottomCenter"
          arrow
          overlay={
            <Menu
              onClick={({ key }) => {
                addPrintare(printAreas.find((prt) => prt.id === key));
              }}
            >
              {printAreas.map((printArea) => (
                <Menu.Item key={printArea.id}>{printArea.name}</Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button style={{ borderRadius: 0 }}>Add Printarea</Button>
        </Dropdown>
      </Button.Group>
      <MediaSelector
        visible={showMediaSelector}
        onCancel={() => setShowMediaSelector(false)}
        onChange={(files) => addImage(files[0])}
      />
      <LayerSettings />
    </Container>
  );
};

export default Layers;
