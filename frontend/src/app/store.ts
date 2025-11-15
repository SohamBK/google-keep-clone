import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import notesReducer from "../features/notes/notesSlice";
import { setupInterceptors } from "../api/axiosClient";

function loadAuthState() {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return undefined;
    return { auth: JSON.parse(authData) };
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
  preloadedState: loadAuthState(),
  devTools: true,
});

setupInterceptors(store);

store.subscribe(() => {
  const state = store.getState().auth;

  localStorage.setItem(
    "auth",
    JSON.stringify({
      userId: state.userId,
      email: state.email,
      accessToken: state.accessToken,
    })
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
