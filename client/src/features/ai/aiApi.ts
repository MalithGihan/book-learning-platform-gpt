import { api } from "../../app/api";

export interface CourseSummary {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  tags: string[];
  price: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  enrollmentStatus?: string | null;
}

type AiSearchResponse = {
  ok: boolean;
  reply?: string;
  courses?: CourseSummary[];
  remaining?: number;
  error?: string;
};

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    aiChat: builder.mutation<
      { ok: boolean; reply?: string; remaining?: number; error?: string },
      { message: string; context?: Record<string, unknown> }
    >({
      query: (body) => ({
        url: "/ai/chat",
        method: "POST",
        body,
      }),
    }),

    aiSearch: builder.mutation<
      AiSearchResponse,
      { message: string; limit?: number }
    >({
      query: (body) => ({
        url: "/ai/search",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAiChatMutation, useAiSearchMutation } = aiApi;
