"use client";
import { useState, useRef, useEffect } from "react";
import { useUserChart } from "@/lib/user-chart";
import { getAgentList, type AgentType } from "@/lib/ai-agents";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { EducationTooltip } from "@/components/education-tooltip";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { chart, loading } = useUserChart();
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("career");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const agents = getAgentList();

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chart || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent,
          messages: [...messages, userMessage],
          chartData: chart,
        }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        assistantMessage += decoder.decode(value);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not get response from agent" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !chart) {
    return (
      <main style={{ minHeight: "100vh", background: "#060410", padding: "30px 22px 110px", color: "#f0e8d0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", paddingTop: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Loading chart...</div>
          <div style={{ fontSize: "14px", color: "#b8b0d8" }}>Please complete onboarding to access AI agents.</div>
        </div>
        <MobileBottomNav />
      </main>
    );
  }

  const currentAgent = agents.find((a) => a.id === selectedAgent);

  return (
    <main style={{ minHeight: "100vh", background: "#060410", display: "flex", flexDirection: "column" }}>
      <style>{`
        .chat-header { background: #0d0a22; border-bottom: 1px solid #1c1840; padding: 16px 20px; }
        .chat-agent-name { font-size: 16px; font-weight: 700; color: "#f0e8d0"; margin-bottom: 4px; }
        .chat-agent-title { font-size: 12px; color: "#b8b0d8"; }
        .chat-agents-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; overflow-x: auto; padding: 12px 20px; border-bottom: 1px solid #1c1840; }
        .chat-agent-btn { background: #0d0a22; border: 1px solid #1c1840; border-radius: 8px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.2s; color: #b8b0d8; }
        .chat-agent-btn:hover { border-color: #c8a030; background: rgba(200, 160, 48, 0.05); }
        .chat-agent-btn.active { border-color: currentColor; background: rgba(200, 160, 48, 0.15); color: #c8a030; }
        .chat-emoji { font-size: 20px; display: block; margin-bottom: 4px; }
        .chat-label { font-size: 10px; font-weight: 700; }
        .chat-body { flex: 1; overflow-y: auto; padding: 20px; max-width: 800px; margin: 0 auto; width: 100%; }
        .chat-msg { margin-bottom: 16px; display: flex; gap: 12px; }
        .chat-msg.user { justify-content: flex-end; }
        .chat-bubble { max-width: 70%; padding: 12px 16px; border-radius: 10px; font-size: 13px; line-height: 1.6; }
        .chat-msg.assistant .chat-bubble { background: #0d0a22; border: 1px solid #1c1840; color: #f0e8d0; }
        .chat-msg.user .chat-bubble { background: #c8a030; color: #060410; }
        .chat-footer { padding: 16px 20px; border-top: 1px solid #1c1840; background: #0d0a22; max-width: 800px; margin: 0 auto; width: 100%; }
        .chat-input-wrapper { display: flex; gap: 8px; }
        .chat-input { flex: 1; background: #08051a; border: 1px solid #1c1840; border-radius: 8px; padding: 12px 14px; color: #f0e8d0; font-family: inherit; }
        .chat-send { background: #c8a030; border: none; border-radius: 8px; padding: 12px 20px; color: #060410; font-weight: 700; cursor: pointer; }
        .chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="chat-header">
        <div className="chat-agent-name">
          {currentAgent?.emoji} {currentAgent?.name}
        </div>
        <div className="chat-agent-title">{currentAgent?.description}</div>
      </div>

      <div className="chat-agents-grid">
        {agents.map((agent) => (
          <button
            key={agent.id}
            className={`chat-agent-btn ${selectedAgent === agent.id ? "active" : ""}`}
            onClick={() => {
              setSelectedAgent(agent.id);
              setMessages([]);
            }}
            style={{ color: selectedAgent === agent.id ? agent.color : undefined }}
          >
            <span className="chat-emoji">{agent.emoji}</span>
            <span className="chat-label">{agent.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="chat-body">
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#b8b0d8", paddingTop: "40px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{currentAgent?.emoji}</div>
            <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
              {currentAgent?.name}
            </div>
            <div style={{ fontSize: "12px", marginBottom: "24px" }}>
              {currentAgent?.title}
            </div>
            <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#8b80bf" }}>
              <strong>Try asking:</strong>
              <div style={{ marginTop: "12px" }}>
                {currentAgent?.exampleQuestions.slice(0, 3).map((q, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    • {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-msg assistant">
                <div className="chat-bubble" style={{ color: "#a855f7" }}>
                  ✨ Agent is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </>
        )}
      </div>

      <div className="chat-footer">
        <div className="chat-input-wrapper">
          <input
            className="chat-input"
            type="text"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            className="chat-send"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
        <div style={{ fontSize: "10px", color: "#605890", marginTop: "8px", textAlign: "center" }}>
          <EducationTooltip term="dasha">About Dasha periods</EducationTooltip> •{" "}
          <EducationTooltip term="yoga">Auspicious Yogas</EducationTooltip> •{" "}
          <EducationTooltip term="dosha">Understanding Doshas</EducationTooltip>
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
