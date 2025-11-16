import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createNote,
  updateNoteStatus,
  fetchNotes,
  fetchArchivedNotes,
  fetchTrashNotes,
  restoreNote,
  deleteNoteForever,
} from "./notesThunks";
import toast from "react-hot-toast";
import { type Note } from "./types";

interface NotesState {
  items: Note[]; // active notes
  archived: Note[]; // archived notes
  page: number;
  totalPages: number;
  hasNextPage: boolean;

  // archived notes pagination
  archivePage: number;
  archiveTotalPages: number;
  archiveHasNextPage: boolean;

  // trash page  and its pagination
  trash: Note[];
  trashPage: number;
  trashTotalPages: number;
  trashHasNextPage: boolean;

  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  archived: [],

  page: 1,
  totalPages: 1,
  hasNextPage: false,

  archivePage: 1,
  archiveTotalPages: 1,
  archiveHasNextPage: false,

  trash: [],
  trashPage: 1,
  trashTotalPages: 1,
  trashHasNextPage: false,

  isLoading: false,
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        toast.success("Note created!");
      })
      .addCase(createNote.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to create note");
      })
      // Update Note Status
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
      })
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        const { notes, page, totalPages, hasNextPage } = action.payload;

        if (page === 1) {
          state.items = notes;
        } else {
          state.items = [...state.items, ...notes];
        }

        state.page = page;
        state.totalPages = totalPages;
        state.hasNextPage = hasNextPage;
      })
      .addCase(fetchNotes.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch notes");
      })

      // Fetch Archived Notes
      .addCase(fetchArchivedNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArchivedNotes.fulfilled, (state, action) => {
        state.isLoading = false;

        const { notes, page, totalPages, hasNextPage } = action.payload;

        if (page === 1) {
          state.archived = notes;
        } else {
          state.archived = [...state.archived, ...notes];
        }

        state.archivePage = page;
        state.archiveTotalPages = totalPages;
        state.archiveHasNextPage = hasNextPage;
      })
      .addCase(fetchArchivedNotes.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Trash page cases
      .addCase(fetchTrashNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrashNotes.fulfilled, (state, action) => {
        state.isLoading = false;

        const { notes, page, totalPages, hasNextPage } = action.payload;

        if (page === 1) {
          state.trash = notes;
        } else {
          state.trash = [...state.trash, ...notes];
        }

        state.trashPage = page;
        state.trashTotalPages = totalPages;
        state.trashHasNextPage = hasNextPage;
      })
      .addCase(fetchTrashNotes.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Restore Note from Trash
      .addCase(restoreNote.fulfilled, (state, action) => {
        const restored = action.payload;

        // Remove from trash
        state.trash = state.trash.filter((n) => n._id !== restored._id);

        // Add back into items list
        state.items.unshift(restored);

        toast.success("Note restored!");
      })
      .addCase(restoreNote.rejected, (state, action: any) => {
        toast.error(action.payload || "Failed to restore note");
      })
      // Delete Note Forever
      .addCase(deleteNoteForever.fulfilled, (state, action) => {
        const id = action.payload;

        // Remove from trash only
        state.trash = state.trash.filter((n) => n._id !== id);

        toast.success("Note permanently deleted");
      })
      .addCase(deleteNoteForever.rejected, (state, action: any) => {
        toast.error(action.payload || "Failed to delete note");
      });
  },
});

export default notesSlice.reducer;
