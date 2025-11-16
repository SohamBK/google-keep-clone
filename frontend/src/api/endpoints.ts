export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  NOTES: {
    CREATE: "/note/",
    LIST: "/note/",
    ARCHIVED: "/note/archived",
    TRASH: "/note/trash",
    RESTORE: (id: string) => `/note/${id}/restore`,
    PERMANENT_DELETE: (id: string) => `/note/${id}/permanent-delete`,
    UPDATE_STATUS: (id: string) => `/note/${id}/status/`,
  },
};
