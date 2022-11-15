import { useRef, useMemo, useState, useEffect, Children } from "react";
import { useWindowWidth } from "@react-hook/window-size";
import { times } from "lodash";
const Grid = ({ children, gap = 0, width = 100, style = {} }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const cref = useRef();
  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (cref && cref.current) {
      setContainerWidth(cref.current.getBoundingClientRect().width);
    }
    setTimeout(() => {
      if (cref && cref.current) {
        setContainerWidth(cref.current.getBoundingClientRect().width);
      }
    }, 100);
    setTimeout(() => {
      if (cref && cref.current) {
        setContainerWidth(cref.current.getBoundingClientRect().width);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (cref && cref.current) {
      setContainerWidth(cref.current.getBoundingClientRect().width);
    }
  }, [cref, windowWidth]);

  const missingEls = useMemo(() => {
    var itemPerRow = Math.floor((containerWidth + gap) / (width + gap));
    var count = 0;
    Children.forEach(children, function (child) {
      if (child && child.props) count++;
    });
    return Array((itemPerRow - (count % itemPerRow)) % itemPerRow || 0).fill(0);
  }, [containerWidth, children]);

  return (
    <div
      ref={cref}
      style={{
        ...style,
        display: "grid",
        gap: `${gap}px`,
        gridTemplateColumns: `repeat(auto-fit,minmax(${width}px,1fr))`,
      }}
    >
      {children}
      {!missingEls.length
        ? times(3, (i) => {
            return <div key={i} />;
          })
        : missingEls.map((_, i) => <div key={i} />)}
    </div>
  );
};

export default Grid;
