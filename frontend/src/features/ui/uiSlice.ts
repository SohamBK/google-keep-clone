import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Note } from "../notes/types";

interface UIState {
  viewNote: Note | null;
}

const initialState: UIState = {
  viewNote: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openViewNote(state, action: PayloadAction<Note>) {
      state.viewNote = action.payload;
    },
    closeViewNote(state) {
      state.viewNote = null;
    },
  },
});

export const { openViewNote, closeViewNote } = uiSlice.actions;
export default uiSlice.reducer;
