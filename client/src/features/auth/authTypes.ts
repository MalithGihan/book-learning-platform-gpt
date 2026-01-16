export type Role = "student" | "instructor" | "admin";

export type User = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role: Role;
};

export type AuthStatus = "checking" | "authed" | "guest";

export type AuthState = {
  status: AuthStatus;
  user: User | null;
  error: string | null;
  ingVerificationEmail?: string | null;
  sessions: SessionRow[];
  sessionsLoading: boolean;
  sessionsError: string | null;
  sessionsBusyId: string | null;
};

export type Locationish = {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
} | null;

export type SessionRow = {
  id: string;
  ip?: string;
  userAgent?: string;
  createdAt?: string;
  lastUsedAt?: string;
  isCurrent?: boolean;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  } | null;
};

export type RegisterPayload =
  | { kind: "needs_verification"; email: string }
  | { kind: "authed"; user: User };

export type RegisterResult =
  | { kind: "authed"; user: User }
  | { kind: "needs_verification"; email: string };

export type VerifyEmailPayload = { ok: true; user: User };
