import { debounce, max, min, omit, sum } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Text as KonvaText } from "react-konva";
import UseImage from "./Utilities/UseImage";
import useFont from "../../hooks/Font";

const Text = (props) => {
  const { fontFamily, _pattern, autofit } = props;
  const txtRef = useRef();

  useFont(fontFamily, () => {
    if (txtRef && txtRef.current) {
      txtRef.current.setAttr("fontFamily", "Arial");
      txtRef.current.getLayer().batchDraw();
      txtRef.current.setAttr("fontFamily", fontFamily);
      adjustText();
    }
  });

  useEffect(() => {
    if (txtRef && txtRef.current) {
      adjustText();
    }
  }, [props.autofit, txtRef]);

  const [img, setImg] = useState();

  const adjustText = () => {
    const node = txtRef.current;
    var txts = node.text().split("\n");
    if (txts.join("") === "") {
      return;
    }
    node.width(node.width() * node.scaleX());
    node.height(node.height() * node.scaleY());
    node.scale({ x: 1, y: 1 });
    if (node.getAttr("autofit")) {
      var txtWidth = max(
        txts.map((txt) => {
          return node.measureSize(txt).width;
        })
      );
      var txtHeight = txts.length * node.textHeight;
      var ratioX = node.width() / txtWidth;
      var ratioY = node.height() / txtHeight;
      var ratio = min([ratioX, ratioY]);
      node.setAttrs({ fontSize: node.getAttr("fontSize") * ratio });
      var i = 0;
      while (
        node.textArr.map((t) => t.text).join("") !== txts.join("") &&
        i < 100 &&
        txts.length * node.textHeight <= node.height()
      ) {
        node.setAttrs({ fontSize: node.getAttr("fontSize") - 0.1 });
        i++;
      }
      node.getLayer().batchDraw();
      node.getLayer().dispatchEvent(new Event("update"));
    }
  };

  useEffect(() => {
    var node = txtRef.current;
    node.on(
      "textChange fontSizeChange letterSpacingChange heightChange widthChange",
      debounce((e) => {
        if (node.getAttr("autofit")) {
          if (e.type !== "fontSizeChange") {
            adjustText(node);
          }
        } else {
          // var txts = node.text().split("\n");
          // var w = max(
          //   txts.map((txt) => {
          //     return node.measureSize(txt).width;
          //   })
          // );
          // if (node.width() < w) {
          //   node.width(w);
          // }
          // var i = 0;
          // while (
          //   node.textArr.map((t) => t.text).join("") !== txts.join("") &&
          //   i < 10
          // ) {
          //   node.width(node.width() + 1);
          //   i++;
          // }
          node.getLayer().batchDraw();
          //window.trRef.current.getLayer().batchDraw();
          node.getLayer().dispatchEvent(new Event("update"));
        }
      }, 200)
    );
  }, [txtRef]);

  const onTransform = debounce((e) => {
    adjustText();
  }, 200);

  return (
    <>
      {_pattern && (
        <UseImage
          url={process.env.CDN_URL + `${210}xauto/` + _pattern?.file.key}
          onLoad={(img) => setImg(img)}
        />
      )}

      <KonvaText
        {...omit(props, [])}
        ref={txtRef}
        onTransform={onTransform}
        onDragMove={() => {}}
        padding={0}
        wrap={autofit ? "none" : "word"}
        ellipsis={true}
        fillPriority={img ? "pattern" : "color"}
        fillPatternImage={_pattern ? img : null}
        verticalAlign="middle"
        dragBoundFunc={(pos) => {
          return {
            ...pos,
            x: pos.x > 0 ? pos.x : 0,
            y: pos.y > 0 ? pos.y : 0,
          };
        }}
      />
    </>
  );
};

export default Text;
