/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../app/api";

export type InstructorCourseStat = {
  _id: string;
  title: string;
  enrolledCount: number;
  totalEnrollments: number;
};

function asStats(res: any): InstructorCourseStat[] {
  return (res?.courses || []) as InstructorCourseStat[];
}

export const instructorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorEnrollmentStats: builder.query<InstructorCourseStat[], void>({
      query: () => "/instructor/enrollment-stats",
      transformResponse: asStats,
      providesTags: [{ type: "InstructorStats" as const, id: "ENROLLMENT_STATS" }],
    }),
  }),
});

export const { useGetInstructorEnrollmentStatsQuery } = instructorApi;