"use client";

import { useState, useRef, useEffect } from "react";
import { formatChartContext, useUserChart } from "@/lib/user-chart";
import type { ChartData } from "@/lib/astro-engine/calculations";

export interface ChartProofChatDrawerProps {
  chart?: ChartData | null;
  mode?: "inline" | "drawer";
  initialAgent?: string;
  initialPrompt?: string;
  onClose?: () => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  emoji?: string;
  proofDrawer?: string | null;
  sources?: string[];
  timestamp: Date;
}

const AGENTS = [
  { id: "general", name: "AstroLife AI", emoji: "✦", desc: "Holistic Vedic Guidance" },
  { id: "career", name: "Career & Karma", emoji: "💼", desc: "10th House, D10 & Dashas" },
  { id: "marriage", name: "Marriage & Love", emoji: "💍", desc: "D9 Navamsha, 7th House & Milan" },
  { id: "wealth", name: "Dhana & Wealth", emoji: "💰", desc: "2nd/11th House & Yogas" },
  { id: "health", name: "Health & Vitality", emoji: "🌿", desc: "6th/8th House & D30" },
  { id: "remedy", name: "Vedic Remedies", emoji: "🕯️", desc: "Mantras, Gems & Fasting" },
  { id: "lalkitab", name: "Lal Kitab", emoji: "📕", desc: "Karmic & Practical Upay" },
];

const SUGGESTIONS_BY_AGENT: Record<string, string[]> = {
  general: [
    "What are the most auspicious planetary yogas in my chart?",
    "Explain my current Mahadasha and what life chapter I am in.",
    "Which planetary placements give me my greatest life strengths?",
  ],
  career: [
    "Does my 10th house and D10 favor business or high-growth job?",
    "When is the next major promotion or career breakout window?",
    "Which industries and roles align with my Lagna and Sun strength?",
  ],
  marriage: [
    "Analyze my 7th house and D9 Navamsha for relationship timing.",
    "Do I have Mangal Dosha, and does it cause any real delay?",
    "What qualities does my chart indicate in my future life partner?",
  ],
  wealth: [
    "What Dhana yogas are present in my Kundli (2nd & 11th houses)?",
    "Which planetary periods bring financial acceleration for me?",
    "How can I manage expenses and build lasting generational wealth?",
  ],
  health: [
    "Which planets govern my physical vitality and daily energy?",
    "What Ayurvedic constitution (Vata/Pitta/Kapha) dominates my chart?",
    "What preventive lifestyle habits align with my 6th house?",
  ],
  remedy: [
    "Which gemstone or planetary mantra is 100% safe for my Lagna?",
    "What simple charitable remedies balance my active Dasha lord?",
    "Suggest a daily morning routine aligned with my planetary strengths.",
  ],
  lalkitab: [
    "What debt of ancestors (Rin) or karmic patterns appear in my chart?",
    "Suggest Lal Kitab remedies for peace, focus, and prosperity.",
    "How should I position my workspace according to Lal Kitab rules?",
  ],
};

