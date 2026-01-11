/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

function getErrorMessage(data: any, fallback: string) {
  return (
    data?.error ||
    data?.message ||
    (typeof data === "string" && data) ||
    fallback
  );
}

export async function api<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  if (!BASE) throw new Error("Missing VITE_API_BASE_URL");

  const headers = new Headers(init.headers);
  let body = init.body;

  if (init.json !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.json);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body,
    credentials: "include",
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(getErrorMessage(data, `Request failed (${res.status})`));
  }

  return data as T;
}
