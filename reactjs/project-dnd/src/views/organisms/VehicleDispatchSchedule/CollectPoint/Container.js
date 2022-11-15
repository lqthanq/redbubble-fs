import { useReducer, useState } from "react";
import { useStyles } from "./styles";
import { v4 } from "uuid"
import { useDispatch } from "react-redux";
import { actAddList, actEditTitle, actMoveCards, actSortTime } from "ducks/Schedules/slice";

const TITLE_DEFAULT = "新しい配車リストを追加する"
/**
 * 　を表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, values = [], ...props }) => {
  const classes = useStyles();
  const [listTitle, setListTitle] = useState(TITLE_DEFAULT);
  const [formOpen, setFormOpen] = useState(false);
  const dispatch = useDispatch()
  console.log("values:", values)
  const handleChangeTextarea = (e) => {
    setListTitle(e.target.value)
  }

  const handleClickAddList = () => {
    const newList = {
      name: listTitle,
      id: v4(),
      cards: []
    }
    dispatch(actAddList(newList))
  }

  return render({

    ListItems: values,
    onClickAddList: handleClickAddList,
    listTitle: listTitle,
    onChangeTextarea: handleChangeTextarea,
    formOpen: formOpen,
    classes: classes,
    onChangeTitle: () => dispatch(actSortTime({ listId: 'wakato-01', sort: 'asc' })),
    ...props,
  });
};
export default Container;
