"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ensureConversation,
  listConversations,
  loadConversationMessages,
  saveMessage,
  type SavedConversation,
} from "@/lib/ai-conversations";
import { formatChartContext, useUserChart } from "@/lib/user-chart";
import { buildAiEngineContext } from "@/lib/ai-engine-context";
import { getAccountAiUsageStatus, getAiUsageStatus, incrementAccountMonthlyAiUsage, type AiUsageStatus } from "@/lib/usage";
import {
  calculateTransitReport,
} from "@/lib/astro-engine/transits";
import { calculateEventRadarReport } from "@/lib/astro-engine/event-radar";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  emoji?: string;
  sources?: string[];
  sourceMeta?: Array<{ source: string; confidence: string; reason: string }>;
}
type LanguageMode = "hindi" | "english" | "hinglish";
type ThemeMode = "dark" | "light";
const CHAT_LANGUAGE_MODE_KEY = "chatLanguageMode";
const CHAT_THEME_MODE_KEY = "chatThemeMode";

function getInitialLanguageMode(): LanguageMode {
  if (typeof window === "undefined") return "hinglish";
  const htmlMode = document.documentElement.dataset.languageMode;
  const stored = window.localStorage.getItem(CHAT_LANGUAGE_MODE_KEY);
  if (htmlMode === "hindi" || htmlMode === "english" || htmlMode === "hinglish") return htmlMode;
  return stored === "hindi" || stored === "english" || stored === "hinglish" ? stored : "hinglish";
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const htmlMode = document.documentElement.dataset.themeMode;
  if (htmlMode === "light" || htmlMode === "dark") return htmlMode;
  return window.localStorage.getItem(CHAT_THEME_MODE_KEY) === "light" ? "light" : "dark";
}

function writeLanguagePreference(mode: LanguageMode) {
  window.localStorage.setItem(CHAT_LANGUAGE_MODE_KEY, mode);
  document.documentElement.dataset.languageMode = mode;
  document.documentElement.lang = mode === "hindi" ? "hi" : "en";
  window.dispatchEvent(new Event("astrolife-preferences-change"));
}

function writeThemePreference(mode: ThemeMode) {
  window.localStorage.setItem(CHAT_THEME_MODE_KEY, mode);
  document.documentElement.dataset.themeMode = mode;
  document.body.dataset.themeMode = mode;
  window.dispatchEvent(new Event("astrolife-preferences-change"));
}

const SOURCE_LINKS: Record<string, string> = {
  "Natal Chart": "/dashboard/kundli",
  "Full Engine Context": "/dashboard/report",
  "Transit/Gochar": "/dashboard/transits",
  "Daily Feed": "/dashboard/panchang",
};

const AGENTS = [
  { id:"general",    name:"AstroLife AI",  emoji:"✦",  desc:"General astrology guidance"     },
  { id:"career",     name:"Career",        emoji:"📈", desc:"Profession & success timing"    },
  { id:"marriage",   name:"Marriage",      emoji:"💑", desc:"Love, relationships & timing"   },
  { id:"karmic",     name:"Karmic",        emoji:"☯️", desc:"Past life & soul lessons"       },
  { id:"wealth",     name:"Wealth",        emoji:"💰", desc:"Money, finance & prosperity"    },
  { id:"health",     name:"Health",        emoji:"🌿", desc:"Medical astrology & wellness"   },
  { id:"psychology", name:"Psychology",    emoji:"🧠", desc:"Mind, emotions & personality"  },
  { id:"remedy",     name:"Remedy",        emoji:"🕯️", desc:"Mantras, gems & rituals"       },
  { id:"lalkitab",   name:"Lal Kitab",     emoji:"📕", desc:"Red Book karmic remedies"      },
  { id:"spiritual",  name:"Spiritual",     emoji:"🙏", desc:"Dharma, moksha & soul path"    },
];

const SUGGESTED = [
  "What does my Saturn placement mean?",
  "When will I get married?",
  "What career suits my chart?",
  "Tell me about my Rahu-Ketu axis",
  "What are my wealth yogas?",
  "What remedies do I need?",
  "Which raga suits my chart today?",
  "Suggest a sound remedy for sleep and calm mind?",
  "What Astro Sound protocol should I follow for focus?",
  "Which raga is good for my current emotional state?",
];

