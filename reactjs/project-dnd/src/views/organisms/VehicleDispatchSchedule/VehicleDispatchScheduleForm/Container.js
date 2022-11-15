import { onCloseDialog } from "ducks/Dialog/slice";
import { actMoveCard } from "ducks/Schedules/slice";
import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";

const INIT_STATE = {
  SCHEDULED: [
    {
      id: 1,
      field: "FM",
      name: "八幡郵便局1",
      productField: "不燃ごみ（3袋～5袋）",
      times: {
        date: "毎日",
        time: "07 : 00 ~ 16 : 00",
      },
    },
    {
      id: 2,
      field: "FM",
      name: "八幡郵便局2",
      productField: "不燃ごみ（3袋～5袋）",
      times: {
        date: "毎日",
        time: "07 : 00 ~ 16 : 00",
      },
    },
    {
      id: 3,
      field: "FM",
      name: "八幡郵便局3",
      productField: "不燃ごみ（3袋～5袋）",
      times: {
        date: "毎日",
        time: "07 : 00 ~ 16 : 00",
      },
    },
    {
      id: 4,
      field: "FM",
      name: "八幡郵便局4",
      productField: "不燃ごみ（3袋～5袋）",
      times: {
        date: "毎日",
        time: "07 : 00 ~ 16 : 00",
      },
    },
    {
      id: 5,
      field: "FM",
      name: "八幡郵便局5",
      productField: "不燃ごみ（3袋～5袋）",
      times: {
        date: "毎日",
        time: "07 : 00 ~ 16 : 00",
      },
    }],
  cources: []
};

const ACTION_TYPES = {
  MOVE: 'move',
  SORT: 'sort',
  ADD: 'add',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.MOVE:
      return {
        ...state,
        ...action.payload
      }
      break;

    case ACTION_TYPES.SORT:
      return {
        ...state,
        ...action.payload
      }

    case ACTION_TYPES.ADD:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state;
  }
};

/**
 * 　を表示するコンポーネントです。
 * @param {*} param0
 * @returns
 */
const Container = ({ render, open = false, ...props }) => {
  //const [{ SCHEDULED, cources }, dispatch2] = useReducer(reducer, INIT_STATE);
  const { SCHEDULED, ListCources } = useSelector(state => state.Schedules)

  const dispatch = useDispatch();
  const handleSubmit = (params) => {
    dispatch(onCloseDialog("vehicleDialog"));
  };
  const handleDragEnd = (results) => {
    const { source, destination, draggableId, type } = results
    console.log("results: ", results)
    if (!destination) {
      return;
    }
    dispatch(actMoveCard({
      DroppableIdStart: source.droppableId,
      DroppableIdEnd: destination.droppableId,
      DroppableIndexStart: source.index,
      DroppableIndexEnd: destination.index,
      draggableId: draggableId
    }))
  }
  // console.log("SCHEDULED: ", SCHEDULED)
  // console.log("ListCources: ", ListCources)
  // const handleDragEnd = (result, provided) => {
  //   console.log("result", result, "provided", provided);
  //   if (!result.destination) {
  //     return;
  //   }

  //   if (result.destination.droppableId === result.source.droppableId) {
  //     if (result.destination.index === result.source.index) {
  //       // 移動しなかった
  //       return;
  //     }
  //   } else {
  //     // 別のドロップ可能箇所にドロップした
  //     let schedules = [...SCHEDULED];
  //     let course = [...cources?.[0] ?? []];

  //     if (result.source.droppableId === 'schedule') {
  //       let obj = schedules[result.source.index];
  //       schedules.splice(result.source.index, 1);
  //       course.splice(result.destination.index, 0, obj);
  //     } else {
  //       let obj = course[result.source.index];
  //       course.splice(result.source.index, 1);
  //       schedules.splice(result.destination.index, 0, obj);
  //     }

  //     dispatch2({
  //       type: ACTION_TYPES.MOVE,
  //       payload: {
  //         SCHEDULE: schedules,
  //         cources: [course]
  //       }
  //     });
  //   }
  // };

  return render({
    SCHEDULED: SCHEDULED,
    ListCources: ListCources,
    open,
    handleDragEnd: handleDragEnd,
    onClose: () => dispatch(onCloseDialog("vehicleDialog")),
    onSubmit: handleSubmit,
    ...props,
  });
};
export default Container;
