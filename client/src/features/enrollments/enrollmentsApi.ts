import { api } from "../../app/api";
import type { Course } from "../courses/coursesApi";

export type Enrollment = {
  _id: string;
  course: Course;   
  createdAt?: string;
  updatedAt?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asEnrollments(resp: any): Enrollment[] {
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.enrollments)) return resp.enrollments;
  if (Array.isArray(resp?.data)) return resp.data;
  return [];
}

export const enrollmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/me",
      transformResponse: asEnrollments,
      providesTags: [{ type: "Enrollments", id: "ME" }],
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enrollCourse: builder.mutation<any, string>({
      query: (courseId) => ({
        url: `/enrollments/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Courses", id: "LIST" },
        { type: "Enrollments", id: "ME" },
      ],
    }),
  }),
});

export const { useGetMyEnrollmentsQuery, useEnrollCourseMutation } = enrollmentsApi;
