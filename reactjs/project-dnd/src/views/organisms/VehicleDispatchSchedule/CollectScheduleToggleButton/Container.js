import { onOpenDialog } from "ducks/Dialog/slice";
import { useDispatch } from "react-redux";

/**
 * 　定期回収アイコンボタンを表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, ...props }) => {
  const dispatch = useDispatch();

  return render({
    onOpenDrawer: () => dispatch(onOpenDialog("DrawerOnRight")),
    ...props,
  });
};
export default Container;
