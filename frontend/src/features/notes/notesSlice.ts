import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createNote, updateNoteStatus } from "./notesThunks";
import toast from "react-hot-toast";
import { type Note } from "./types";

interface NotesState {
  items: Note[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  isLoading: false,
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Note
    builder
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false;
        state.items.unshift(action.payload); // Add new note to top
        toast.success("Note created!");
      })
      .addCase(createNote.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to create note");
      })
      .addCase(updateNoteStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNoteStatus.fulfilled, (state, action) => {
        state.isLoading = false;

        const updatedNote = action.payload;

        // Replace updated note in state.items
        state.items = state.items.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        );

        toast.success("Note updated!");
      })
      .addCase(updateNoteStatus.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to update note");
      });
  },
});

export default notesSlice.reducer;
