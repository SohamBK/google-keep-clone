import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../index";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interface for a single note
interface Note {
  _id: string;
  owner: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  backgroundColor: string;
  collaborators: {
    userId: string;
    email: string;
    permission: "read" | "write";
  }[];
  createdAt: string;
  updatedAt: string;
}

// Interface for the notes state
interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch all notes for the main view
export const fetchAllNotes = createAsyncThunk<
  Note[],
  { page: number; limit: number }
>(
  "notes/fetchAllNotes",
  async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.accessToken) {
        return rejectWithValue("No access token found.");
      }

      const response = await axios.get(`${API_BASE_URL}/note`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        params: { page, limit },
      });
      return response.data.data.notes;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes."
      );
    }
  }
);

// Async thunk to create a new note
export const createNote = createAsyncThunk<
  Note,
  { title: string; content?: string }
>(
  "notes/createNote",
  async ({ title, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.accessToken) {
        return rejectWithValue("No access token found.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/note`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      // The backend returns the newly created note, which we return here
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create note."
      );
    }
  }
);

// Async thunk to update a note's status (pin, archive)
export const updateNoteStatus = createAsyncThunk<
  Note,
  { id: string; isPinned?: boolean; isArchived?: boolean }
>(
  "notes/updateNoteStatus",
  async ({ id, ...updates }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.accessToken) {
        return rejectWithValue("No access token found.");
      }

      const response = await axios.patch(
        `${API_BASE_URL}/note/${id}/status`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update note status."
      );
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notes lifecycle
      .addCase(fetchAllNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllNotes.fulfilled,
        (state, action: PayloadAction<Note[]>) => {
          state.isLoading = false;
          state.notes = action.payload;
        }
      )
      .addCase(fetchAllNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create new note lifecycle
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false;
        state.notes.unshift(action.payload); // Add the new note to the top of the list
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update note status lifecycle
      .addCase(updateNoteStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateNoteStatus.fulfilled,
        (state, action: PayloadAction<Note>) => {
          state.isLoading = false;
          // Find and replace the old note with the updated one in the state
          const index = state.notes.findIndex(
            (note) => note._id === action.payload._id
          );
          if (index !== -1) {
            state.notes[index] = action.payload;
          }
        }
      )
      .addCase(updateNoteStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectNotes = (state: RootState) => state.notes;
export default notesSlice.reducer;