function parseProofDrawer(rawText: string): { mainText: string; proofText: string | null } {
  // Check for [PROOF_DRAWER] ... [/PROOF_DRAWER] or similar tag
  const proofMatch = rawText.match(/\[PROOF_DRAWER\]([\s\S]*?)\[\/PROOF_DRAWER\]/i);
  if (proofMatch) {
    const mainText = rawText.replace(/\[PROOF_DRAWER\][\s\S]*?\[\/PROOF_DRAWER\]/i, "").trim();
    return { mainText, proofText: proofMatch[1].trim() };
  }

  // Check for markdown headers like ### Classical Proof or Classical Evidence
  const classicalHeaderMatch = rawText.match(/(?:###|\*\*)\s*(?:Classical Proof|Proof Drawer|Vedic Evidence Trail|Classical Citation)[\s\S]*/i);
  if (classicalHeaderMatch && classicalHeaderMatch.index !== undefined && classicalHeaderMatch.index > 80) {
    const mainText = rawText.slice(0, classicalHeaderMatch.index).trim();
    const proofText = rawText.slice(classicalHeaderMatch.index).trim();
    return { mainText, proofText };
  }

  return { mainText: rawText, proofText: null };
}

export function ChartProofChatDrawer({
  chart: propChart,
  mode = "inline",
  initialAgent = "general",
  initialPrompt,
  onClose,
  className = "",
}: ChartProofChatDrawerProps) {
  const { chart: contextChart } = useUserChart();
  const activeChart = propChart || contextChart;

  const [selectedAgentId, setSelectedAgentId] = useState(initialAgent);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: activeChart
        ? `Namaste **${activeChart.name}**! Main aapka context-aware Vedic Assistant hoon. Aapke **${activeChart.lagnaRashi} Lagna** aur active **${activeChart.dashas.find((d: any) => d.active)?.planet ?? "Dasha"} Mahadasha** ke verified shastric math ke saath main aapke career, vivah, dhan aur timing ke har question ka uttar classical evidence ke saath dunga. Poochiye!`
        : `Namaste! Main AstroLife ka Classical Proof-Backed AI Assistant hoon. Apne janma kundli se juda koi bhi prashna poochein, har prediction ka shastric proof dekhein.`,
      agent: "AstroLife AI",
      emoji: "✦",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const [expandedProofIds, setExpandedProofIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId) || AGENTS[0];
  const suggestions = SUGGESTIONS_BY_AGENT[selectedAgentId] || SUGGESTIONS_BY_AGENT.general;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleProof = (msgId: string) => {
    setExpandedProofIds((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const chartContext = activeChart ? formatChartContext(activeChart) : undefined;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          agentId: selectedAgent.id,
          chartContext,
          vargaContext: activeChart ? `Lagna: ${activeChart.lagnaRashi}, Moon: ${activeChart.planets?.Moon?.sign ?? ""}, Nakshatra: ${activeChart.planets?.Moon?.nakshatra ?? ""}` : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      const rawResponse = data.message || "Dhanyawad. Kripya apna prashna thoda aur spasht karein.";
      const { mainText, proofText } = parseProofDrawer(rawResponse);

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: mainText,
        proofDrawer: proofText,
        agent: data.agent || selectedAgent.name,
        emoji: data.emoji || selectedAgent.emoji,
        sources: data.sources || ["Natal Chart", "Vedic Shastra"],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (proofText) {
        setExpandedProofIds((prev) => ({ ...prev, [assistantMsg.id]: true }));
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: "Kshama karein, network ya server response me deri hui. Kripya punah prayas karein.",
          agent: selectedAgent.name,
          emoji: selectedAgent.emoji,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-[rgba(200,160,48,0.25)] bg-[#FAF7F2]/95 backdrop-blur-md flex flex-col overflow-hidden text-[#1A1A1A] ${
        mode === "drawer" ? "h-[620px] shadow-2xl" : "min-h-[500px]"
      } ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(184,134,11,0.22)] bg-[#FAF7F2]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(200,160,48,0.12)] border border-[rgba(200,160,48,0.3)] flex items-center justify-center text-lg">
            {selectedAgent.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-wide text-[#1A1A1A]">{selectedAgent.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.15)] text-[#15803d] border border-[rgba(34,197,94,0.3)] font-mono">
                Proof-Engine Active
              </span>
            </div>
            <div className="text-[11px] text-[#6B635B]">
              {activeChart ? `Grounded in ${activeChart.name}'s Chart` : "Classical Vedic Engine"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "drawer" && onClose && (
            <button
              onClick={onClose}
              className="text-[#6B635B] hover:text-[#1A1A1A] p-1.5 rounded-lg transition-colors"
              aria-label="Close Drawer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Agent Selector Bar */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[rgba(184,134,11,0.22)] bg-[#FAF7F2] overflow-x-auto no-scrollbar">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedAgentId === agent.id
                ? "bg-[rgba(200,160,48,0.18)] text-[#c8a030] border border-[rgba(200,160,48,0.35)] shadow-[0_0_12px_rgba(200,160,48,0.15)]"
                : "bg-transparent text-[#6B635B] hover:text-[#1A1A1A] hover:bg-[#FAF5EB]"
            }`}
          >
            <span>{agent.emoji}</span>
            <span>{agent.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-sans bg-[#FAF7F2]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed ${
                m.role === "user"
                  ? "bg-[#FAF5EB] text-[#1A1A1A] border border-[rgba(184,134,11,0.3)] shadow-sm"
                  : "bg-[#FFFFFF] text-[#1A1A1A] border border-[rgba(184,134,11,0.2)] shadow-sm"
              }`}
            >
              {/* Agent Tag for Assistant */}
              {m.role === "assistant" && (
                <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-[rgba(184,134,11,0.18)] text-[11px] text-[#6B635B]">
                  <span className="flex items-center gap-1 font-semibold text-[#c8a030]">
                    <span>{m.emoji || "✦"}</span> {m.agent || "AstroLife AI"}
                  </span>
                  {m.sources && (
                    <span className="text-[10px] text-[#6B635B]">
                      {m.sources.join(" · ")}
                    </span>
                  )}
                </div>
              )}

              {/* Message text with newline rendering */}
              <div className="whitespace-pre-line text-[13px]">{m.content}</div>

              {/* Collapsible Classical Proof Accordion */}
              {m.proofDrawer && (
                <div className="mt-3.5 pt-2.5 border-t border-[rgba(200,160,48,0.2)]">
                  <button
                    onClick={() => toggleProof(m.id)}
                    className="flex items-center justify-between w-full text-left py-1 text-xs font-semibold text-[#c8a030] hover:text-[#996f18] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📜</span>
                      <span>Classical Shastric Proof & Math Breakdown</span>
                    </span>
                    <span className="text-[11px] opacity-80">
                      {expandedProofIds[m.id] ? "▲ Hide Proof" : "▼ View Proof"}
                    </span>
                  </button>

                  {expandedProofIds[m.id] && (
                    <div className="mt-2 p-3 rounded-xl bg-[#FAF5EB] border border-[rgba(200,160,48,0.22)] text-[12px] text-[#1A1A1A] font-mono leading-relaxed space-y-2 whitespace-pre-line">
                      <div className="text-[10px] uppercase tracking-wider text-[#B8860B] font-bold">
                        ✦ Classical Sthiti & Rule Verification:
                      </div>
                      <div>{m.proofDrawer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#6B635B] mt-1 px-1">
              {m.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#c8a030] bg-[#FFFFFF] border border-[rgba(184,134,11,0.22)] rounded-xl px-4 py-2.5 w-fit">
            <span className="animate-spin text-sm">🔯</span>
            <span>Parsing planetary degrees & calculating proof trail...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-[#FAF7F2] border-t border-[rgba(184,134,11,0.18)] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase tracking-wider text-[#6B635B] whitespace-nowrap">
          Quick Prompts:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[rgba(184,134,11,0.22)] text-[#6B635B] hover:text-[#c8a030] hover:border-[rgba(200,160,48,0.4)] transition-colors whitespace-nowrap disabled:opacity-50"
          >
            ✦ {s}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-[rgba(184,134,11,0.18)] bg-[#FAF7F2]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${selectedAgent.name} about your chart with classical proof...`}
            disabled={loading}
            className="flex-1 bg-[#FFFFFF] border border-[rgba(184,134,11,0.22)] focus:border-[#c8a030] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#6B635B] outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a030] to-[#996f18] text-[#FFFFFF] font-semibold text-xs transition-all hover:opacity-95 hover:shadow-[0_0_15px_rgba(200,160,48,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Ask AI
          </button>
        </form>
        <div className="text-[10px] text-center text-[#6B635B] mt-1.5">
          Classical Parashara & KP Rule Engine · Zero Manufactured Odds · NASA Ephemeris Verified
        </div>
      </div>
    </div>
  );
}

export default ChartProofChatDrawer;
