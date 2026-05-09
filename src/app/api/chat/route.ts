import { createClient } from "@/lib/supabase/server";
import { getAgent } from "@/lib/ai-agents";
import { calculateChart } from "@/lib/astro-engine/calculations";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
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
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 1024,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
