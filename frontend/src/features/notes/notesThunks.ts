import { createAsyncThunk } from "@reduxjs/toolkit";
import { notesApi } from "./api/notesApi";

interface CreateNotePayload {
  title?: string;
  content: string;
}

interface UpdateNoteStatusPayload {
  noteId: string;
  updates: {
    isPinned?: boolean;
    isArchived?: boolean;
  };
}

interface FetchNotesParams {
  page?: number;
  limit?: number;
}

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (payload: CreateNotePayload, { rejectWithValue }) => {
    try {
      const res = await notesApi.createNote(payload);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create note"
      );
    }
  }
);

export const updateNoteStatus = createAsyncThunk(
  "notes/updateNoteStatus",
  async ({ noteId, updates }: UpdateNoteStatusPayload, { rejectWithValue }) => {
    try {
      const res = await notesApi.updateStatus(noteId, updates);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update note"
      );
    }
  }
);

export const fetchPinnedNotes = createAsyncThunk(
  "notes/fetchPinnedNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notesApi.fetchPinned();
      return res.data.data.notes;
    } catch (err: any) {
      return rejectWithValue("Failed to fetch pinned notes");
    }
  }
);

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (params: FetchNotesParams | undefined, { rejectWithValue }) => {
    try {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;

      const res = await notesApi.fetchNotes(page, limit);

      const { notes, hasNextPage } = res.data.data;

      return { notes, page, hasNextPage };
    } catch (err: any) {
      return rejectWithValue("Failed to fetch notes");
    }
  }
);

export const fetchArchivedNotes = createAsyncThunk(
  "notes/fetchArchivedNotes",
  async (params: FetchNotesParams | undefined, { rejectWithValue }) => {
    try {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 20;

      const res = await notesApi.fetchArchived(page, limit);

      const { notes, totalPages, hasNextPage } = res.data.data;

      return { notes, page, totalPages, hasNextPage };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch archived notes"
      );
    }
  }
);

export const fetchTrashNotes = createAsyncThunk(
  "notes/fetchTrashNotes",
  async (params: FetchNotesParams | undefined, { rejectWithValue }) => {
    try {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 20;

      const res = await notesApi.fetchTrash(page, limit);

      const { notes, totalPages, hasNextPage } = res.data.data;

      return { notes, page, totalPages, hasNextPage };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch trash notes"
      );
    }
  }
);

export const restoreNote = createAsyncThunk(
  "notes/restoreNote",
  async (noteId: string, { rejectWithValue }) => {
    try {
      const res = await notesApi.restoreNote(noteId);
      return res.data.data; // return restored note
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Restore failed");
    }
  }
);

export const deleteNoteForever = createAsyncThunk(
  "notes/deleteNoteForever",
  async (noteId: string, { rejectWithValue }) => {
    try {
      await notesApi.deleteForever(noteId);
      return noteId; // return ID so we can remove it from Redux
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Permanent delete failed"
      );
    }
  }
);

export const softDeleteNote = createAsyncThunk(
  "notes/softDeleteNote",
  async (noteId: string, { rejectWithValue }) => {
    try {
      const res = await notesApi.softDelete(noteId);
      return res.data.data; // deleted note object
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to move note to trash"
      );
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async (
    {
      noteId,
      updates,
    }: { noteId: string; updates: { title?: string; content?: string } },
    { rejectWithValue }
  ) => {
    try {
      const res = await notesApi.update(noteId, updates);
      return res.data.data; // updated note
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update note"
      );
    }
  }
);

export const addNoteTags = createAsyncThunk(
  "notes/addTags",
  async (
    { noteId, tags }: { noteId: string; tags: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await notesApi.addTags(noteId, tags);
      return res.data.data;
    } catch {
      return rejectWithValue("Failed to add tags");
    }
  }
);

export const removeNoteTags = createAsyncThunk(
  "notes/removeTags",
  async (
    { noteId, tags }: { noteId: string; tags: string[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await notesApi.removeTags(noteId, tags);
      return res.data.data;
    } catch {
      return rejectWithValue("Failed to remove tags");
    }
  }
);
