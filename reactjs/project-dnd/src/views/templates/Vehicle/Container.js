import { onOpenDialog } from "ducks/Dialog/slice";
import { useDispatch, useSelector } from "react-redux";

/**
 * 　を表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, ...props }) => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.Dialog);

  return render({
    onClick: () => dispatch(onOpenDialog("vehicleDialog")),
    open: isOpen.some((e) => e === "vehicleDialog"),

    ...props,
  });
};
export default Container;
