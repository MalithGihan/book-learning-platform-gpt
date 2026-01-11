/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../app/api";

export type Course = {
  _id: string;
  title?: string;
  description?: string;
  // Add your real fields later (price, category, etc.)
};

function asCourses(resp: any): Course[] {
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.courses)) return resp.courses;
  if (Array.isArray(resp?.data)) return resp.data;
  return [];
}

function asCourse(resp: any): Course {
  return (resp?.course ?? resp?.data ?? resp) as Course;
}

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], { viewer: "guest" | "user" }>({
      query: () => "/courses",
      transformResponse: asCourses,
      providesTags: (result) =>
        result
          ? [
              { type: "Courses" as const, id: "LIST" },
              ...result.map((c) => ({ type: "Course" as const, id: c._id })),
            ]
          : [{ type: "Courses" as const, id: "LIST" }],
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      transformResponse: asCourse,
      providesTags: (_res, _err, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      transformResponse: asCourse,
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),

    updateCourse: builder.mutation<
      Course,
      { id: string; patch: Partial<Course> }
    >({
      query: ({ id, patch }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: patch,
      }),
      transformResponse: asCourse,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Course", id: arg.id },
        { type: "Courses", id: "LIST" },
      ],
    }),

    deleteCourse: builder.mutation<{ ok: boolean } | any, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Course", id },
        { type: "Courses", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
