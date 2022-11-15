import { cloneDeep, forEach, get, min, omit } from "lodash";
import Text from "./Text";
import TextShape from "./TextShape";
import Image from "./Image";
import { Group as KonvaGroup, Rect } from "react-konva";
import { useRef } from "react";

const Group = (props) => {
  const {
    layers = [],
    selectedLayers,
    onLayerSelect,
    ratio,
    type,
    id,
    sharedLayers = [],
    zoom,
  } = props;
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
        {layers.map((layer) => {
          let originLayer = cloneDeep(layer);
          if (get(layer, "shared_layer_id")) {
            var sharedLayer = sharedLayers.search(layer.shared_layer_id);
            if (sharedLayer) {
              layer = {
                ...layer,
                ...omit(sharedLayer, [
                  "id",
                  "title",
                  "x",
                  "y",
                  //"personalized",
                  "rotation",
                  "visible",
                ]),
              };
            }
          }
          var value = (layer.values || []).find((v) => v.active);
          if (!value) {
            value = get(layer.values || [], "[0]", {});
          }
          if (
            get(layer, "personalized.enable") &&
            get(layer, "personalized.type") === "clipartCategory"
          ) {
            value = { ...value, ...get(layer, "personalized.default") };
          }
          var layerProps = {
            ...layer,
            ...omit(value, ["id", "title"]),
            key: layer.id,
            ratio: ratio,
            onClick: onClick,
            origin: originLayer,
            draggable:
              selectedLayers.some((id) => id === layer.id) && !layer.lock,
          };
          switch (layer.type) {
            case "Text":
              const shape = get(layer, "shape", "normal");
              if (shape !== "normal") {
                return <TextShape {...layerProps} onDragEnd={() => {}} />;
              }
              return <Text {...layerProps} onDragEnd={() => {}} />;
            case "Image":
              var isPersonalized =
                layerProps.personalized &&
                layerProps.personalized.enable &&
                layerProps.personalized.type === "clipartCategory";
              var categoryID = get(
                layerProps,
                "personalized.default.file.categoryID"
              );
              var custom = {};
              if (isPersonalized) {
                custom = get(layerProps, `custom.${categoryID}`);
              }
              return (
                <Image
                  {...layerProps}
                  {...custom}
                  zoom={zoom}
                  onClick={onClick}
                />
              );
            case "Option":
              return <Rect key={layer.id} {...layerProps} visible={false} />;
            case "Group":
              return (
                <Group
                  type="Group"
                  selectedLayers={selectedLayers}
                  sharedLayers={sharedLayers}
                  onLayerSelect={onLayerSelect}
                  {...layerProps}
                  zoom={zoom}
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
      {...omit(props, ["width", "height"])}
      onClick={onClick}
      draggable={selectedLayers.some((i) => i === id) && !props.lock}
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
