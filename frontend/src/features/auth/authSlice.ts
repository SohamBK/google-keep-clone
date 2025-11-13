import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthState } from "./types";
import { loginUser, registerUser } from "./authThunks";
import toast from "react-hot-toast";

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
    logout(state) {
      state.userId = undefined;
      state.email = undefined;
      state.accessToken = undefined;
      localStorage.removeItem("auth");
      toast.success("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            userId: string;
            email: string;
            accessToken: string;
          }>
        ) => {
          state.isLoading = false;
          state.userId = action.payload.userId;
          state.email = action.payload.email;
          state.accessToken = action.payload.accessToken;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              userId: action.payload.userId,
              email: action.payload.email,
              accessToken: action.payload.accessToken,
            })
          );
          toast.success("Login successful!");
        }
      )
      .addCase(loginUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Login failed");
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Registration successful! Please login.");
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Registration failed.");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
