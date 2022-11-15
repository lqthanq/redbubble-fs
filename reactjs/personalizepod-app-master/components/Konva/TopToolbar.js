import { Button, Popover, Tooltip } from "antd";
import styled from "styled-components";
import TextToolbar from "./TextToolbar";
import GroupToolbar from "./GroupToolbar";
import { useAppValue } from "../../context";
import { get } from "lodash";
import { uniqueID, removeLayerById } from "./Utilities/helper";
import ImageToolbar from "./ImageToolbar";
import { FaRegObjectGroup } from "react-icons/fa";
import TemplateSettings from "./Form/TemplateSettings";
import { ARTWORK } from "../../actions";
import { SettingOutlined } from "@ant-design/icons";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 30px;
  align-items: center;
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
`;
const TopToolbar = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork, selectedTemplate, selectedLayers } = workspace;
  const layers =
    selectedTemplate === -1
      ? get(artwork, "sharedLayers", [])
      : get(artwork, `templates[${selectedTemplate}].layers`) || [];
  const layer = layers.search(get(selectedLayers, "[0]"));
  const createGroup = (e) => {
    var groupID = uniqueID();
    var groupLayers = selectedLayers.map((id) => layers.search(id));
    groupLayers.forEach((layer) => {
      layer.x = layer.x - window.trRef.current.x();
      layer.y = layer.y - window.trRef.current.y();
    });
    groupLayers.forEach((layer) => removeLayerById(layers, layer.id));
    var group = {
      type: "Group",
      title: `Group #${layers.filter((l) => l.type === "Group").length + 1}`,
      id: groupID,
      layers: groupLayers.map((layer) => ({ ...layer, parent: groupID })),
      visible: true,
      x: window.trRef.current.x(),
      y: window.trRef.current.y(),
    };
    dispatch({
      type: ARTWORK.SET_LAYERS,
      payload: [...layers, group],
    });
    setTimeout(() => {
      dispatch({
        type: ARTWORK.SET_SELECTED_LAYERS,
        payload: [groupID],
      });
    }, 100);
  };

  return (
    <Container>
      <div>
        <div>
          {selectedLayers.length === 1 ? (
            <>
              {layer && layer.type === "Text" && <TextToolbar layer={layer} />}
              {layer && layer.type === "Image" && (
                <ImageToolbar layer={layer} />
              )}
              {layer && layer.type === "Group" && (
                <GroupToolbar layer={layer} />
              )}
            </>
          ) : selectedLayers.length > 1 ? (
            <>
              <Button
                icon={
                  <span className="anticon">
                    <FaRegObjectGroup />
                  </span>
                }
                onClick={createGroup}
              >
                Create group
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <Popover content={<TemplateSettings />}>
        <Tooltip title="Templates settings">
          <Button icon={<SettingOutlined />} type="link" />
        </Tooltip>
      </Popover>
    </Container>
  );
};

export default TopToolbar;
