import S3Image from "components/Utilities/S3Image";
import {
  Stage,
  Layer,
  Group as KonvaGroup,
  Image as KonvaImage,
  Text as KonvaText,
  Label,
  Tag,
  Rect,
} from "react-konva";
import { useRef, useEffect, useMemo } from "react";
import useImage from "use-image";
import styled from "styled-components";
import { useAppValue } from "context";
import { get, max, min, pick } from "lodash";

const Container = styled.div`
  position: relative;
  height: 0;
  padding-bottom: ${(props) => props.paddingBottom};
  .konvajs-content {
    width: 100% !important;
    height: auto !important;
    canvas {
      width: 100% !important;
      height: auto !important;
    }
  }
`;
const Image = ({ layer, mockupID }) => {
  const imageRef = useRef();
  const [img] = useImage(
    process.env.CDN_URL + `autoxauto/` + layer.file.key,
    process.env.APP_URL
  );
  useEffect(() => {
    if (img) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [img]);
  return <KonvaImage {...layer} image={img} ref={imageRef} />;
};

const Text = ({ layer }) => {
  return <KonvaText {...layer} />;
};

const PrintArea = ({ layer, printAreas, artworkPreviews }) => {
  const printArea = printAreas.find(
    (printArea) => printArea.productBasePrintAreaId === layer.printArea.id
  );
  const [img] = useImage(get(artworkPreviews, get(printArea, "artwork.id")));
  // const [img] = useImage(
  //   "https://v8inhglqwk.execute-api.ap-southeast-1.amazonaws.com//autoxauto/artwork-previews/BqTZTLRVd-0-n7dcqE2kPsWw6VswCGrf5z.png"
  // );

  useEffect(() => {}, [img]);

  const imgProps = useMemo(() => {
    const props = pick(layer, ["width", "height"]);
    props.x = 0;
    props.y = 0;
    const layerRatio = layer.width / layer.height;
    if (img) {
      const imgRatio = img.width / img.height;
      if (imgRatio < layerRatio) {
        props.width = props.height * imgRatio;
        props.x = (layer.width - props.width) / 2;
      } else if (imgRatio > layerRatio) {
        props.height = props.width / imgRatio;
      }
    }
    return props;
  }, [img, layer]);

  return img ? (
    <KonvaGroup {...layer}>
      {layer.perspectiveEnable ? (
        <Rect
          {...layer.perspective}
          fillEnabled={true}
          fillPatternImage={img}
          fillPatternOffset={((img) => {
            return {
              x: layer.perspective.x - imgProps.x,
              y: layer.perspective.y - imgProps.y,
            };
          })(img)}
          fillPatternScale={{
            x: imgProps.width / img.width,
            y: imgProps.width / img.width,
          }}
          fillPatternRepeat={"no-repeat"}
        />
      ) : (
        <Rect
          width={layer.width}
          height={layer.height}
          fillPatternImage={img}
          fillPatternOffset={{
            x: -imgProps.x,
            y: -imgProps.y,
          }}
          fillPatternScale={{
            x: imgProps.width / img.width,
            y: imgProps.width / img.width,
          }}
          fillPatternRepeat={"no-repeat"}
        />
      )}
    </KonvaGroup>
  ) : (
    <Label {...layer}>
      <Tag fill="#5c6ac4" />
      <KonvaText
        text={`Printarea\n${layer.printArea.name}`}
        align="center"
        verticalAlign="middle"
        width={layer.width || 100}
        height={layer.height || 100}
        fill={"#f0f000"}
      />
    </Label>
  );
};

const Group = ({ layer, printAreas, artworkPreviews }) => {
  return (
    <KonvaGroup {...layer}>
      {layer.layers.map((l) => {
        switch (l.type) {
          case "Image":
            return <Image key={l.id} layer={l} />;
          case "Printarea":
            return (
              <PrintArea
                key={l.id}
                layer={l}
                printAreas={printAreas}
                artworkPreviews={artworkPreviews}
              />
            );
          case "Group":
            return <Group key={l.id} layer={l} printAreas={printAreas} />;
          default:
            return null;
        }
      })}
    </KonvaGroup>
  );
};

const MockupPreview = ({ mockup, printAreas }) => {
  console.log(printAreas);
  const [{ artworkPreviews }] = useAppValue();
  return (
    <Container paddingBottom={`${(mockup.height / mockup.width) * 100}%`}>
      <Stage width={mockup.width} height={mockup.height}>
        <Layer>
          {mockup.layers.map((layer) => {
            switch (layer.type) {
              case "Image":
                return <Image key={layer.id} layer={layer} />;
              case "Printarea":
                return (
                  <PrintArea
                    key={layer.id}
                    layer={layer}
                    printAreas={printAreas}
                    artworkPreviews={artworkPreviews}
                  />
                );
              case "Group":
                return (
                  <Group
                    key={layer.id}
                    layer={layer}
                    printAreas={printAreas}
                    artworkPreviews={artworkPreviews}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </Container>
  );
};

export default MockupPreview;
