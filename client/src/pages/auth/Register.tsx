import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearAuthError, register } from "../../features/auth/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.auth);
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!email.trim() || !password.trim()) return;

    setSubmitting(true);
    const res = await dispatch(
      register({ name: name.trim() || undefined, email: email.trim(), password }),
    );
    setSubmitting(false);

    if (register.fulfilled.match(res)) {
      nav("/dashboard", { replace: true });
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold">Create account</h1>
      <p className="mt-1 text-sm text-slate-600">Register and start learning.</p>

      {error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-slate-700">Name (optional)</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="text-sm text-slate-700">Email</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-slate-500">Tip: use at least 8 characters.</p>
        </div>

        <button
          disabled={submitting}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-3 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
