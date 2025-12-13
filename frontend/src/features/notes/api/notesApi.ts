import axiosClient from "../../../api/axiosClient";

export const notesApi = {
  createNote: (payload: any) => axiosClient.post("/note/", payload),

  updateStatus: (noteId: string, updates: any) =>
    axiosClient.patch(`/note/${noteId}/status/`, updates),

  fetchNotes: (page: number, limit: number) =>
    axiosClient.get(`/note/?page=${page}&limit=${limit}`),

  fetchPinned: () => axiosClient.get("/note/pinned"),

  fetchArchived: (page: number, limit: number) =>
    axiosClient.get(`/note/archived?page=${page}&limit=${limit}`),

  fetchTrash: (page: number, limit: number) =>
    axiosClient.get(`/note/trash?page=${page}&limit=${limit}`),

  restoreNote: (id: string) => axiosClient.patch(`/note/${id}/restore`),

  deleteForever: (id: string) =>
    axiosClient.delete(`/note/${id}/permanent-delete`),
};
