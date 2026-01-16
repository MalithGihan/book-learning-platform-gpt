/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:4000/api/v1";

export async function api<T>(path: string, opts?: { method?: string; json?: any }) {
  const r = await fetch(`${BASE}${path}`, {
    method: opts?.method || "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: opts?.json ? JSON.stringify(opts.json) : undefined,
  });

  const text = await r.text();

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON response
    data = { error: text || "Non-JSON error response" };
  }

  if (!r.ok) throw data;
  return data as T;
}