const WELCOMES: Record<string, string> = {
  general:    "✦ Namaste! I am AstroLife AI — your personal Vedic astrology guide.\n\nI combine the wisdom of Vedic astrology, Lal Kitab, KP System, and modern psychology to give you deep, personalized insights.\n\nShare your birth details or ask me anything about your chart!",
  career:     "📈 Namaste! I am your Career Astrology Agent.\n\nI specialize in career timing, profession analysis, and success periods using your 10th house, D-10 chart, and planetary dashas.\n\nShare your birth details and I'll reveal your ideal career path!",
  marriage:   "💑 Namaste! I am your Marriage & Relationship Agent.\n\nI analyze your 7th house, Venus, and Navamsha chart to reveal your relationship patterns and marriage timing.\n\nWhat would you like to know about your love life?",
  karmic:     "☯️ Namaste, dear soul. I am your Karmic Intelligence Agent.\n\nThrough your Rahu-Ketu axis and past-life indicators, I reveal the deeper purpose of your current incarnation.\n\nWhat karmic patterns shall we explore today?",
  wealth:     "💰 Namaste! I am your Wealth & Finance Agent.\n\nUsing your 2nd, 11th house, and Dhana yogas, I reveal your wealth potential and best timing for financial growth.\n\nAsk me about your wealth yogas!",
  health:     "🌿 Namaste! I am your Medical Astrology Agent.\n\nI analyze your 6th and 8th houses to reveal health vulnerabilities and healing periods.\n\nNote: Always consult a qualified doctor for medical decisions.",
  psychology: "🧠 Namaste! I am your Psychology & Mind Agent.\n\nThrough your Moon sign, nakshatra, and Mercury placement, I reveal your emotional patterns and mental strengths.\n\nLet's explore your emotional blueprint!",
  remedy:     "🕯️ Namaste! I am your Vedic Remedy Agent.\n\nI specialize in practical, affordable remedies — mantras, gemstones, charity, and rituals that create real change.\n\nTell me your challenges and I'll prescribe the right remedy!",
  lalkitab:   "📕 Namaste! I am your Lal Kitab Specialist.\n\nThe Red Book of astrology has unique remedies that are simple, cheap, and remarkably effective.\n\nAsk me about your Lal Kitab chart or remedies!",
  spiritual:  "🙏 Namaste dear seeker! I am your Spiritual Growth Agent.\n\nThrough your 9th house, Jupiter, and moksha indicators, I reveal your dharmic path and ideal spiritual practices.\n\nWhat is your spiritual question today?",
};

