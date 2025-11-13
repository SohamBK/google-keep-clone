import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return response.data.data; // contains userId, email, accessToken
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data.data; // { userId, email }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);
