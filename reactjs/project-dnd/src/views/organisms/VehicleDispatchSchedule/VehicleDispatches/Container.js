import { useStyles } from "./styles";

/**
 * 配車リストを表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, data, ...props }) => {
  const classes = useStyles();

  return render({
    data: data,
    classes: classes,
    ...props,
  });
};
export default Container;
