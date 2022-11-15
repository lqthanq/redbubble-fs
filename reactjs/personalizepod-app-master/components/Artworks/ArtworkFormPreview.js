import React from "react";
import ARTWORKQUERY from "graphql/queries/artwork";
import CLIPARTCATEGORYQUERY from "graphql/queries/clipartCategory";
import CLIPARTSQUERY from "graphql/queries/cliparts";
import { useQuery } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import { useState } from "react";
import { useEffect } from "react";
import { get, omit, concat, debounce } from "lodash";
import {
  Alert,
  Avatar,
  Card,
  Form,
  Input,
  Radio,
  Select,
  Skeleton,
} from "antd";
import Grid from "components/Utilities/Grid";
import { useMemo } from "react";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { BiMoveVertical } from "react-icons/bi";

const treeToArray = (arr) => {
  var res = [];
  if (Array.isArray(arr)) {
    arr.forEach((el) => {
      res.push({ ...omit(el, ["layers"]) });
      if (Array.isArray(el.layers)) {
        res.push(...treeToArray(el.layers));
      }
    });
  }
  return res;
};

const TextFieldLayer = ({ layer, dragIcon }) => {
  return (
    <div>
      <Form.Item
        label={
          <div>
            {dragIcon}
            {get(layer, "personalized.label", layer.title)}
          </div>
        }
        name={layer.id}
        rules={[{ required: get(layer, "personalized.required") }]}
        extra={get(layer, "personalized.help")}
      >
        <Input placeholder={get(layer, "personalized.placeholder")} />
      </Form.Item>
    </div>
  );
};

const ImageFieldLayer = ({ layer, dragIcon }) => {
  const personalizedType = get(layer, "personalized.type");

  return (
    <>
      {personalizedType === "clipartCategory" && (
        <Query
          query={CLIPARTCATEGORYQUERY}
          variables={{ id: get(layer, "personalized.clipartCategory") }}
        >
          {({ data, error, loading }) => {
            if (loading) {
              return <Skeleton />;
            }
            if (error) {
              return <Alert message={error.message} type="error" />;
            }
            if (data) {
              return (
                <Form.Item
                  label={
                    <div>
                      {dragIcon}
                      {get(layer, "personalized.label", layer.title)}
                    </div>
                  }
                  name={layer.id}
                >
                  <ClipartCategoryFormBuilder category={data.clipartCategory} />
                </Form.Item>
              );
            }
          }}
        </Query>
      )}
    </>
  );
};

const OptionFieldLayer = ({ layer, dragIcon }) => {
  switch (layer.display_mode) {
    case "dropdown":
      return <OptionFieldLayerDropdown layer={layer} dragIcon={dragIcon} />;
    case "button":
      return <OptionFieldLayerButton layer={layer} dragIcon={dragIcon} />;
    case "image":
      return (
        <OptionFieldLayerImageSwitcher layer={layer} dragIcon={dragIcon} />
      );
    case "color":
      return (
        <OptionFieldLayerColorSwitcher layer={layer} dragIcon={dragIcon} />
      );
    default:
      return null;
  }
};

