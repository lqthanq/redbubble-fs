import ImageSettings from "./ImageSettings";
import PrintAreaSettings from "./PrintAreaSettings";
import { useAppValue } from "../../context";

const LayerSettings = () => {
  const [{ mockupWorkspace }] = useAppValue();
  const { selectedLayers, mockup } = mockupWorkspace;
  const { layers } = mockup;
  if (selectedLayers.length !== 1) {
    return null;
  }
  const layer = layers.search(selectedLayers[0]);
  if (!layer) {
    return null;
  }
  return (
    <div>
      {layer.type === "Image" && <ImageSettings layer={layer} />}
      {layer.type === "Printarea" && <PrintAreaSettings layer={layer} />}
    </div>
  );
};

export default LayerSettings;