export default function ChatPage() {
  const [supabase] = useState(() => createClient());
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [usageStatus, setUsageStatus] = useState<AiUsageStatus>(() => ({
    enforcementEnabled: false,
    isBlocked: false,
    isUnlimited: false,
    limit: 5,
    used: 0,
    left: 5,
  }));
  const [usageReady, setUsageReady] = useState(false);  const [messages, setMessages] = useState<Message[]>(() => [{
    role: "assistant",
    content: WELCOMES[AGENTS[0].id] || WELCOMES.general,
    agent: AGENTS[0].name,
    emoji: AGENTS[0].emoji,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [languageMode, setLanguageMode] = useState<LanguageMode>(getInitialLanguageMode);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { chart } = useUserChart();
  const changeLanguageMode = (mode: LanguageMode) => {
    if (typeof window !== "undefined") writeLanguagePreference(mode);
    setLanguageMode(mode);
  };
  const changeThemeMode = (mode: ThemeMode) => {
    if (typeof window !== "undefined") writeThemePreference(mode);
    setThemeMode(mode);
  };
  const aiEngineContext = useMemo(() => {
    if (!chart) return "";
    return buildAiEngineContext(chart);
  }, [chart]);
  const transitContext = useMemo(() => {
    if (!chart) return "";
  
    try {
      const transitChart = normalizeChartForTransit(chart);
  
      const transitReport = calculateTransitReport({
        chart: transitChart,
        base: "moon",
        date: new Date(),
      });
  
      return transitReport.aiContext;
    } catch (error) {
      console.warn("Transit context failed:", error);
      return "";
    }
  }, [chart]);
  const dailyFeedContext = useMemo(() => {
    if (!chart) return "";

    try {
      const transitChart = normalizeChartForTransit(chart);
      const today = new Date();
      today.setHours(12, 0, 0, 0);

      const transit = calculateTransitReport({
        chart: transitChart,
        base: "moon",
        date: today,
      });
      const radar = calculateEventRadarReport({
        chart: transitChart,
        startDate: today,
        days: 7,
        base: "moon",
      });
      const panchang = calculatePanchang(today, transitChart.tz);
      const topArea = [...transit.areaScores].sort((a, b) => b.score - a.score)[0];
      const cautionCount = transit.alerts.filter((a) => a.severity === "high" || a.severity === "medium").length;
      const opportunityCount = transit.alerts.filter((a) => a.type === "opportunity").length;
      const todayRadar = radar.days[0];

      return [
        `Panchang: ${panchang.tithi}, ${panchang.nakshatra}, ${panchang.yoga}, ${panchang.paksha} Paksha.`,
        `Transit Pulse: Best area ${topArea.area} (${topArea.score}/100), opportunities ${opportunityCount}, cautions ${cautionCount}.`,
        `Event Radar: Today score ${todayRadar?.overallScore ?? "-"} / 100, best day ${radar.bestDay.label}, caution day ${radar.cautionDay.label}.`,
        `Recommended remedy: ${todayRadar?.remedy ?? "Keep routine stable and avoid impulsive decisions."}`,
      ].join("\n");
    } catch (error) {
      console.warn("Daily feed context failed:", error);
      return "";
    }
  }, [chart]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    writeLanguagePreference(languageMode);
  }, [languageMode]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    writeThemePreference(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const loadPlan = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
  setUsageStatus(getAiUsageStatus(null));
  setUsageReady(true);
  return;
}

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", data.user.id)
        .maybeSingle();

      const tier = typeof profile?.subscription_tier === "string" ? profile.subscription_tier : null;
      setSubscriptionTier(tier);
      setUsageStatus(await getAccountAiUsageStatus(tier));
      setUsageReady(true);
    };

    loadPlan().finally(() => setUsageReady(true));
    listConversations().then(setConversations);
    }, [supabase]);

  const resetChat = (agent = activeAgent) => {
    setConversationId(null);
    setMessages([{
      role: "assistant",
      content: WELCOMES[agent.id] || WELCOMES.general,
      agent: agent.name,
      emoji: agent.emoji,
    }]);
  };

  const switchAgent = (agent: typeof AGENTS[number]) => {
    setActiveAgent(agent);
    resetChat(agent);
  };

  const openConversation = async (conversation: SavedConversation) => {
    const agent = AGENTS.find((item) => item.id === conversation.agentId) || AGENTS[0];
    const savedMessages = await loadConversationMessages(conversation.id);
    if (savedMessages.length === 0) return;

    setActiveAgent(agent);
    setConversationId(conversation.id);
    setMessages(savedMessages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
        agent: message.role === "assistant" ? agent.name : undefined,
        emoji: message.role === "assistant" ? agent.emoji : undefined,
      })));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    const currentUsage = getAiUsageStatus(subscriptionTier);
    if (currentUsage.isBlocked) {
      setUsageStatus(currentUsage);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Free monthly limit poori ho chuki hai. Upgrade karo to continue, ya testing mode off hone tak wait karo.",
        agent: activeAgent.name,
        emoji: activeAgent.emoji,
      }]);
      return;
    }

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const nextConversationId = await ensureConversation(conversationId, activeAgent.id, content);
      if (nextConversationId) {
        setConversationId(nextConversationId);
        await saveMessage(nextConversationId, { role: "user", content });
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          agentId: activeAgent.id,
          chartContext: formatChartContext(chart),
          aiEngineContext,
          transitContext: transitContext,
          dailyFeedContext,
          languageMode,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (!subscriptionTier || subscriptionTier === "free") {
        if (data.usage?.trackedOnServer && typeof data.usage.left === "number") {
          setUsageStatus({
            enforcementEnabled: Boolean(data.usage.enforced),
            isBlocked: Boolean(data.usage.enforced) && data.usage.left === 0,
            isUnlimited: false,
            limit: Number(data.usage.limit),
            used: Number(data.usage.used),
            left: Number(data.usage.left),
          });
        } else {
          await incrementAccountMonthlyAiUsage();
          setUsageStatus(await getAccountAiUsageStatus("free"));
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message,
        agent: data.agent,
        emoji: data.emoji,
        sources: Array.isArray(data.sources) ? data.sources : [],
        sourceMeta: Array.isArray(data.sourceMeta) ? data.sourceMeta : [],
      }]);

      await saveMessage(nextConversationId, {
        role: "assistant",
        content: data.message,
        model: data.model,
      });
      setConversations(await listConversations());
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry dost, kuch error aa gaya. Please try again! 🙏",
        agent: activeAgent.name,
        emoji: activeAgent.emoji,
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const formatMessage = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/✦/g, '<span style="color:#c8a030">✦</span>')
      .replace(/\n/g, "<br/>");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}

        .chat-layout{display:flex;height:100vh;overflow:hidden}

        /* SIDEBAR */
        .agents-sidebar{width:220px;flex-shrink:0;background:#0a0720;border-right:1px solid #1c1840;display:flex;flex-direction:column}
        .agents-header{padding:20px 16px 12px;border-bottom:1px solid #1c1840}
        .agents-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#605890}
        .agents-list{flex:1;overflow-y:auto;padding:8px}
        .agent-btn{width:100%;display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;border:none;background:none;cursor:pointer;transition:all 0.2s;text-align:left;margin-bottom:2px}
        .agent-btn:hover{background:rgba(255,255,255,0.04)}
        .agent-btn.active{background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.2)}
        .agent-emoji{font-size:18px;width:24px;text-align:center;flex-shrink:0}
        .agent-name{font-size:12px;font-weight:500;color:#c8c0a8;display:block}
        .agent-desc{font-size:10px;color:#605890;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
        .agent-btn.active .agent-name{color:#c8a030}
        .history-section{border-top:1px solid #1c1840;padding:10px 8px 12px;max-height:210px;overflow-y:auto}
        .history-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#605890;padding:0 8px 8px}
        .history-btn{width:100%;border:none;background:transparent;text-align:left;border-radius:8px;padding:8px;color:#605890;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s}
        .history-btn:hover{background:rgba(200,160,48,0.06);color:#c8c0a8}
        .history-btn.active{background:rgba(200,160,48,0.1);color:#c8a030}
        .history-name{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .history-meta{font-size:9px;color:#3a3060;margin-top:2px}

        /* MAIN */
        .chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden}

        /* HEADER */
        .chat-header{padding:16px 24px;border-bottom:1px solid #1c1840;display:flex;align-items:center;gap:12px;background:#0a0720;flex-shrink:0}
        .agent-avatar{width:40px;height:40px;border-radius:12px;background:#0d0a22;border:1px solid #261f50;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .agent-label{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0}
        .agent-status{font-size:11px;color:#1d9e75;display:flex;align-items:center;gap:4px;margin-top:2px;padding:14px 16px;border-bottom:1px solid #1c1840;background:#0a0720;flex-shrink:0;flex-wrap:wrap}
        .lang-toggle{margin-left:auto;display:flex;gap:6px;align-items:center}
        .lang-btn{border:1px solid #1c1840;background:#0d0a22;color:#605890;border-radius:999px;padding:3px 10px;font-size:10px;cursor:pointer}
        .lang-btn.active{color:#c8a030;border-color:rgba(200,160,48,0.28);background:rgba(200,160,48,0.08)}
        .theme-toggle{display:flex;gap:6px;align-items:center}
        .theme-btn{border:1px solid #1c1840;background:#0d0a22;color:#605890;border-radius:999px;padding:3px 10px;font-size:10px;cursor:pointer}
        .theme-btn.active{color:#c8a030;border-color:rgba(200,160,48,0.28);background:rgba(200,160,48,0.08)}
        .mobile-controls{display:none}
        .sdot{width:6px;height:6px;border-radius:50%;background:#1d9e75;animation:blink 2s infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        .clear-btn{margin-left:auto;padding:7px 14px;border-radius:8px;border:1px solid #1c1840;background:transparent;color:#605890;font-size:12px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .clear-btn:hover{color:#c8c0a8;border-color:#261f50}

        /* MESSAGES */
        .messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;overscroll-behavior:contain}
        .msg{display:flex;gap:12px;animation:fadeUp 0.3s ease}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .msg.user{flex-direction:row-reverse}
        .msg-av{width:36px;height:36px;border-radius:10px;background:#0d0a22;border:1px solid #1c1840;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .msg.user .msg-av{background:linear-gradient(135deg,#3c2880,#c8a030);border:none;font-size:13px;font-family:'Cormorant Garamond',serif;color:#f0e8d0;font-weight:600}
        .msg-bubble{max-width:72%;padding:14px 18px;border-radius:16px;font-size:14px;line-height:1.85}
        .msg.assistant .msg-bubble{background:#0d0a22;border:1px solid #1c1840;color:#c8c0a8;border-radius:4px 16px 16px 16px}
        .msg.user .msg-bubble{background:linear-gradient(135deg,#1c1840,#261f50);color:#f0e8d0;border-radius:16px 4px 16px 16px}
        .msg-agent-lbl{font-size:10px;color:#c8a030;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
        .msg-sources{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
        .msg-source-chip{font-size:10px;color:#c8a030;border:1px solid rgba(200,160,48,0.24);background:rgba(200,160,48,0.08);padding:3px 8px;border-radius:999px;text-decoration:none;display:inline-flex;align-items:center}
        .msg-source-chip:hover{background:rgba(200,160,48,0.14);border-color:rgba(200,160,48,0.4)}
        .msg-source-conf{font-size:9px;margin-left:6px;color:#f0d898}

        /* TYPING */
        .typing-wrap{display:flex;gap:12px;align-items:flex-start}
        .typing-bubble{display:flex;gap:5px;align-items:center;padding:14px 18px;background:#0d0a22;border:1px solid #1c1840;border-radius:4px 16px 16px 16px}
        .tdot{width:7px;height:7px;border-radius:50%;background:#605890;animation:bounce 1.2s ease-in-out infinite}
        .tdot:nth-child(2){animation-delay:0.2s}
        .tdot:nth-child(3){animation-delay:0.4s}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}

        /* SUGGESTIONS */
        .suggestions{padding:0 24px 12px;display:flex;gap:8px;flex-wrap:wrap}
        .sugg{padding:7px 14px;background:rgba(255,255,255,0.03);border:1px solid #1c1840;border-radius:100px;font-size:12px;color:#605890;cursor:pointer;transition:all 0.2s;white-space:nowrap}
        .sugg:hover{border-color:rgba(200,160,48,0.3);color:#c8a030;background:rgba(200,160,48,0.05)}

        /* INPUT */
        .input-wrap{padding:16px 24px;border-top:1px solid #1c1840;background:#0a0720;flex-shrink:0}
        .input-box{display:flex;gap:10px;align-items:flex-end;background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:12px 16px;transition:border-color 0.2s}
        .input-box:focus-within{border-color:rgba(200,160,48,0.35)}
        .input-ta{flex:1;background:transparent;border:none;outline:none;font-size:14px;color:#f0e8d0;font-family:'Outfit',sans-serif;resize:none;max-height:120px;line-height:1.6}
        .input-ta::placeholder{color:#3a3060}
        .send-btn{width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#c8a030,#3c2880);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all 0.2s;flex-shrink:0;color:#060410;font-weight:700}
        .send-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 16px rgba(200,160,48,0.3)}
        .send-btn:disabled{opacity:0.4;cursor:not-allowed}
        .input-footer{display:flex;justify-content:space-between;margin-top:8px;padding:0 4px}
        .input-hint{font-size:11px;color:#3a3060}
        .free-tag{font-size:10px;color:#605890;border:1px solid #1c1840;border-radius:6px;padding:2px 8px}
        .usage-note{margin:0 24px 12px;padding:10px 14px;border-radius:12px;border:1px solid rgba(200,160,48,0.18);background:rgba(200,160,48,0.06);font-size:12px;line-height:1.6;color:#c8c0a8}
        .usage-note strong{color:#c8a030}
        .usage-progress{height:6px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;margin-top:8px}
        .usage-progress > span{display:block;height:100%;background:linear-gradient(90deg,#c8a030,#3c2880)}
        .usage-row{display:flex;justify-content:space-between;gap:8px;align-items:center}
        .usage-link{font-size:11px;color:#c8a030;text-decoration:none}
        .usage-link:hover{text-decoration:underline}
        .mobile-nav{display:none}

        @media(max-width:768px){
          .agents-sidebar{display:none}
          .msg-bubble{max-width:90%}
          .agent-status{padding:12px}
          .lang-toggle{margin-left:0;gap:4px}
          .theme-toggle{gap:4px}
          .lang-btn,.theme-btn{padding:4px 8px;font-size:9px}
          .mobile-controls{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid #1c1840;background:#0a0720}
          .messages{padding:16px 16px 104px}
          .input-wrap{padding:10px 12px;position:sticky;bottom:76px;z-index:20}
          .input-box{padding:10px 12px}
          .input-ta{font-size:16px}
          .send-btn{width:44px;height:44px}
          .usage-note{margin:0 12px 10px}
          .usage-row{flex-direction:column;align-items:flex-start}
          .free-tag{display:none}
          .mobile-nav{display:flex;gap:4px;position:fixed;left:10px;right:10px;bottom:10px;overflow-x:auto;background:rgba(10,7,32,0.96);border:1px solid #1c1840;border-radius:14px;padding:8px 6px calc(8px + env(safe-area-inset-bottom,0px));backdrop-filter:blur(10px);z-index:130;scrollbar-width:none}
          .mobile-nav::-webkit-scrollbar{display:none}
          .mobile-nav-item{text-decoration:none;color:#605890;display:flex;flex:0 0 58px;min-height:44px;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:5px 2px;border-radius:10px}
          .mobile-nav-item.active{color:#c8a030;background:rgba(200,160,48,0.1)}
          .mobile-nav-icon{font-size:16px;line-height:1}
          .mobile-nav-label{font-size:10px;letter-spacing:0.2px}
        }
        .theme-light{background:#f7f4ea;color:#2a1f3a}
        .theme-light .chat-main,.theme-light .agent-status,.theme-light .mobile-controls,.theme-light .input-wrap{background:#f7f4ea;border-color:#dfd3bf}
        .theme-light .msg.assistant .msg-bubble{background:#fffdf8;border-color:#dfd3bf;color:#2f2745}
        .theme-light .input-box{background:#fffdf8;border-color:#dfd3bf}
        .theme-light .input-ta{color:#2f2745}
        .theme-light .input-ta::placeholder{color:#8d7f6a}
        .theme-light .lang-btn,.theme-light .theme-btn{background:#fffdf8;border-color:#dfd3bf}
      `}</style>

      <div className={`chat-layout ${themeMode === "light" ? "theme-light" : ""}`}>

        {/* AGENTS SIDEBAR */}
        <div className="agents-sidebar">
          <div className="agents-header">
            <div className="agents-title">✦ AI Agents</div>
          </div>
          <div className="agents-list">
            {AGENTS.map(a => (
              <button
                key={a.id}
                className={`agent-btn ${activeAgent.id === a.id ? "active" : ""}`}
                onClick={() => switchAgent(a)}
              >
                <span className="agent-emoji">{a.emoji}</span>
                <span>
                  <span className="agent-name">{a.name}</span>
                  <span className="agent-desc">{a.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="history-section">
            <div className="history-title">Recent Chats</div>
            {conversations.length > 0 ? conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`history-btn ${conversation.id === conversationId ? "active" : ""}`}
                onClick={() => openConversation(conversation)}
              >
                <div className="history-name">{conversation.title}</div>
                <div className="history-meta">
                  {AGENTS.find((agent) => agent.id === conversation.agentId)?.name || "AstroLife AI"}
                </div>
              </button>
            )) : (
              <div className="history-meta" style={{padding:"0 8px 8px"}}>No saved chats yet</div>
            )}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="chat-main">

          {/* HEADER */}
          <div className="agent-status">
            <span className="sdot"></span>
            Online
            <span
              style={{
                marginLeft: "10px",
                padding: "3px 8px",
                borderRadius: "999px",
                border: "1px solid rgba(200,160,48,0.25)",
                background: "rgba(200,160,48,0.08)",
                color: "#c8a030",
                fontSize: "10px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              🪐 Live Transit Active
            </span>
            <div className="lang-toggle">
              <button type="button" className={`lang-btn ${languageMode === "hindi" ? "active" : ""}`} onClick={() => changeLanguageMode("hindi")}>Hindi</button>
              <button type="button" className={`lang-btn ${languageMode === "english" ? "active" : ""}`} onClick={() => changeLanguageMode("english")}>English</button>
              <button type="button" className={`lang-btn ${languageMode === "hinglish" ? "active" : ""}`} onClick={() => changeLanguageMode("hinglish")}>Hinglish</button>
            </div>
            <div className="theme-toggle">
              <button type="button" className={`theme-btn ${themeMode === "dark" ? "active" : ""}`} onClick={() => changeThemeMode("dark")}>Dark</button>
              <button type="button" className={`theme-btn ${themeMode === "light" ? "active" : ""}`} onClick={() => changeThemeMode("light")}>Light</button>
            </div>
          </div>
          <div className="mobile-controls">
            <div className="lang-toggle">
              <button type="button" className={`lang-btn ${languageMode === "hindi" ? "active" : ""}`} onClick={() => changeLanguageMode("hindi")}>Hindi</button>
              <button type="button" className={`lang-btn ${languageMode === "english" ? "active" : ""}`} onClick={() => changeLanguageMode("english")}>English</button>
              <button type="button" className={`lang-btn ${languageMode === "hinglish" ? "active" : ""}`} onClick={() => changeLanguageMode("hinglish")}>Hinglish</button>
            </div>
            <div className="theme-toggle">
              <button type="button" className={`theme-btn ${themeMode === "dark" ? "active" : ""}`} onClick={() => changeThemeMode("dark")}>Dark</button>
              <button type="button" className={`theme-btn ${themeMode === "light" ? "active" : ""}`} onClick={() => changeThemeMode("light")}>Light</button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="msg-av">
                  {m.role === "assistant" ? (m.emoji || "✦") : "M"}
                </div>
                <div>
                  {m.role === "assistant" && (
                    <div className="msg-agent-lbl">{m.agent || activeAgent.name}</div>
                  )}
                  <div
                    className="msg-bubble"
                    dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
                  />
                  {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                    <div className="msg-sources">
                      {m.sources.map((source) => (
                        <Link key={source} href={SOURCE_LINKS[source] || "/dashboard"} className="msg-source-chip" title={m.sourceMeta?.find((x)=>x.source===source)?.reason || ""}>
                          {source}
                          <span className="msg-source-conf">
                            {m.sourceMeta?.find((x)=>x.source===source)?.confidence || "Medium"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="msg assistant">
                <div className="msg-av">{activeAgent.emoji}</div>
                <div>
                  <div className="msg-agent-lbl">{activeAgent.name}</div>
                  <div className="typing-bubble">
                    <div className="tdot" /><div className="tdot" /><div className="tdot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* SUGGESTIONS — only on first message */}
          {messages.length <= 1 && !loading && (
            <div className="suggestions">
              {SUGGESTED.map((s, i) => (
                <button key={i} className="sugg" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          {usageReady && !usageStatus.isUnlimited && (
          <div className="usage-note">
    <div className="usage-row">
    {usageStatus.enforcementEnabled ? (
      <>
        <strong>Free plan:</strong> {usageStatus.left}/{usageStatus.limit} questions left this month.
      </>
    ) : (
      <>
        <strong>Testing mode:</strong> {usageStatus.left}/{usageStatus.limit} free questions left this month. Limit cross hone par bhi chat chalta rahega.
      </>
    )}
    <Link className="usage-link" href="/dashboard/upgrade">Upgrade</Link>
    </div>
    <div className="usage-progress">
      <span style={{ width: `${Math.max(0, Math.min(100, (usageStatus.used / Math.max(usageStatus.limit, 1)) * 100))}%` }} />
    </div>
          </div>
          )}

          {/* INPUT */}
          <div className="input-wrap">
            <div className="input-box">
              <textarea
                ref={inputRef}
                className="input-ta"
                placeholder={`Ask ${activeAgent.name} anything...`}
                value={input}
                rows={1}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading || usageStatus.isBlocked}
              >
                ✦
              </button>
            </div>
            <div className="input-footer">
              <span className="input-hint">Enter to send · Shift+Enter for new line</span>
              <span className="free-tag">
                {usageStatus.isUnlimited
                  ? `${subscriptionTier?.toUpperCase() ?? "PREMIUM"} Plan — Unlimited questions`
                  : `Free Plan — ${usageStatus.left}/${usageStatus.limit} left this month`}
              </span>
            </div>
          </div>

        </div>
      </div>
      <MobileBottomNav />
    </>
  );
}
