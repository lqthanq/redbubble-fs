import { Popover, Button, Row, Col, Divider } from "antd";
import {
  CgAlignTop,
  CgAlignLeft,
  CgAlignMiddle,
  CgAlignCenter,
  CgAlignBottom,
  CgAlignRight,
  CgPathBack,
  CgPathFront,
} from "react-icons/cg";
import styled from "styled-components";
import { useAppValue } from "context";
import { findIndex, get } from "lodash";
import arrayMove from "array-move";
import { ARTWORK } from "../../../actions";
const Container = styled.div`
  width: 300px;
  .ant-col {
    > span {
      display: flex;
      align-items: center;
      height: 40px;
      cursor: pointer;
      width: max-content;
      svg.anticon {
        font-size: 24px;
        margin-right: 5px;
      }
    }
  }
`;
const LayerPosition = ({ layer }) => {
  const [
    {
      workspace: { artwork, selectedTemplate },
    },
    dispatch,
  ] = useAppValue();
  const layers =
    selectedTemplate === -1
      ? get(artwork, "sharedLayers", [])
      : get(artwork, `templates[${selectedTemplate}].layers`) || [];

  const updateAlign = (align) => (e) => {
    e.preventDefault();
    var scaleX = window.layerRef.current.getStage().scaleX();
    var scaleY = window.layerRef.current.getStage().scaleY();
    var canvasWidth = window.layerRef.current.width();
    var layerWidth = window.trRef.current.width();
    var canvasHeight = window.layerRef.current.height();
    var layerHeight = window.trRef.current.height();
    var newLayer = { ...layer };
    switch (align) {
      case "top":
        newLayer.y = 0;
        break;
      case "left":
        newLayer.x = 0;
        break;
      case "middle":
        newLayer.y = (canvasHeight - layerHeight) / scaleX / 2;
        break;
      case "center":
        newLayer.x = (canvasWidth - layerWidth) / scaleX / 2;
        break;
      case "bottom":
        newLayer.y = (canvasHeight - layerHeight) / scaleY;
        break;
      case "right":
        newLayer.x = (canvasWidth - layerWidth) / scaleX;
        break;
      default:
        break;
    }
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: newLayer,
    });
    // try {
    //   window.layerRef.current.find(".overlay").forEach((node) => {
    //     node.setAttrs({ x: newLayer.x, y: newLayer.y });
    //   });
    // } catch (error) {}
  };

  const backWard = () => {
    if (layer.parent) {
      //Move in group
      var parent = layers.search(layer.parent);
      if (parent) {
        var index = findIndex(parent.layers, (l) => l.id === layer.id);
        if (index > 0) {
          parent.layers = arrayMove(parent.layers, index, index - 1);
          dispatch({
            type: ARTWORK.SET_LAYER,
            payload: parent,
          });
        }
      }
    } else {
      var index = findIndex(layers, (l) => l.id === layer.id);
      if (index > 0) {
        dispatch({
          type: ARTWORK.SET_LAYERS,
          payload: arrayMove(layers, index, index - 1),
        });
      }
    }
  };

  const forWard = () => {
    if (layer.parent) {
      //Move in group
      var parent = layers.search(layer.parent);
      if (parent) {
        var index = findIndex(parent.layers, (l) => l.id === layer.id);
        if (index <= parent.layers.length - 1) {
          parent.layers = arrayMove(parent.layers, index, index + 1);
          dispatch({
            type: ARTWORK.SET_LAYER,
            payload: parent,
          });
        }
      }
    } else {
      var index = findIndex(layers, (l) => l.id === layer.id);
      if (index <= layers.length - 1) {
        dispatch({
          type: ARTWORK.SET_LAYERS,
          payload: arrayMove(layers, index, index + 1),
        });
      }
    }
  };

  return (
    <Popover
      content={
        <Container className="layer-position">
          <Divider orientation="left">Position</Divider>
          <Row>
            <Col span={12}>
              <span
                onClick={(e) => {
                  forWard();
                }}
              >
                <CgPathFront className="anticon" fontSize={20} /> Forward
              </span>
            </Col>
            <Col span={12}>
              <span
                onClick={(e) => {
                  backWard();
                }}
              >
                <CgPathBack className="anticon" fontSize={20} /> Backward
              </span>
            </Col>
          </Row>
          <Divider orientation="left">Align</Divider>
          <Row>
            <Col span={12}>
              <span onClick={updateAlign("top")}>
                <CgAlignTop className="anticon" fontSize={20} /> Top
              </span>
            </Col>
            <Col span={12}>
              <span onClick={updateAlign("left")}>
                <CgAlignLeft className="anticon" fontSize={20} /> Left
              </span>
            </Col>
            <Col span={12}>
              <span onClick={updateAlign("middle")}>
                <CgAlignMiddle className="anticon" fontSize={20} /> Middle
              </span>
            </Col>
            <Col span={12}>
              <span onClick={updateAlign("center")}>
                <CgAlignCenter className="anticon" fontSize={20} /> Center
              </span>
            </Col>
            <Col span={12}>
              <span onClick={updateAlign("bottom")}>
                <CgAlignBottom className="anticon" fontSize={20} /> Bottom
              </span>
            </Col>
            <Col span={12}>
              <span onClick={updateAlign("right")}>
                <CgAlignRight className="anticon" fontSize={20} /> Right
              </span>
            </Col>
          </Row>
        </Container>
      }
    >
      <Button type="link">Position</Button>
    </Popover>
  );
};

export default LayerPosition;
