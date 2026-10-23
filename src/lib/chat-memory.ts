import { createClient } from "@/lib/supabase/client";

export interface Conversation {
  id: string;
  user_id: string;
  agent_id: string;
  chart_id?: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  created_at: string;
  updated_at: string;
}

export async function saveConversation(
  agentId: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  chartId?: string
): Promise<Conversation | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // In production, this would save to Supabase
    // For now, store in localStorage
    const conversationId = `${agentId}-${Date.now()}`;
    const conversation: Conversation = {
      id: conversationId,
      user_id: user.id,
      agent_id: agentId,
      chart_id: chartId,
      messages,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(`conv-${conversationId}`, JSON.stringify(conversation));
    return conversation;
  } catch (error) {
    console.error("Save conversation error:", error);
    return null;
  }
}

export function getConversationHistory(agentId: string): Conversation[] {
  const conversations: Conversation[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("conv-")) {
      const data = localStorage.getItem(key);
      if (data) {
        const conv = JSON.parse(data);
        if (conv.agent_id === agentId) {
          conversations.push(conv);
        }
      }
    }
  }
  return conversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function clearConversationHistory(agentId: string) {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith("conv-")) {
      const data = localStorage.getItem(key);
      if (data) {
        const conv = JSON.parse(data);
        if (conv.agent_id === agentId) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}
