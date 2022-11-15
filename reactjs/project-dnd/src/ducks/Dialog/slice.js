import { createSlice } from "@reduxjs/toolkit";
const initialState = { isOpen: [] };
const Dialog = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    onOpenDialog: (state, action) => {
      state.isOpen.push(action.payload);
    },
    onCloseDialog: (state, action) => {
      const DeleteItem = state.isOpen.filter((e) => e !== action.payload);
      state.isOpen = DeleteItem;


    },
  },
});
export const { onOpenDialog, onCloseDialog } = Dialog.actions;
export default Dialog.reducer;
