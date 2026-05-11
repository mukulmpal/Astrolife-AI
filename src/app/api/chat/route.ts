import { createClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/ai-agents";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { agentId, messages, chartData } = await req.json();

    if (!agentId || !messages || !chartData) {
      return new Response("Missing required fields", { status: 400 });
    }

    const agent = getAgent(agentId);
    if (!agent) {
      return new Response("Invalid agent", { status: 400 });
    }

    const systemPrompt = agent.systemPrompt(chartData);

    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: systemPrompt,
      messages: messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Error: ${message}`, { status: 500 });
  }
}
