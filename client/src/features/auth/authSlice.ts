/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/http";
import type { AuthState, User } from "./authTypes";

export type Role = "student" | "instructor" | "admin";

function extractUser(payload: any): User | null {
  const u = payload?.user ?? payload?.data ?? payload;
  if (!u) return null;

  if (!u.role || !u.email) return null;

  return u as User;
}

function extractErrorMessage(e: any, fallback: string) {
  return (
    e?.data?.error ||
    e?.data?.message ||
    e?.error ||
    e?.message ||
    fallback
  );
}

export const bootstrapMe = createAsyncThunk<User | null>(
  "auth/bootstrapMe",
  async () => {
    try {
      const data = await api<any>("/auth/me");
      return extractUser(data);
    } catch {
      return null;
    }
  }
);

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    const data = await api<any>("/auth/login", { method: "POST", json: body });
    const user = extractUser(data);
    if (!user) throw new Error("Invalid login response");
    return user;
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Login failed"));
  }
});

export const register = createAsyncThunk<
  User,
  { name?: string; email: string; role: "student" | "instructor"; password: string },
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    const data = await api<any>("/auth/register", { method: "POST", json: body });
    const user = extractUser(data);
    if (!user) throw new Error("Invalid register response");
    return user;
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Register failed"));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api<any>("/auth/logout", { method: "POST" });
    } catch (e: any) {
      return rejectWithValue(extractErrorMessage(e, "Logout failed"));
    }
  }
);

const initialState: AuthState = {
  status: "checking",
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(bootstrapMe.pending, (s) => {
      s.status = "checking";
      s.error = null;
    });
    b.addCase(bootstrapMe.fulfilled, (s, a) => {
      s.user = a.payload;
      s.status = a.payload ? "authed" : "guest";
    });
    b.addCase(bootstrapMe.rejected, (s) => {
      s.user = null;
      s.status = "guest";
    });

    b.addCase(login.pending, (s) => {
      s.error = null;
    });
    b.addCase(login.fulfilled, (s, a) => {
      s.user = a.payload;
      s.status = "authed";
    });
    b.addCase(login.rejected, (s, a) => {
      s.error = a.payload || "Login failed";
      s.user = null;
      s.status = "guest";
    });

    b.addCase(register.pending, (s) => {
      s.error = null;
    });
    b.addCase(register.fulfilled, (s, a) => {
      s.user = a.payload;
      s.status = "authed";
    });
    b.addCase(register.rejected, (s, a) => {
      s.error = a.payload || "Register failed";
      s.user = null;
      s.status = "guest";
    });

    b.addCase(logout.fulfilled, (s) => {
      s.user = null;
      s.status = "guest";
      s.error = null;
    });
    b.addCase(logout.rejected, (s, a) => {
      s.error = a.payload || "Logout failed";
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
