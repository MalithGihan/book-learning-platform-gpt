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
};
