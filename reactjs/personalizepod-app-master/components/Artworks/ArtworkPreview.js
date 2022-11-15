import { get, max, omit, concat, map, debounce } from "lodash";
import { useRef, useEffect, useState } from "react";
import { useMemo } from "react";
import ARTWORKQUERY from "graphql/queries/artwork";
import useFont from "hooks/Font";
import {
  Stage,
  Layer,
  Text as KonvaText,
  Image as KonvaImage,
  Group as KonvaGroup,
} from "react-konva";
import Konva from "konva";
import { Query } from "@apollo/client/react/components";
import { Alert, Skeleton } from "antd";
import useImage from "use-image";
import { useAppValue } from "context";
import { useCallback } from "react";

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

const Text = ({ layer, personalized, onLoading = () => {} }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const text = useMemo(() => {
    var defaultVal = layer.values.find((v) => v.active) || layer.values[0];
    var isPersonalized = get(layer, "personalized.enable", false);
    if (isPersonalized) {
      return get(personalized, layer.id) || defaultVal?.text;
    }
    return defaultVal?.text;
  }, [personalized, layer]);
  useFont(layer.fontFamily, () => {
    setFontLoaded(true);
    onLoading(false);
  });
  useEffect(() => {
    onLoading(true);
  }, []);
  return fontLoaded ? <KonvaText {...layer} text={text} /> : null;
};

const Image = ({ layer, ratio, personalized, onLoading = () => {} }) => {
  const imageRef = useRef();
  const file = useMemo(() => {
    var defaultVal = layer.values.find((v) => v.active) || layer.values[0];
    var isPersonalized = get(layer, "personalized.enable", false);
    if (isPersonalized) {
      return get(personalized, layer.id) || defaultVal?.file;
    }
    return defaultVal?.file;
  }, [personalized, layer]);

  const custom = get(layer, `custom[${file?.categoryID}]`, {});
  const layerProps = { ...layer, ...custom };
  const absolutePosition = get(layerProps, "absolutePosition");
  const [img] = useImage(
    process.env.CDN_URL +
      `${ratio === 1 ? "autoxauto" : ratio * 10 + "10xauto"}/` +
      file?.key,
    process.env.APP_URL
  );

  useEffect(() => {
    onLoading(true);
  }, []);

  useEffect(() => {
    if (img && imageRef && imageRef.current) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
      onLoading(false);
    }
  }, [img, imageRef]);

  useEffect(() => {
    if (imageRef && imageRef.current && absolutePosition) {
      imageRef.current.absolutePosition({
        x: absolutePosition.x,
        y: absolutePosition.y,
      });
    }
  }, [imageRef, absolutePosition]);

  return img ? (
    <KonvaImage
      {...omit(layerProps, "absolutePosition")}
      image={img}
      ref={imageRef}
      filters={get(layer, "_filters", []).map((filter) =>
        get(Konva.Filters, filter)
      )}
    />
  ) : null;
};

const Group = ({ layer, ratio, personalized, onLoading = () => {} }) => {
  const [loadings, setLoadings] = useState({});
  useEffect(() => {
    onLoading(true);
  }, []);

  useEffect(() => {
    onLoading(map(loadings).some((loading) => loading === true));
  }, [loadings]);

  return (
    <KonvaGroup {...layer}>
      {layer.layers.map((l) => {
        switch (l.type) {
          case "Group":
            return (
              <Group
                layer={l}
                key={l.id}
                ratio={ratio}
                personalized={personalized}
                onLoading={(status) =>
                  setLoadings({ ...loadings, [l.id]: status })
                }
              />
            );
          case "Image":
            return (
              <Image
                layer={l}
                key={l.id}
                ratio={ratio}
                personalized={personalized}
                onLoading={(status) =>
                  setLoadings({ ...loadings, [l.id]: status })
                }
              />
            );
          case "Text":
            return (
              <Text
                layer={l}
                key={l.id}
                personalized={personalized}
                onLoading={(status) =>
                  setLoadings({ ...loadings, [l.id]: status })
                }
              />
            );
          default:
            return null;
        }
      })}
    </KonvaGroup>
  );
};

const ArtworkPreview = ({
  artworkId,
  personalized = { template: 0 },
  onDraw = () => {},
}) => {
  const [loadings, setLoadings] = useState({});
  const stageRef = useRef();
  useEffect(() => {
    if (stageRef && stageRef.current) {
      if (!map(loadings).some((loading) => loading === true)) {
        setTimeout(() => onDraw(stageRef?.current?.toDataURL()), 200);
      }
    }
  }, [loadings, stageRef]);

  const _onDraw = useCallback(
    debounce((loadings, stageRef) => {
      if (!map(loadings).some((loading) => loading === true)) {
        onDraw(stageRef.current.toDataURL());
      }
    }, 200),
    []
  );

  useEffect(() => {
    if (stageRef && stageRef.current) {
      _onDraw(loadings, stageRef);
    }
  }, [personalized]);

  return (
    <Query query={ARTWORKQUERY} variables={{ id: artworkId }}>
      {({ data, loading, error }) => {
        if (loading) {
          return <Skeleton active={true} />;
        }
        if (error) {
          return <Alert message={error.message} type="error" />;
        }
        if (data) {
          const artwork = data.artwork;
          const layers = artwork.templates[0].layers;
          var r = max([artwork.width, artwork.height]);
          var res = 10,
            ratio = 1;
          for (; res > 1; res--) {
            if (r * res <= 10000) {
              break;
            }
          }
          ratio = res / 10;
          var defaultPersonalized = {};
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
                    defaultPersonalized[layer.id] =
                      layer.personalized.default.file;
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
          var _personalized = { ...defaultPersonalized, ...personalized };
          return (
            <Stage
              width={artwork.width * ratio}
              height={artwork.height * ratio}
              ref={stageRef}
            >
              <Layer>
                {layers.map((layer) => {
                  switch (layer.type) {
                    case "Group":
                      return (
                        <Group
                          layer={layer}
                          key={layer.id}
                          ratio={ratio}
                          personalized={_personalized}
                          onLoading={(status) =>
                            setLoadings({ ...loadings, [layer.id]: status })
                          }
                        />
                      );
                    case "Image":
                      return (
                        <Image
                          layer={layer}
                          key={layer.id}
                          ratio={ratio}
                          personalized={_personalized}
                          onLoading={(status) =>
                            setLoadings({ ...loadings, [layer.id]: status })
                          }
                        />
                      );
                    case "Text":
                      return (
                        <Text
                          layer={layer}
                          key={layer.id}
                          personalized={_personalized}
                          onLoading={(status) =>
                            setLoadings({ ...loadings, [layer.id]: status })
                          }
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </Layer>
            </Stage>
          );
        }
      }}
    </Query>
  );
};

export default ArtworkPreview;
