"use client";

import { createClient } from "@/lib/supabase/client";

export type ChatRole = "user" | "assistant" | "system";

export interface SavedConversation {
  id: string;
  agentId: string;
  title: string;
  updatedAt: string;
}

export interface SavedMessage {
  role: ChatRole;
  content: string;
  model?: string | null;
}

export async function listConversations(): Promise<SavedConversation[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("ai_conversations")
      .select("id,agent_id,title,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(12);

    if (error || !data) return [];

    return data.map((item) => ({
      id: String(item.id),
      agentId: String(item.agent_id ?? "general"),
      title: String(item.title ?? "AstroLife chat"),
      updatedAt: String(item.updated_at),
    }));
  } catch (error) {
    console.warn("Conversation list skipped:", error);
    return [];
  }
}

export async function ensureConversation(conversationId: string | null, agentId: string, titleSeed: string) {
  if (conversationId) return conversationId;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const title = titleSeed.trim().slice(0, 64) || "AstroLife chat";
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        agent_id: agentId,
        title,
      })
      .select("id")
      .single();

    if (error || !data?.id) return null;
    return String(data.id);
  } catch (error) {
    console.warn("Conversation create skipped:", error);
    return null;
  }
}

export async function saveMessage(conversationId: string | null, message: SavedMessage) {
  if (!conversationId) return;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("ai_messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: message.role,
      content: message.content,
      model: message.model ?? null,
    });

    await supabase
      .from("ai_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", user.id);
  } catch (error) {
    console.warn("Message persistence skipped:", error);
  }
}

export async function loadConversationMessages(conversationId: string): Promise<SavedMessage[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("ai_messages")
      .select("role,content,model")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    return data.map((item) => ({
      role: item.role === "assistant" || item.role === "system" ? item.role : "user",
      content: String(item.content),
      model: typeof item.model === "string" ? item.model : null,
    }));
  } catch (error) {
    console.warn("Conversation load skipped:", error);
    return [];
  }
}
