/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/http";
import type {
  AuthState,
  User,
  SessionRow,
  RegisterResult,
} from "./authTypes";

export type Role = "student" | "instructor" | "admin";

function extractUser(payload: any): User | null {
  const u = payload?.user ?? payload?.data ?? payload;
  if (!u) return null;
  if (!u.role || !u.email) return null;
  return u as User;
}

function extractErrorMessage(e: any, fallback: string) {
  return (
    e?.error || e?.message || e?.data?.error || e?.data?.message || fallback
  );
}

export const bootstrapMe = createAsyncThunk<User | null>(
  "auth/bootstrapMe",
  async () => {
    try {
      const data = await api<any>("/auth/me");
      return extractUser(data);
    } catch {
      try {
        await api<any>("/auth/refresh", { method: "POST" });
      } catch {
        return null;
      }
      try {
        const data2 = await api<any>("/auth/me");
        return extractUser(data2);
      } catch {
        return null;
      }
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
  RegisterResult,
  {
    name?: string;
    email: string;
    role: "student" | "instructor";
    password: string;
  },
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    const data = await api<any>("/auth/register", {
      method: "POST",
      json: body,
    });

    if (data?.needsEmailVerification) {
      return {
        kind: "needs_verification",
        email: String(data.email || body.email)
          .toLowerCase()
          .trim(),
      };
    }

    const user = extractUser(data);
    if (!user) throw new Error("Invalid register response");
    return { kind: "authed", user };
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Register failed"));
  }
});

export const verifyEmail = createAsyncThunk<
  User,
  { email: string; code: string },
  { rejectValue: string }
>("auth/verifyEmail", async (body, { rejectWithValue }) => {
  try {
    const data = await api<any>("/auth/verify-email", {
      method: "POST",
      json: body,
    });
    const user = extractUser(data);
    if (!user) throw new Error("Invalid verify response");
    return user;
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Invalid code"));
  }
});

export const resendVerification = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/resendVerification", async (body, { rejectWithValue }) => {
  try {
    await api<any>("/auth/verify-email/resend", { method: "POST", json: body });
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Failed to resend code"));
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

export const loadSessions = createAsyncThunk<
  SessionRow[],
  void,
  { rejectValue: string }
>("auth/loadSessions", async (_, { rejectWithValue }) => {
  try {
    const r = await api<any>("/auth/sessions");
    return (r.sessions || []) as SessionRow[];
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Failed to load sessions"));
  }
});

export const revokeSession = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>("auth/revokeSession", async ({ id }, { rejectWithValue }) => {
  try {
    await api<any>(`/auth/sessions/${id}/revoke`, { method: "POST" });
  } catch (e: any) {
    return rejectWithValue(extractErrorMessage(e, "Failed to revoke session"));
  }
});

export const revokeOtherSessions = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/revokeOtherSessions", async (_, { rejectWithValue }) => {
  try {
    await api<any>("/auth/sessions/revoke-others", { method: "POST" });
  } catch (e: any) {
    return rejectWithValue(
      extractErrorMessage(e, "Failed to revoke other sessions")
    );
  }
});

export const logoutAll = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutAll",
  async (_, { rejectWithValue }) => {
    try {
      await api<any>("/auth/logout-all", { method: "POST" });
    } catch (e: any) {
      return rejectWithValue(extractErrorMessage(e, "Failed to logout all"));
    }
  }
);

const initialState: AuthState = {
  status: "checking",
  user: null,
  error: null,

  sessions: [],
  sessionsLoading: false,
  sessionsError: null,
  sessionsBusyId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearSessionsError(state) {
      state.sessionsError = null;
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
      if (a.payload.kind === "needs_verification") {
        s.user = null;
        s.status = "guest";
        return;
      }

      s.user = a.payload.user;
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
      s.sessions = [];
    });
    b.addCase(logout.rejected, (s, a) => {
      s.error = a.payload || "Logout failed";
    });

    b.addCase(loadSessions.pending, (s) => {
      s.sessionsLoading = true;
      s.sessionsError = null;
    });
    b.addCase(loadSessions.fulfilled, (s, a) => {
      s.sessionsLoading = false;
      s.sessions = a.payload;
    });
    b.addCase(loadSessions.rejected, (s, a) => {
      s.sessionsLoading = false;
      s.sessionsError = a.payload || "Failed to load sessions";
    });

    b.addCase(revokeSession.pending, (s, a) => {
      s.sessionsBusyId = a.meta.arg.id;
      s.sessionsError = null;
    });
    b.addCase(revokeSession.fulfilled, (s) => {
      s.sessionsBusyId = null;
    });
    b.addCase(revokeSession.rejected, (s, a) => {
      s.sessionsBusyId = null;
      s.sessionsError = a.payload || "Failed to revoke session";
    });

    b.addCase(revokeOtherSessions.pending, (s) => {
      s.sessionsBusyId = "revoke-others";
      s.sessionsError = null;
    });
    b.addCase(revokeOtherSessions.fulfilled, (s) => {
      s.sessionsBusyId = null;
    });
    b.addCase(revokeOtherSessions.rejected, (s, a) => {
      s.sessionsBusyId = null;
      s.sessionsError = a.payload || "Failed to revoke other sessions";
    });

    b.addCase(logoutAll.pending, (s) => {
      s.sessionsBusyId = "logout-all";
      s.sessionsError = null;
    });
    b.addCase(logoutAll.fulfilled, (s) => {
      s.sessionsBusyId = null;
      s.sessions = [];
      s.user = null;
      s.status = "guest";
    });
    b.addCase(logoutAll.rejected, (s, a) => {
      s.sessionsBusyId = null;
      s.sessionsError = a.payload || "Failed to logout all";
    });
    b.addCase(verifyEmail.pending, (s) => {
      s.error = null;
    });
    b.addCase(verifyEmail.fulfilled, (s, a) => {
      s.user = a.payload;
      s.status = "authed";
    });
    b.addCase(verifyEmail.rejected, (s, a) => {
      s.error = a.payload || "Invalid code";
    });
  },
});

export const { clearAuthError, clearSessionsError } = authSlice.actions;
export default authSlice.reducer;
