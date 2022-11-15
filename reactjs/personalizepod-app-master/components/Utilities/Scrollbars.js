import { omit } from "lodash";
import CusttomScrollbars from "react-custom-scrollbars";
import { AutoSizer } from "react-virtualized";

const Scrollbars = (props) => {
  const { onScrollEnd } = props;
  const handleUpdate = (values) => {
    if (typeof onScrollEnd === "function") {
      const { scrollTop, scrollHeight, clientHeight } = values;
      const pad = 20; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && scrollTop !== 0) {
      }
    }
  };
  return (
    <div {...omit(props, ["onScrollEnd", "moreLoading", "setMoreLoading"])}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <CusttomScrollbars
              style={{ width }}
              onUpdate={handleUpdate}
              autoHeight
              autoHeightMax={height}
              autoHeightMin={0}
            >
              {props.children}
            </CusttomScrollbars>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default Scrollbars;
