import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthState } from "./types";

const initialState: AuthState = {
  userId: undefined,
  email: undefined,
  accessToken: undefined,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        userId: string;
        email: string;
        accessToken: string;
      }>
    ) {
      state.isLoading = false;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.userId = undefined;
      state.email = undefined;
      state.accessToken = undefined;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
