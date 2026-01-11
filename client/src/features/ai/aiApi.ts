import { api } from "../../app/api";

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
  }),
});

export const { useAiChatMutation } = aiApi;
