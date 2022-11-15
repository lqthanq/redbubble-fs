import { Input, Select } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { useAppValue } from "context";
import { cloneDeep, get } from "lodash";
const findLayer = (id, layers) => {
  for (let index in layers) {
    if (layers[index].id === id) {
      return layers[index];
    }
  }
  var _layers = [];
  layers.forEach((l) => {
    if (Array.isArray(l.layers)) {
      _layers.push(...cloneDeep(l.layers));
    }
  });
  if (_layers.length > 0) {
    return findLayer(id, _layers);
  }
  return null;
};
const LayerOptionField = ({ layerId, value, onChange = () => {} }) => {
  const [{ workspace }] = useAppValue();
  const { artwork, selectedTemplate } = workspace;
  const layers =
    get(artwork, `templates[${selectedTemplate}].layers`, []) || [];
  const layer = findLayer(layerId, layers);
  if (layer === null) {
    return "Please select option";
  }
  switch (layer.type) {
    case "Option":
      return (
        <Select size="small" value={value} onChange={onChange}>
          {(layer.options || []).map((op) => (
            <Select.Option key={op.value} value={op.value}>
              {op.label}
            </Select.Option>
          ))}
        </Select>
      );
    case "Text":
      return <Input value={value} onChange={onChange} size="small" />;
    case "Image":
      switch (layer.personalized.type) {
        case "images":
          return (
            <Select size="small" value={value} onChange={onChange}>
              {layer.values.map((v) => (
                <Select.Option key={v.file.id}>
                  <Avatar
                    size={24}
                    src={`${process.env.CDN_URL}100x100/${v.file.key}`}
                  ></Avatar>{" "}
                  {v.file.fileName}
                </Select.Option>
              ))}
            </Select>
          );
        default:
          return null;
      }
    default:
      return null;
  }
};

export default LayerOptionField;
