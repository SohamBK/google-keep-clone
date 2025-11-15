import axiosClient from "../../../api/axiosClient";

export const notesApi = {
  createNote: (payload: any) => axiosClient.post("/note/", payload),

  updateStatus: (noteId: string, updates: any) =>
    axiosClient.patch(`/note/${noteId}/status/`, updates),

  fetchNotes: (page: number, limit: number) =>
    axiosClient.get(`/note/?page=${page}&limit=${limit}`),

  fetchArchived: (page: number, limit: number) =>
    axiosClient.get(`/note/archived?page=${page}&limit=${limit}`),
};
