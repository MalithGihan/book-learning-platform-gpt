import OpenAI from "openai";

const apiKey = (process.env.AI_API_KEY || "").trim();
if (!apiKey) {
  throw new Error("Missing AI_API_KEY (server env)");
}

const client = new OpenAI({
  apiKey,
  baseURL: process.env.AI_BASE_URL || undefined,
});

export async function generateAiReply(opts: {
  userMessage: string;
  context?: Record<string, unknown>;
}) {
  const model = process.env.AI_MODEL || "gpt-5-mini";

  const instructions =
    "You are the BookLMS assistant. Help users with courses, enrollments, pricing, and platform usage. " +
    "Be clear and concise. If info is missing, ask one short follow-up question.";

  const input = [
    {
      role: "user" as const,
      content:
        (opts.context ? `Context: ${JSON.stringify(opts.context)}\n\n` : "") +
        `User: ${opts.userMessage}`,
    },
  ];

  const response = await client.responses.create({
    model,
    instructions,
    input,
  });

  return {
    text: response.output_text ?? "",
    rawId: response.id,
  };
}
