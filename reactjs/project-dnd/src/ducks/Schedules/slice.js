const { createSlice } = require("@reduxjs/toolkit");

const INIT_STATE = {
    SCHEDULED: [
        {
            id: "card-4",
            field: "FM",
            name: "八幡郵便局4",
            productField: "不燃ごみ（3袋～5袋）",
            times: {
                date: "毎日",
                time: "07 : 00 ~ 16 : 32",
                createdAt: 1623675112632,
            },
        },
        {
            id: "card-1",
            field: "FM",
            name: "八幡郵便局1",
            productField: "不燃ごみ（3袋～5袋）",
            times: {
                date: "毎日",
                time: "07 : 00 ~ 16 : 27",
                createdAt: 1623675112627,
            },
        },
        {
            id: "card-5",
            field: "FM",
            name: "八幡郵便局5",
            productField: "不燃ごみ（3袋～5袋）",
            times: {
                date: "毎日",
                time: "07 : 00 ~ 16 : 31",
                createdAt: 1623675112631,
            },
        },
    ],
    ListCources: [
        {
            name: "若戸コース",
            id: "wakato-01",
            cards: [
                {
                    id: "card-2",
                    field: "FM",
                    name: "八幡郵便局2",
                    productField: "不燃ごみ（3袋～5袋）",
                    times: {
                        date: "毎日",
                        time: "07 : 00 ~ 16 : 29",
                        createdAt: 1623675112629,
                    },
                },
                {
                    id: "card-3",
                    field: "FM",
                    name: "八幡郵便局3",
                    productField: "不燃ごみ（3袋～5袋）",
                    times: {
                        date: "毎日",
                        time: "07 : 00 ~ 16 : 30",
                        createdAt: 1623675112630,
                    },
                },
            ],
        },
    ],
};

const ScheduleSlice = createSlice({
    name: "schedules",
    initialState: INIT_STATE,
    reducers: {
        actMoveCard: (state, action) => {
            const {
                DroppableIdStart,
                DroppableIdEnd,
                DroppableIndexStart,
                DroppableIndexEnd,
                draggableId,
            } = action.payload;
            console.log("action.payload", action.payload);

            if (DroppableIdStart === DroppableIdEnd) {
                // //配車リスト絞り込み
                // const schedule = state.SCHEDULED.splice(DroppableIndexStart, 1);
                // state.SCHEDULED.splice(DroppableIndexEnd, 0, ...schedule);
                // console.log("01");
                // //コースのリストを絞り込む => ListCard
                // const cardFind = state.ListCources.find(
                //     (list) => list.id === DroppableIdEnd
                // );
                // if (cardFind) {
                //     // console.log("02")
                //     const courceMoved = cardFind.cards.splice(
                //         DroppableIndexStart,
                //         1
                //     );
                //     cardFind.cards.splice(DroppableIndexEnd, 0, ...courceMoved);
                //     // return newState;
                // }

                const result = Array.from(state.SCHEDULED);
                const [removed] = result.splice(DroppableIndexStart, 1);
                result.splice(DroppableIndexEnd, 0, removed);
                state.SCHEDULED = result;
                
            } else if (DroppableIdStart !== DroppableIdEnd) {
                console.log("03");

                //ドロップされたリスト(ListCourcesに)を探す
                const lists = state.ListCources.find(
                    (list) => list.id === DroppableIdEnd
                );
                //ドラッグされたアイテムを追加する
                if (lists && DroppableIdStart === "schedules") {
                    //ドラッグさてたアイテムが配車リストに消える
                    const scheduleMoveList = state.SCHEDULED.splice(
                        DroppableIndexStart,
                        1
                    );
                    console.log("04");
                    // 配車コースからドラッグして配車リストまでドロップする
                    if (scheduleMoveList) {
                        console.log("04.1");
                        lists.cards.splice(
                            DroppableIndexEnd,
                            0,
                            ...scheduleMoveList
                        );
                    }
                }

                //　配車コースからドラッグして別の配車コースまでドロップする
                const listsScheduleStart = state.ListCources.find(
                    (list) => list.id === DroppableIdStart
                );
                // ドラッグされたアイテムが元のリストに消える
                if (listsScheduleStart && DroppableIdEnd !== "schedules") {
                    console.log("05");
                    const scheduleMoveItemStart =
                        listsScheduleStart.cards.splice(DroppableIndexStart, 1);

                    //行先リストを探す
                    const listsScheduleEnd = state.ListCources.find(
                        (list) => list.id === DroppableIdEnd
                    );
                    // ドロップされたアイテムを行先のリストに追加する
                    listsScheduleEnd.cards.splice(
                        DroppableIndexEnd,
                        0,
                        ...scheduleMoveItemStart
                    );
                }
                // state.ListCources.splice(DroppableIndexEnd, 0, ...scheduleMoved)
            } else if (DroppableIdEnd === "schedules") {
                console.log("06");
                //ドラッグされたアイテムが消える

                const listStart = state.ListCources.find(
                    (list) => list.id === DroppableIdStart
                );
                if (listStart != null) {
                    const cardMoved = listStart.cards.splice(
                        DroppableIndexStart,
                        1
                    );
                    //ドロップされたアイテムを追加する
                    state.SCHEDULED.splice(DroppableIndexEnd, 0, ...cardMoved);
                }
                // [state.SCHEDULED[DroppableIndexEnd], state.SCHEDULED[DroppableIndexStart]] = [state.SCHEDULED[DroppableIndexStart], state.SCHEDULED[DroppableIndexEnd]]
            }
            //return state
        },
        actAddList: (state, action) => {
            const newList = action.payload;
            return { ...state, ListCources: [...state.ListCources, newList] };
        },
        actEditTitle: (state, action) => {
            const { listId, newTitle } = action.payload;
            console.log({ listId, newTitle });
            console.log("state :", state);
            // const replaceName = (listId) => {
            //     return state.ListCources.map((item) => {
            //         if (item.id === listId) {
            //             return {
            //                 ...item,
            //                 name: newTitle
            //             }
            //         }
            //         return item;
            //     })
            // }
            //const newListCources = replaceName(listId);
            //state.ListCources = newListCources
            const newList = state.ListCources.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        name: newTitle,
                    };
                }
                return list;
            });

            state.ListCources = newList;
        },
        actMoveCards: (state, action) => {
            const { listId } = action.payload;
            let newCard = [];
            const newList = state.ListCources.map((list) => {
                if (list.id === listId) {
                    newCard = list.cards;
                    return {
                        ...list,
                        cards: [],
                    };
                }
                return list;
            });
            state.ListCources = newList;
            state.SCHEDULED = state.SCHEDULED.concat(newCard);
        },
        actSortTime: (state, action) => {
            const { listId, sort } = action.payload;
            //            console.log('sort' , sort)
            const newList = state.ListCources.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: list.cards.sort((a, b) => {
                            const time1 = a.times.createdAt;
                            const time2 = b.times.createdAt;
                            return sort === "asc"
                                ? time1 - time2
                                : time2 - time1;
                            // if (a.times.createdAt < b.times.createdAt) {

                            // } else if (a.times.createdAt > b.times.createdAt) {
                            //     return sort === 'asc' ? 1 : -1;
                            // }
                            // return 0
                        }),
                    };
                }
                return list;
            });
            state.ListCources = newList;
        },
    },
});
export const {
    actMoveCard,
    actAddList,
    actEditTitle,
    actMoveCards,
    actSortTime,
} = ScheduleSlice.actions;

export default ScheduleSlice.reducer;
