import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!baseUrl) {
  console.warn("Missing VITE_API_BASE_URL in client/.env");
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl ?? "http://localhost:4000/api/v1",
    credentials: "include",
  }),
 tagTypes: ["Courses", "Course", "Enrollments"],
  endpoints: () => ({}),
});
