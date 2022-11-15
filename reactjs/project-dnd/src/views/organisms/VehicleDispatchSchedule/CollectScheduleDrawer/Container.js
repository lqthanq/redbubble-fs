import { useStyles } from "./styles";

/**
 * 　を表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, values = [], droppableId = 'schedules', draggableId = 'schedules', ...props }) => {
  const classes = useStyles();
  console.log('values.SCHEDULE: ', values)
  return render({
    classes,
    sideBarItems: values,
    droppableId: droppableId,
    draggableId: draggableId,
    ...props,
  });
};
export default Container;