const OptionFieldLayerDropdown = ({ layer, dragIcon }) => {
  return (
    <div>
      <Form.Item
        name={layer.id}
        label={
          <div>
            {dragIcon}
            {get(layer, "personalized.label", layer.title)}
          </div>
        }
        rules={[{ required: true }]}
      >
        <Select>
          {layer.options.map((op) => (
            <Select.Option key={op.value}>{op.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

const OptionFieldLayerButton = ({ layer, dragIcon }) => {
  return (
    <div>
      <Form.Item
        name={layer.id}
        label={
          <div>
            {dragIcon}
            {get(layer, "personalized.label", layer.title)}
          </div>
        }
        rules={[{ required: true }]}
      >
        <Radio.Group>
          {layer.options.map((op) => (
            <Radio.Button key={op.value} value={op.value}>
              {op.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

const ImageSwicher = ({ options, value, onChange = () => {} }) => {
  return (
    <Grid width={64} gap={10}>
      {options.map((op) => (
        <Avatar
          shape="square"
          style={{
            cursor: "pointer",
            border:
              op.value === value ? "2px solid var(--primary-color)" : "none",
          }}
          className="custom-avatar"
          size={64}
          src={`${process.env.CDN_URL}100x100/${op.image}`}
          key={op.value}
          onClick={() => onChange(op.value)}
        />
      ))}
    </Grid>
  );
};

const OptionFieldLayerImageSwitcher = ({ layer, dragIcon }) => {
  return (
    <div>
      <Form.Item
        name={layer.id}
        label={
          <div>
            {dragIcon}
            {get(layer, "personalized.label", layer.title)}
          </div>
        }
        rules={[{ required: true }]}
      >
        <ImageSwicher options={layer.options} />
      </Form.Item>
    </div>
  );
};

const ColorSwicher = ({ options, value, onChange = () => {} }) => {
  return (
    <div style={{ display: "flex", gap: 15 }}>
      {options.map((op) => (
        <div
          key={op.value}
          onClick={() => onChange(op.value)}
          style={{
            width: 40,
            height: 40,
            background: op.color,
            border:
              op.value === value ? "2px solid var(--primary-color)" : "none",
          }}
        ></div>
      ))}
    </div>
  );
};

const OptionFieldLayerColorSwitcher = ({ layer, dragIcon }) => {
  return (
    <div>
      <Form.Item
        name={layer.id}
        label={
          <div>
            {dragIcon}
            {get(layer, "personalized.label", layer.title)}
          </div>
        }
        rules={[{ required: true }]}
      >
        <ColorSwicher options={layer.options} />
      </Form.Item>
    </div>
  );
};

const ClipartCategoryFormBuilder = ({
  category,
  value,
  onChange = () => {},
}) => {
  const [selectedChild, setSelectedChild] = useState();
  return category.hasChild ? (
    <div>
      {((displayMode, children) => {
        switch (displayMode) {
          case "Dropdown":
            return (
              <Select
                onChange={(id) =>
                  setSelectedChild(children.find((c) => c.id === id))
                }
              >
                {children.map((child) => (
                  <Select.Option key={child.id}>
                    {child.displaySettings.value}
                  </Select.Option>
                ))}
              </Select>
            );
          case "Button":
            return (
              <Radio.Group
                onChange={({ target: { value } }) =>
                  setSelectedChild(children.find((c) => c.id === value))
                }
              >
                {children.map((child) => (
                  <Radio.Button value={child.id} key={child.id}>
                    {child.displaySettings.value}
                  </Radio.Button>
                ))}
              </Radio.Group>
            );
          case "ColorSwitcher":
            return (
              <div style={{ display: "flex", gap: 15 }}>
                {children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    style={{
                      width: 40,
                      height: 40,
                      background: child.displaySettings.value,
                      border:
                        selectedChild?.id === child.id
                          ? "2px solid var(--primary-color)"
                          : "none",
                    }}
                  ></div>
                ))}
              </div>
            );
          case "ImageSwitcher":
            return (
              <Grid width={64} gap={10} style={{ marginBottom: 20 }}>
                {children.map((child) => (
                  <Avatar
                    shape="square"
                    style={{
                      cursor: "pointer",
                      border:
                        selectedChild?.id === child.id
                          ? "2px solid var(--primary-color)"
                          : "none",
                    }}
                    className="custom-avatar"
                    size={64}
                    src={`${process.env.CDN_URL}100x100/${child.displaySettings.value}`}
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                  />
                ))}
              </Grid>
            );
        }
        return null;
      })(
        get(category, "displaySettings.displayMode", "Dropdown"),
        category.children
      )}
      {selectedChild && (
        <ClipartCategoryFormBuilder
          category={selectedChild}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  ) : (
    <Query
      query={CLIPARTSQUERY}
      variables={{ categoryID: [category.id], pageSize: -1 }}
    >
      {({ data, loading }) => {
        if (loading) {
          return <Skeleton />;
        }
        if (data) {
          return (
            <Grid width={64} gap={10}>
              {data.cliparts.hits.map((clipart) => (
                <Avatar
                  shape="square"
                  style={{
                    cursor: "pointer",
                    border:
                      value?.id === clipart.file.id
                        ? "2px solid var(--primary-color)"
                        : "none",
                  }}
                  className="custom-avatar"
                  size={64}
                  src={`${process.env.CDN_URL}100x100/${clipart.file.key}`}
                  key={clipart.id}
                  onClick={() => {
                    onChange({
                      id: clipart.file.id,
                      key: clipart.file.key,
                      categoryID: clipart.category.id,
                    });
                  }}
                />
              ))}
            </Grid>
          );
        }
      }}
    </Query>
  );
};

const checkRule = (rule, values) => {
  switch (rule.logic) {
    case "=":
      return values[rule.option] === rule.value;
    default:
      return values[rule.option] !== rule.value;
  }
};

const LayerFieldBuilder = ({ layer, values = {}, dragHandle }) => {
  const [hover, setHover] = useState(false);
  const isPersonalized =
    get(layer, "personalized.enable", false) || layer.type === "Option";
  const isGroup = get(layer, "type");
  const subLayers = get(layer, "layers");
  const visible = useMemo(() => {
    if (
      layer.condition &&
      layer.condition.enable === true &&
      Array.isArray(layer.condition.rules)
    ) {
      var pass = false;
      var checks = layer.condition.rules.map((rule) => checkRule(rule, values));
      if (layer.condition.match === "all") {
        pass = checks.every((result) => result);
      } else if (layer.condition.match === "one") {
        pass = checks.some((result) => result);
      } else if (layer.condition.match === "none") {
        pass = checks.every((result) => !result);
      }
      return layer.condition.action === "show" ? pass : !pass;
    }
    return true;
  }, [layer, values]);
  if (!visible) return null;
  const DragIcon = (
    <DragHandle
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
  return isPersonalized ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto",
        //alignItems: "center",
        border: hover ? "1px dashed #999" : "1px dashed transparent",
      }}
    >
      {layer.type === "Text" && (
        <TextFieldLayer
          layer={layer}
          values={values}
          dragIcon={dragHandle ? DragIcon : null}
        />
      )}
      {layer.type === "Image" && (
        <ImageFieldLayer
          layer={layer}
          values={values}
          dragIcon={dragHandle ? DragIcon : null}
        />
      )}
      {layer.type === "Option" && (
        <OptionFieldLayer
          layer={layer}
          values={values}
          dragIcon={dragHandle ? DragIcon : null}
        />
      )}
    </div>
  ) : isGroup && Array.isArray(subLayers) ? (
    subLayers.map((subLayer) => (
      <LayerFieldBuilder
        key={subLayer.id}
        layer={subLayer}
        values={values}
        dragHandle={dragHandle}
      />
    ))
  ) : null;
};

const TemplateSelector = ({ value, onChange, artwork, templates }) => {
  if (artwork.templateDisplayMode === "button") {
    return (
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        {templates.map((tpl, index) => (
          <Radio.Button key={index} value={index}>
            {tpl.title}
          </Radio.Button>
        ))}
      </Radio.Group>
    );
  } else if (artwork.templateDisplayMode === "image") {
    return (
      <Grid width={64} gap={10} style={{ marginBottom: 20 }}>
        {templates.map((tpl, index) => (
          <Avatar
            shape="square"
            style={{
              cursor: "pointer",
              border:
                value?.toString() === index.toString()
                  ? "2px solid var(--primary-color)"
                  : "none",
            }}
            className="custom-avatar"
            size={64}
            src={`${process.env.CDN_URL}100x100/${
              tpl.thumbnail || tpl.preview
            }`}
            key={index}
            onClick={() => onChange(index)}
          />
        ))}
      </Grid>
    );
  } else {
    return (
      <Select value={value} onChange={onChange}>
        {templates.map((tpl, index) => (
          <Select.Option key={index} value={index}>
            {tpl.title}
          </Select.Option>
        ))}
      </Select>
    );
  }
};

const DragHandle = sortableHandle(
  ({ onMouseEnter = () => {}, onMouseLeave = () => {} }) => (
    <BiMoveVertical
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="anticon"
      style={{ cursor: "pointer" }}
    />
  )
);

const SortableItem = SortableElement(({ layer, values }) => (
  <div>
    <LayerFieldBuilder
      key={layer.id}
      layer={layer}
      values={values}
      dragHandle={true}
    />
  </div>
));

const SortableList = SortableContainer(({ layers, values }) => {
  return (
    <div>
      {layers
        .filter((l) => l)
        .map((layer, index) => (
          <SortableItem
            key={layer.id}
            index={index}
            layer={layer}
            values={values}
          />
        ))}
    </div>
  );
});

const ArtworkFormPreview = ({
  artworkId = null,
  personalized = {},
  onPersonalized = () => {},
  ordering = {},
  onOrdering = () => {},
}) => {
  const [form] = Form.useForm();
  const [artwork, setArtwork] = useState();
  const { data, loading, error } = useQuery(ARTWORKQUERY, {
    variables: {
      id: artworkId,
    },
  });
  const template = useMemo(() => {
    return get(personalized, "template", 0);
  }, [personalized]);

  useEffect(() => {
    if (data) {
      const { artwork } = data;
      setArtwork(artwork);
      // Get default personalized data
      var defaultPersonalized = {};
      var defaultOrdering = [];
      artwork.templates.forEach((tpl, index) => {
        if (!Array.isArray(ordering[index]) || ordering[index].length === 0) {
          defaultOrdering[index] = tpl.layers.map((layer) => layer.id);
        } else {
          defaultOrdering[index] = [...ordering[index]];
          tpl.layers.forEach((layer) => {
            if (!defaultOrdering[index].includes(layer.id)) {
              defaultOrdering[index].push(layer.id);
            }
          });
        }
      });
      onOrdering(defaultOrdering);
      var flatLayers = treeToArray(
        concat(...artwork.templates.map((tpl) => tpl.layers))
      );
      flatLayers
        .filter(
          (l) =>
            l.type === "Option" || (l.personalized && l.personalized.enable)
        )
        .forEach((layer) => {
          if (layer.type === "Text") {
            defaultPersonalized[layer.id] = (
              layer.values.find((v) => v.active) || layer.values[0]
            ).text;
          }
          if (layer.type === "Image") {
            if (layer.personalized.type === "clipartCategory") {
              if (layer.personalized.default) {
                defaultPersonalized[layer.id] = layer.personalized.default.file;
              } else {
                var defaultVal = layer.values.find((v) => v.active);
                if (!defaultVal) {
                  defaultVal = layer.values[0];
                }
                defaultPersonalized[layer.id] = defaultVal.file;
              }
            } else {
              var defaultVal = layer.values.find((v) => v.active);
              if (!defaultVal) {
                defaultVal = layer.values[0];
              }
              defaultPersonalized[layer.id] = defaultVal.file;
            }
          }
          if (layer.type === "Option") {
            defaultPersonalized[layer.id] = get(layer, "options[0].value");
          }
        });
      form.setFieldsValue({ ...defaultPersonalized, ...personalized });
      onPersonalized({ ...defaultPersonalized, ...personalized });
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue(personalized);
  }, [personalized]);

  const handleValuesChange = (_, values) => {
    onPersonalized({ ...personalized, ...values });
  };

  if (!artwork) return null;
  const { templates } = artwork;
  const layers = get(artwork, `templates[${template}].layers`, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    onOrdering(
      ordering.map((order, index) => {
        return index.toString() === template.toString()
          ? arrayMove(order, oldIndex, newIndex)
          : order;
      })
    );
  };

  return (
    <Card style={{ backgroundColor: "#f4f6f8", height: "auto" }}>
      <Form
        form={form}
        onValuesChange={debounce(handleValuesChange, 200)}
        layout="horizontal"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {templates.length > 1 && (
          <Form.Item
            label={artwork.templateDisplayLabel}
            name="template"
            rules={[{ required: true }]}
          >
            <TemplateSelector artwork={artwork} templates={templates} />
          </Form.Item>
        )}
        {ordering[template] ? (
          <SortableList
            layers={ordering[template].map((id) =>
              layers.find((l) => l.id === id)
            )}
            values={personalized}
            lockAxis="y"
            onSortEnd={onSortEnd}
            useDragHandle
          />
        ) : (
          layers.map((layer) => (
            <LayerFieldBuilder
              key={layer.id}
              layer={layer}
              values={personalized}
            />
          ))
        )}
      </Form>
    </Card>
  );
};

export default ArtworkFormPreview;
