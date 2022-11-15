import { cloneDeep, get, omit } from "lodash";

export const uniqueID = (parent = null) =>
  (parent ? parent + "-" : "") + "_" + Math.random().toString(36).substr(2, 9);

export const parseID = (id = "") => {
  return id.split("-");
};

export const initNewLayer = (parent = null) => {
  var id = uniqueID();
  return {
    id: id,
    ...(parent ? { parent: parent } : {}),
    x: 50,
    y: 50,
    visible: true,
    lock: false,
    values: [
      {
        active: true,
      },
    ],
  };
};

export const search = (layers, id) => {
  if (!(layers && id)) {
    return null;
  }
  const stack = [...layers];
  while (stack.length) {
    const node = stack.shift();
    if (node.id === id) return node;
    node.layers && stack.push(...node.layers);
  }
  return null;
};

export const updateLayers = (layers, update) => {
  const layer = search(layers, update.id);
  if (layer) {
    const parent = search(layers, layer.parent);
    if (parent && ["Text", "Image", "Photo", "Clipart"].includes(parent.type)) {
      Object.assign(
        parent,
        omit(update, [
          "text",
          "parent",
          "id",
          "active",
          "clipart",
          "image",
          "draggable",
        ])
      );
      if (update.text) {
        layer.text = update.text;
      }
    }
  }
  return layers;
};

export const getIDs = (layers, id) => {
  const ids = [id];
  const layer = search(layers, id);
  if (layer && layer.parent) {
    return [...ids, ...getIDs(layers, layer.parent)];
  }
  return ids;
};

export const updateSublayer = (layer, update) => {
  const id = get(update, "id", getActiveSubLayer(layer).id);
  return {
    ...layer,
    layers: layer.layers.map((l) => (l.id === id ? { ...l, ...update } : l)),
  };
};

export const cloneLayer = (layer) => {
  var newID = uniqueID();
  var newLayer = {
    ...cloneDeep(layer),
    id: newID,
  };
  if (newLayer.layers) {
    newLayer.layers = newLayer.layers.map((l) =>
      cloneLayer({
        ...l,
        parent: newID,
      })
    );
  }
  return newLayer;
};

export const getLayerById = (layers, id) => {
  var layer = search(layers, id);
  if (layer) {
    if (["Image", "Text", "Group", "Photo", "Clipart"].includes(layer.type)) {
      return layer;
    } else {
      return getLayerById(layers, layer.parent);
    }
  }
  return null;
};

export const removeLayerById = (layers, id) => {
  layers.forEach((layer, index) => {
    if (layer.id === id) {
      layers.splice(index, 1);
      return layers;
    }
    if (layer.layers) {
      layer.layers = removeLayerById(layer.layers, id);
    }
  });
  return layers;
};
