import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

interface CreateNotePayload {
  title?: string;
  content: string;
}

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (payload: CreateNotePayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken;

      const response = await axios.post(
        "http://localhost:5000/api/v1/note/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create note";
      return rejectWithValue(message);
    }
  }
);

export const updateNoteStatus = createAsyncThunk(
  "notes/updateNoteStatus",
  async (
    payload: {
      noteId: string;
      updates: { isPinned?: boolean; isArchived?: boolean };
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.accessToken;

      const response = await axios.patch(
        `http://localhost:5000/api/v1/note/${payload.noteId}/status/`,
        payload.updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data.data; // updated note object
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update note status";
      return rejectWithValue(message);
    }
  }
);
