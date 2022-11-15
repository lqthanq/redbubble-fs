import { onCloseDialog } from "ducks/Dialog/slice";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "./styles";

/**
 * 　を表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, children, ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.Dialog);
  return render({
    classes,
    children,
    onCloseDrawer: () => dispatch(onCloseDialog("DrawerOnRight")),
    open: isOpen.some((v) => v === "DrawerOnRight"),

    ...props,
  });
};
export default Container;
