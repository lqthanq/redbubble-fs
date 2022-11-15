import { get, min, omit } from "lodash";
import Text from "./Text";
import Image from "./Image";
import { Group as KonvaGroup } from "react-konva";
import PrintArea from "./PrintArea";

const Group = ({ layer, selectedLayers, onLayerSelect = () => {}, mockup }) => {
  const { layers = [], type } = layer;
  const onClick = (e) => {
    var attrs = e.currentTarget.getAttrs(); //|| e.currentTarget.getAttr("id");
    // Do nothing if click on selectedLayer already
    // if (selectedLayers.includes(attrs.id)) {
    //   //e.evt.stopPropagation();
    //   //e.evt.preventDefault();
    //   return;
    // }
    var selectedId = attrs.parent || attrs.id;
    onLayerSelect(selectedId);
  };

  const render = () => {
    return (
      <>
        {layers.map((layer, index) => {
          const layerProps = {
            ...layer,
            draggable: selectedLayers.some((id) => id === layer.id),
          };
          switch (layer.type) {
            case "Text":
              return <Text layer={layerProps} key={index} onClick={onClick} />;
            case "Image":
              return <Image layer={layerProps} key={index} onClick={onClick} />;
            case "Printarea":
              return (
                <PrintArea
                  layer={layerProps}
                  key={index}
                  onClick={onClick}
                  mockup={mockup}
                />
              );
            case "Group":
              return (
                <Group
                  type="Group"
                  layer={layer}
                  key={index}
                  onClick={onClick}
                  onLayerSelect={onLayerSelect}
                  selectedLayers={selectedLayers}
                  mockup={mockup}
                />
              );
            default:
              return null;
          }
        })}
      </>
    );
  };

  return type === "Group" ? (
    <KonvaGroup
      {...omit(layer, ["width", "height"])}
      onClick={onClick}
      draggable={selectedLayers.some((i) => i === layer.id) && !layer.lock}
      onDragMove={function (e) {
        var minX = min(
          this.find((node) => node.getAttr("id")).map((node) => node.x())
        );
        var minY = min(
          this.find((node) => node.getAttr("id")).map((node) => node.y())
        );
        this.find((node) => node.getAttr("id")).forEach((node) => {
          node.x(node.x() - minX);
          node.y(node.y() - minY);
        });
        this.x(this.x() + minX);
        this.y(this.y() + minY);
      }}
    >
      {render()}
    </KonvaGroup>
  ) : (
    render()
  );
};
export default Group;
