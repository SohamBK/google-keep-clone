export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  NOTES: {
    CREATE: "/note/",
    LIST: "/note/",
    ARCHIVED: "/note/archived",
    UPDATE_STATUS: (id: string) => `/note/${id}/status/`,
  },
};
