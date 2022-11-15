import React, { useMemo } from "react";
import { get } from "lodash";
import { useAppValue } from "../../../context";
import { Collapse, Divider, Space } from "antd";
import TextForm from "./TextForm";
import ImageForm from "./ImageForm";
import OptionForm from "./OptionForm";
import AdvanceSettings from "./AdvanceSettings";

const LayerSettings = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork, selectedTemplate, selectedLayers } = workspace;
  const layers =
    selectedTemplate === -1
      ? get(artwork, "sharedLayers", [])
      : get(artwork, `templates[${selectedTemplate}].layers`) || [];
  const layer =
    selectedLayers.length === 1 ? layers.search(selectedLayers[0]) : null;
  const isSharedLayer = useMemo(() => {
    return layer && selectedTemplate !== -1 && layer.shared_layer_id;
  }, [layer, selectedTemplate]);
  if (layer === null) {
    return null;
  }
  switch (layer.type) {
    case "Text":
      return (
        <Space direction="vertical" style={{ width: "100%", marginTop: 30 }}>
          <Collapse
            key={`text-${layer.id}`}
            expandIconPosition="right"
            defaultActiveKey="layer-settings"
          >
            {!isSharedLayer && (
              <Collapse.Panel
                header={<strong>Layer settings</strong>}
                key="layer-settings"
              >
                <TextForm layer={layer} key={layer.id} />
              </Collapse.Panel>
            )}
            {selectedTemplate !== -1 && (
              <Collapse.Panel
                header={<strong>Advance settings</strong>}
                key="advance-settings"
              >
                <AdvanceSettings layer={layer} key={layer.id} />
              </Collapse.Panel>
            )}
          </Collapse>
        </Space>
      );
    case "Image":
      return (
        <Space direction="vertical" style={{ width: "100%", marginTop: 30 }}>
          <Collapse
            key={`image-${layer.id}`}
            expandIconPosition="right"
            defaultActiveKey="layer-settings"
            accordion={true}
          >
            {!isSharedLayer && (
              <Collapse.Panel
                key="layer-settings"
                header={<strong>Layer settings</strong>}
              >
                <ImageForm layer={layer} key={layer.id} />
              </Collapse.Panel>
            )}
            {selectedTemplate !== -1 && (
              <Collapse.Panel
                header={<strong>Advance settings</strong>}
                key="advance-settings"
              >
                <AdvanceSettings layer={layer} key={layer.id} />
              </Collapse.Panel>
            )}
          </Collapse>
        </Space>
      );
    case "Option":
      return (
        <Space direction="vertical" style={{ width: "100%", marginTop: 30 }}>
          <Collapse
            key={`option-${layer.id}`}
            expandIconPosition="right"
            defaultActiveKey="layer-settings"
          >
            <Collapse.Panel
              key="layer-settings"
              header={<strong>Layer settings</strong>}
            >
              <OptionForm layer={layer} key={layer.id} />
            </Collapse.Panel>
          </Collapse>
        </Space>
      );
    case "Group":
      if (selectedTemplate === -1) return null;
      return (
        <Space direction="vertical" style={{ width: "100%", marginTop: 30 }}>
          <Collapse
            key={`group-${layer.id}`}
            expandIconPosition="right"
            accordion={true}
            defaultActiveKey={"advance-settings"}
          >
            <Collapse.Panel
              header={<strong>Advance settings</strong>}
              key="advance-settings"
            >
              <AdvanceSettings layer={layer} key={layer.id} />
            </Collapse.Panel>
          </Collapse>
        </Space>
      );
    default:
      return null;
  }
};

export default LayerSettings;
