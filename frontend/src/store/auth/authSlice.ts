// src/store/auth/authSlice.ts
import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../index";
import type {
  RegisterFormInputs,
  LoginFormInputs,
} from "../../types/validationSchemas";

// Use environment variable for backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ------------------------------------------------------
// Interfaces
// ------------------------------------------------------
interface User {
  userId: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Generic response from backend
interface AuthResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    email: string;
    accessToken?: string; // only present in login response
  };
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------
const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  }
  return null;
};

// Initial state
const initialState: AuthState = {
  user: getInitialUser(),
  accessToken: localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

// ------------------------------------------------------
// Async Thunks
// ------------------------------------------------------

// Register User
export const registerUser = createAsyncThunk<
  AuthResponse, // ✅ return type
  RegisterFormInputs, // ✅ argument type
  { rejectValue: string } // ✅ reject type
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed. Please try again."
    );
  }
});

// Login User
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginFormInputs,
  { rejectValue: string }
>("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      userData
    );
    console.log("respose for login", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
});

// Logout User
export const logoutUser = createAsyncThunk<null, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed.");
    }
  }
);

// ------------------------------------------------------
// Slice
// ------------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
      state.isLoading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Save user data but no access token
        const { userId, email } = action.payload.data;
        state.user = { userId, email };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const { userId, email, accessToken } = action.payload.data;
        state.user = { userId, email };
        state.accessToken = accessToken ?? null;
        localStorage.setItem("user", JSON.stringify(state.user));
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

// ------------------------------------------------------
// Exports
// ------------------------------------------------------
export const { setAuthTokens, clearAuth, clearAuthError } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
