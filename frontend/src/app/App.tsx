import { useState, useEffect, type ReactNode, type ElementType } from "react";
import {
  Mic, MicOff, PhoneOff, RotateCcw, BarChart2, Clock,
  TrendingUp, TrendingDown, User, Settings, History,
  LayoutDashboard, LogOut, Volume2, Award, Target,
  Brain, Zap, ChevronRight, ArrowRight, X, Check,
  Radio, Repeat2, Menu, Plus, Sparkles, Star,
  Headphones, Activity, BookOpen, MessageCircle,
  Shield, Globe, Play, Bell, Database, Cpu, Lock,
  Eye, Flame
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = "landing" | "auth" | "dashboard" | "setup" | "interview" | "complete" | "report" | "history" | "profile";
type AuthMode = "signin" | "signup" | "forgot";
type OrbState = "speaking" | "listening" | "thinking" | "idle";
type Nav = (s: Screen) => void;

// ─── Static Data ─────────────────────────────────────────────────────────────

const PERF_DATA = [
  { label: "Jul 1", score: 62 }, { label: "Jul 8", score: 68 },
  { label: "Jul 15", score: 71 }, { label: "Jul 22", score: 74 },
  { label: "Jul 29", score: 78 }, { label: "Aug 5", score: 83 },
];

const SKILL_DATA = [
  { skill: "Technical", score: 78, fullMark: 100 },
  { skill: "Communication", score: 85, fullMark: 100 },
  { skill: "Problem Solving", score: 72, fullMark: 100 },
  { skill: "Confidence", score: 80, fullMark: 100 },
  { skill: "Relevance", score: 88, fullMark: 100 },
];

const COMM_DATA = [
  { month: "May", clarity: 58, fluency: 65, pace: 55 },
  { month: "Jun", clarity: 65, fluency: 70, pace: 60 },
  { month: "Jul", clarity: 72, fluency: 75, pace: 68 },
  { month: "Aug", clarity: 80, fluency: 82, pace: 76 },
];

const INTERVIEWS = [
  { id: 1, date: "Aug 8, 2026", role: "Frontend Dev", type: "Technical", score: 83, duration: "22 min", delta: 5 },
  { id: 2, date: "Aug 5, 2026", role: "Full Stack", type: "Mixed", score: 78, duration: "30 min", delta: 3 },
  { id: 3, date: "Aug 1, 2026", role: "Frontend Dev", type: "HR", score: 75, duration: "15 min", delta: 8 },
  { id: 4, date: "Jul 28, 2026", role: "Data Analyst", type: "Technical", score: 70, duration: "20 min", delta: -2 },
  { id: 5, date: "Jul 22, 2026", role: "Backend Dev", type: "Technical", score: 72, duration: "25 min", delta: 4 },
  { id: 6, date: "Jul 15, 2026", role: "Full Stack", type: "Mixed", score: 68, duration: "30 min", delta: 6 },
];

const WEAK_AREAS = ["System Design", "Big-O Complexity", "SQL Optimization", "Behavioral STAR Method"];
const STRONG_AREAS = ["React Hooks", "CSS Architecture", "REST API Design", "Team Communication"];
const RECOMMENDED = ["Dynamic Programming", "Database Indexing", "STAR Framework", "System Scalability"];

const QUESTIONS = [
  "How would you design a URL shortener service from scratch?",
  "Walk me through how you optimize a slow React application.",
  "Describe a time you resolved a critical production bug under pressure.",
  "How do you approach state management in large-scale React apps?",
  "Explain the trade-offs between REST and GraphQL APIs.",
  "How would you handle database scaling for a high-traffic service?",
  "Tell me about a complex technical problem you solved recently.",
  "What is your strategy for code review and maintaining code quality?",
];

const TRANSCRIPT_DEMO = [
  { speaker: "AI" as const, text: "Welcome back, Alex. Based on your previous sessions, I noticed you struggled with system design. Today, let's focus on that area. Can you explain how you would design a URL shortener service?" },
  { speaker: "User" as const, text: "Sure. I would start with a REST API with two main endpoints — one to create a short URL and one to redirect. For storage, I would use Redis for fast short-code lookups and a relational database for metadata..." },
  { speaker: "AI" as const, text: "Good start. How would you handle collision in short code generation, and what is your approach to scaling reads versus writes?" },
];

const WAVE_HEIGHTS = [28, 55, 42, 78, 35, 68, 52, 88, 40, 72, 48, 82, 62, 44, 76, 32, 68, 52, 88, 38, 72, 50, 84, 63, 44, 78, 32, 68, 54, 88, 42, 74];

// ─── Global Styles ────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    @keyframes orbSpeak {
      0%, 100% { box-shadow: 0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(124,58,237,0.25); }
      50% { box-shadow: 0 0 100px rgba(124,58,237,0.85), 0 0 200px rgba(124,58,237,0.4); }
    }
    @keyframes orbListen {
      0%, 100% { box-shadow: 0 0 60px rgba(99,102,241,0.5), 0 0 120px rgba(99,102,241,0.25); }
      50% { box-shadow: 0 0 100px rgba(99,102,241,0.85), 0 0 200px rgba(99,102,241,0.4); }
    }
    @keyframes orbThink {
      0%, 100% { box-shadow: 0 0 40px rgba(251,191,36,0.4), 0 0 80px rgba(251,191,36,0.15); }
      50% { box-shadow: 0 0 70px rgba(251,191,36,0.65), 0 0 140px rgba(251,191,36,0.28); }
    }
    @keyframes orbIdle {
      0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(124,58,237,0.2); }
      50% { transform: scale(1.03); box-shadow: 0 0 60px rgba(124,58,237,0.35); }
    }
    @keyframes ringExpand {
      0% { transform: scale(0.85); opacity: 0.55; }
      100% { transform: scale(2.1); opacity: 0; }
    }
    @keyframes waveBar {
      0%, 100% { transform: scaleY(0.25); }
      50% { transform: scaleY(1); }
    }
    @keyframes slideUp {
      from { transform: translateY(22px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes floatY {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes shimmerMove {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes rotateSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes dotBounce {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    .slide-up { animation: slideUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fade-in { animation: fadeIn 0.45s ease-out; }
    .float-anim { animation: floatY 5s ease-in-out infinite; }

    .gradient-text {
      background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .shimmer-text {
      background: linear-gradient(90deg, #a78bfa 0%, #c4b5fd 30%, #818cf8 50%, #c4b5fd 70%, #a78bfa 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmerMove 4s linear infinite;
    }

    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }

    select option { background: #0f0f1a; color: #f0f0f8; }
  `}</style>
);

// ─── Primitive Components ─────────────────────────────────────────────────────

const Glass = ({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) => (
  <div className={`rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm ${hover ? "hover:border-violet-500/25 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer" : ""} ${className}`}>
    {children}
  </div>
);

type TagVariant = "muted" | "violet" | "indigo" | "green" | "amber" | "red" | "cyan";
const TAG_STYLES: Record<TagVariant, string> = {
  muted: "bg-white/[0.07] text-white/55",
  violet: "bg-violet-500/15 text-violet-300 border border-violet-500/25",
  indigo: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
  green: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  amber: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  red: "bg-red-500/15 text-red-400 border border-red-500/25",
  cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
};
const Tag = ({ children, v = "muted" }: { children: ReactNode; v?: TagVariant }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${TAG_STYLES[v]}`}>{children}</span>
);

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "glow";
type BtnSize = "xs" | "sm" | "md" | "lg" | "xl";
const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary: "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]",
  secondary: "bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white border border-white/10",
  ghost: "hover:bg-white/[0.06] text-white/55 hover:text-white/90",
  danger: "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25",
  outline: "border border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:bg-violet-500/10",
  glow: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)]",
};
const BTN_SIZES: Record<BtnSize, string> = {
  xs: "px-2.5 py-1 text-xs rounded-lg gap-1",
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-sm rounded-xl gap-2",
  xl: "px-8 py-4 text-base rounded-2xl gap-3",
};
const Btn = ({ children, v = "primary", sz = "md", onClick, className = "", disabled = false }: {
  children: ReactNode; v?: BtnVariant; sz?: BtnSize;
  onClick?: () => void; className?: string; disabled?: boolean;
}) => (
  <button onClick={onClick} disabled={disabled}
    className={`inline-flex items-center justify-center font-medium transition-all duration-200 ${BTN_VARIANTS[v]} ${BTN_SIZES[sz]} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}>
    {children}
  </button>
);

const ScoreRing = ({ score, size = 72, color = "#7c3aed" }: { score: number; size?: number; color?: string }) => {
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1.2s ease-out", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <span className="text-sm font-bold text-white relative z-10">{score}</span>
    </div>
  );
};

const Bar = ({ pct, colorClass = "bg-violet-500" }: { pct: number; colorClass?: string }) => (
  <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
    <div className={`h-full rounded-full ${colorClass} transition-all duration-700`} style={{ width: `${pct}%` }} />
  </div>
);

// ─── Voice Orb ────────────────────────────────────────────────────────────────

const ORB_CONFIG = {
  speaking: {
    gradient: "from-violet-700 via-purple-600 to-violet-900",
    animation: "orbSpeak 1.8s ease-in-out infinite",
    ringColor: "rgba(124,58,237,",
    label: "AI is Speaking",
    labelColor: "text-violet-300",
    dotColor: "bg-violet-400",
    Icon: Volume2,
  },
  listening: {
    gradient: "from-indigo-600 via-blue-500 to-indigo-800",
    animation: "orbListen 1.1s ease-in-out infinite",
    ringColor: "rgba(99,102,241,",
    label: "Listening to you",
    labelColor: "text-indigo-300",
    dotColor: "bg-indigo-400",
    Icon: Mic,
  },
  thinking: {
    gradient: "from-amber-600 via-orange-500 to-amber-800",
    animation: "orbThink 2.2s ease-in-out infinite",
    ringColor: "rgba(251,191,36,",
    label: "Thinking...",
    labelColor: "text-amber-300",
    dotColor: "bg-amber-400",
    Icon: Brain,
  },
  idle: {
    gradient: "from-violet-900 via-purple-800 to-indigo-900",
    animation: "orbIdle 4s ease-in-out infinite",
    ringColor: "rgba(124,58,237,",
    label: "Ready",
    labelColor: "text-white/35",
    dotColor: "bg-white/25",
    Icon: Radio,
  },
};

const VoiceOrb = ({ state, compact = false }: { state: OrbState; compact?: boolean }) => {
  const cfg = ORB_CONFIG[state];
  const active = state !== "idle";
  const OrbIcon = cfg.Icon;
  const outerSz = compact ? "w-40 h-40" : "w-60 h-60 md:w-72 md:h-72";
  const innerSz = compact ? "w-32 h-32" : "w-48 h-48 md:w-60 md:h-60";
  const iconSz = compact ? "w-10 h-10" : "w-16 h-16";

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className={`relative flex items-center justify-center ${outerSz}`}>
        {active && [0, 0.75, 1.5].map((delay, i) => (
          <div key={i} className="absolute inset-0 rounded-full border"
            style={{
              borderColor: `${cfg.ringColor}${0.45 - i * 0.12})`,
              animation: `ringExpand 2.4s ease-out ${delay}s infinite`,
            }} />
        ))}
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${cfg.ringColor}0.2) 0%, transparent 65%)` }} />
        <div className={`relative ${innerSz} rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center overflow-hidden`}
          style={{ animation: cfg.animation }}>
          <div className="absolute top-4 left-6 w-1/3 h-1/3 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-1/5 h-1/5 rounded-full bg-black/40 blur-lg pointer-events-none" />
          <OrbIcon className={`${iconSz} text-white/90 relative z-10 drop-shadow-lg`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${cfg.dotColor} ${active ? "animate-pulse" : ""}`} />
        <span className={`text-xs font-semibold tracking-widest uppercase ${cfg.labelColor}`}>{cfg.label}</span>
      </div>
    </div>
  );
};

// ─── Waveform ─────────────────────────────────────────────────────────────────

const WAVE_COLORS: Record<OrbState, string> = {
  speaking: "#a78bfa", listening: "#818cf8", thinking: "#fbbf24", idle: "rgba(255,255,255,0.12)",
};

const Waveform = ({ active, state }: { active: boolean; state: OrbState }) => (
  <div className="flex items-center justify-center gap-[2.5px]" style={{ height: 44, width: 240 }}>
    {WAVE_HEIGHTS.map((h, i) => (
      <div key={i} className="rounded-full" style={{
        width: 3, minHeight: 4,
        height: active ? `${h}%` : "12%",
        backgroundColor: WAVE_COLORS[state],
        transformOrigin: "center",
        animation: active ? `waveBar ${0.45 + (i % 7) * 0.08}s ease-in-out ${i * 0.025}s infinite` : "none",
        transition: "height 0.3s ease",
      }} />
    ))}
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { icon: ElementType; label: string; screen: Screen }[] = [
  { icon: LayoutDashboard, label: "Dashboard", screen: "dashboard" },
  { icon: Mic, label: "New Interview", screen: "setup" },
  { icon: History, label: "History", screen: "history" },
  { icon: BarChart2, label: "Performance", screen: "report" },
  { icon: User, label: "Profile", screen: "profile" },
];

const Sidebar = ({ active, navigate, mobile = false, onClose }: { active: Screen; navigate: Nav; mobile?: boolean; onClose?: () => void }) => (
  <div className={`flex flex-col h-full bg-[#0a0a14] border-r border-white/[0.05] w-60 flex-shrink-0 ${mobile ? "fixed inset-y-0 left-0 z-50 shadow-2xl" : ""}`}>
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.5)]">
          <Mic className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="leading-none">
          <span className="text-sm font-bold text-white tracking-tight">VoxInterview</span>
          <span className="text-xs text-violet-400 font-bold ml-0.5">AI</span>
        </div>
      </div>
      {mobile && (
        <button onClick={onClose} className="text-white/35 hover:text-white/70 transition-colors"><X className="w-4 h-4" /></button>
      )}
    </div>

    <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map(({ icon: Icon, label, screen }) => {
        const isActive = active === screen;
        return (
          <button key={screen} onClick={() => { navigate(screen); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
              ? "bg-violet-600/20 text-violet-200 border border-violet-500/25 shadow-[0_0_12px_rgba(124,58,237,0.1)]"
              : "text-white/45 hover:text-white/80 hover:bg-white/[0.05]"}`}>
            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-violet-400" : ""}`} />
            {label}
            {screen === "setup" && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />}
          </button>
        );
      })}
    </nav>

    <div className="mx-3 mb-3 p-3 rounded-xl bg-violet-600/[0.08] border border-violet-500/[0.12]">
      <div className="flex items-center gap-2 mb-1.5">
        <Database className="w-3 h-3 text-violet-400" />
        <span className="text-[11px] font-semibold text-violet-300">AI Memory Active</span>
      </div>
      <p className="text-[10px] text-white/35 leading-relaxed">Qdrant tracks weak areas, mistakes, and improvement across sessions.</p>
    </div>

    <div className="flex items-center gap-3 px-4 py-4 border-t border-white/[0.05]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-white">AJ</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-white/90 truncate">Alex Johnson</div>
        <div className="text-[10px] text-white/35 truncate">Frontend Dev</div>
      </div>
      <button onClick={() => navigate("landing")} className="text-white/25 hover:text-white/60 transition-colors">
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// ─── Top Bar ──────────────────────────────────────────────────────────────────

const TopBar = ({ onMenu, navigate }: { onMenu: () => void; navigate: Nav }) => (
  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#09090f]/80 backdrop-blur-md flex-shrink-0">
    <button onClick={onMenu} className="lg:hidden text-white/35 hover:text-white/70 transition-colors">
      <Menu className="w-5 h-5" />
    </button>
    <div className="hidden lg:block" />
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/70 hover:bg-white/[0.05] transition-all">
        <Bell className="w-4 h-4" />
      </button>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center cursor-pointer"
        onClick={() => navigate("profile")}>
        <span className="text-[10px] font-bold text-white">AJ</span>
      </div>
    </div>
  </div>
);

// ─── App Layout ───────────────────────────────────────────────────────────────

const AppLayout = ({ children, active, navigate }: { children: ReactNode; active: Screen; navigate: Nav }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#09090f] overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar active={active} navigate={navigate} />
      </div>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <Sidebar active={active} navigate={navigate} mobile onClose={() => setMobileOpen(false)} />
        </>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenu={() => setMobileOpen(true)} navigate={navigate} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: LANDING
// ══════════════════════════════════════════════════════════════════════════════

const Landing = ({ navigate }: { navigate: Nav }) => {
  const features = [
    { icon: Volume2, title: "Real-time Voice", desc: "Natural AI voice powered by Rime. Practice as if speaking with a real interviewer — no typing, no chat.", bg: "bg-violet-500/10", fg: "text-violet-400" },
    { icon: Brain, title: "Adaptive Questions", desc: "AI generates follow-up questions in real time based on your spoken answers, just like a human interviewer.", bg: "bg-indigo-500/10", fg: "text-indigo-400" },
    { icon: Database, title: "AI Memory", desc: "Qdrant semantic memory remembers your weak topics, past mistakes, and interview patterns across sessions.", bg: "bg-cyan-500/10", fg: "text-cyan-400" },
    { icon: BarChart2, title: "Deep Feedback", desc: "Detailed performance reports scoring technical accuracy, communication clarity, confidence, and relevance.", bg: "bg-emerald-500/10", fg: "text-emerald-400" },
  ];

  const steps = [
    { n: "01", title: "Set Up Your Session", desc: "Choose role, interview type, difficulty, and duration. The AI uses your history to tailor the session." },
    { n: "02", title: "Speak — Just Like Real", desc: "The AI speaks questions aloud using natural voice. You answer verbally. It listens, understands, and follows up." },
    { n: "03", title: "Review & Level Up", desc: "Get a full breakdown of performance with personalized weak areas, AI feedback, and what to practice next." },
  ];

  const tech = [
    { icon: Headphones, name: "Rime Voice AI", sub: "Natural speech synthesis & recognition" },
    { icon: Database, name: "Qdrant Memory", sub: "Semantic vector store for personalization" },
    { icon: Brain, name: "Adaptive AI Engine", sub: "Dynamic real-time question generation" },
  ];

  return (
    <div className="min-h-screen bg-[#09090f] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full bg-violet-600/[0.06] blur-[130px]" />
        <div className="absolute top-1/3 right-1/5 w-[450px] h-[400px] rounded-full bg-indigo-600/[0.05] blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] rounded-full bg-violet-800/[0.04] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-14 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.5)]">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div><span className="text-base font-bold text-white">VoxInterview</span><span className="text-sm text-violet-400 font-bold"> AI</span></div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/45">
          <button className="hover:text-white/80 transition-colors">Features</button>
          <button className="hover:text-white/80 transition-colors">How it Works</button>
          <button className="hover:text-white/80 transition-colors">Pricing</button>
        </div>
        <div className="flex items-center gap-2.5">
          <Btn v="ghost" sz="sm" onClick={() => navigate("auth")}>Sign In</Btn>
          <Btn v="primary" sz="sm" onClick={() => navigate("auth")}>Get Started <ChevronRight className="w-3.5 h-3.5" /></Btn>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-12 md:pt-28">
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8 fade-in">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs text-violet-300 font-semibold tracking-wide">Voice-First AI Interview Coach</span>
        </div>

        <h1 className="text-5xl md:text-[72px] font-black text-white mb-6 max-w-4xl leading-[1.05] tracking-tight slide-up">
          Practice Interviews.<br />
          <span className="gradient-text">Speak With </span>
          <span className="shimmer-text">Confidence.</span>
        </h1>

        <p className="text-base md:text-lg text-white/45 max-w-xl mb-10 leading-relaxed slide-up">
          VoxInterview AI conducts realistic spoken interviews, listens to your answers, asks adaptive follow-up questions, and delivers personalized performance feedback — all powered by voice.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 slide-up">
          <Btn v="glow" sz="xl" onClick={() => navigate("auth")}><Mic className="w-5 h-5" /> Start Your Interview</Btn>
          <Btn v="secondary" sz="xl" onClick={() => navigate("auth")}><Play className="w-4 h-4" /> See How It Works</Btn>
        </div>

        {/* Hero orb */}
        <div className="relative float-anim">
          <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-3xl scale-150 pointer-events-none" />
          <VoiceOrb state="speaking" />
          <div className="absolute -left-2 top-6 md:-left-40 bg-[#111118] border border-white/[0.08] rounded-2xl px-4 py-3 text-left hidden md:block shadow-xl">
            <div className="text-[10px] text-white/35 mb-0.5 uppercase tracking-widest">Session Score</div>
            <div className="text-xl font-black text-white">83<span className="text-violet-400 text-sm font-semibold">/100</span></div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">↑ +5 this week</div>
          </div>
          <div className="absolute -right-2 top-6 md:-right-44 bg-[#111118] border border-white/[0.08] rounded-2xl px-4 py-3 text-left hidden md:block shadow-xl">
            <div className="text-[10px] text-white/35 mb-0.5 uppercase tracking-widest">Improvement</div>
            <div className="text-xl font-black text-emerald-400">+21%</div>
            <div className="text-[10px] text-white/35 mt-0.5">Since first session</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-14 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Built for voice. Designed for growth.</h2>
          <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">Every feature is crafted to make spoken interview practice more effective, personalized, and natural.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Glass key={i} className="p-6" hover>
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${f.bg}`}>
                <f.icon className={`w-5 h-5 ${f.fg}`} />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-white/38 leading-relaxed">{f.desc}</p>
            </Glass>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 px-6 md:px-14 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < 2 && <div className="hidden md:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-violet-500/25 to-transparent z-0" />}
              <div className="text-[56px] font-black text-violet-500/18 mb-4 leading-none">{step.n}</div>
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-white/38 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="relative z-10 px-6 md:px-14 py-16 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[10px] text-white/25 uppercase tracking-[0.2em] mb-10 font-semibold">Powered by</p>
          <div className="grid md:grid-cols-3 gap-4">
            {tech.map((t, i) => (
              <Glass key={i} className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <t.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-white/38">{t.sub}</div>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-0 bg-violet-500/[0.06] rounded-3xl blur-3xl" />
          <Glass className="relative p-12">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/25 flex items-center justify-center mx-auto mb-6">
              <Mic className="w-7 h-7 text-violet-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Ready to ace your next interview?</h2>
            <p className="text-white/40 mb-8 text-sm">Start your first AI voice interview — no credit card required.</p>
            <Btn v="glow" sz="xl" onClick={() => navigate("auth")}><Mic className="w-5 h-5" /> Start Free Interview</Btn>
          </Glass>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-8 border-t border-white/[0.05] text-center">
        <p className="text-[11px] text-white/20">© 2026 VoxInterview AI. Built for the future of interview preparation.</p>
      </footer>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: AUTH
// ══════════════════════════════════════════════════════════════════════════════

const Auth = ({ navigate }: { navigate: Nav }) => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder-white/22 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all";

  return (
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-violet-600/[0.07] rounded-full blur-[110px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[300px] bg-indigo-600/[0.06] rounded-full blur-[90px]" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.55)]">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-white">VoxInterview <span className="text-violet-400">AI</span></span>
        </div>

        <Glass className="p-8">
          {mode !== "forgot" && (
            <div className="flex gap-1 mb-7 bg-white/[0.04] p-1 rounded-xl">
              {(["signin", "signup"] as AuthMode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === m ? "bg-violet-600 text-white shadow-[0_0_14px_rgba(124,58,237,0.35)]" : "text-white/38 hover:text-white/65"}`}>
                  {m === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {mode === "forgot" && (
            <div className="mb-7">
              <button onClick={() => setMode("signin")} className="flex items-center gap-1.5 text-xs text-white/38 hover:text-white/65 transition-colors mb-5">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Sign In
              </button>
              <h2 className="text-xl font-black text-white">Reset Password</h2>
              <p className="text-sm text-white/38 mt-1">{"We'll send a reset link to your email."}</p>
            </div>
          )}

          {mode !== "forgot" && (
            <>
              <h2 className="text-xl font-black text-white mb-1">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
              <p className="text-sm text-white/38 mb-6">{mode === "signin" ? "Sign in to continue your practice journey." : "Start your AI-powered interview practice today."}</p>
            </>
          )}

          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs text-white/45 mb-1.5 block font-semibold">Full Name</label>
                <input className={inputCls} placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-xs text-white/45 mb-1.5 block font-semibold">Email</label>
              <input type="email" className={inputCls} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-white/45 font-semibold">Password</label>
                  {mode === "signin" && (
                    <button onClick={() => setMode("forgot")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</button>
                  )}
                </div>
                <input type="password" className={inputCls} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}
            <Btn v="glow" sz="lg" className="w-full mt-2" onClick={() => navigate("dashboard")}>
              {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              <ArrowRight className="w-4 h-4" />
            </Btn>
            {mode !== "forgot" && (
              <>
                <div className="relative flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/[0.07]" />
                  <span className="text-[11px] text-white/22">or</span>
                  <div className="flex-1 h-px bg-white/[0.07]" />
                </div>
                <button className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.03] text-sm text-white/55 hover:bg-white/[0.07] hover:text-white/80 transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </div>
        </Glass>

        <p className="text-center text-xs text-white/22 mt-6">
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-violet-400 hover:text-violet-300 transition-colors">
            {mode === "signin" ? "Create an account" : "Sign in instead"}
          </button>
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

const Dashboard = ({ navigate }: { navigate: Nav }) => {
  const stats = [
    { label: "Overall Score", value: "83", unit: "/100", icon: Star, bg: "bg-violet-500/10", fg: "text-violet-400", delta: "+5 this week" },
    { label: "Interviews Done", value: "12", unit: "total", icon: Mic, bg: "bg-indigo-500/10", fg: "text-indigo-400", delta: "2 this week" },
    { label: "Avg Score", value: "76", unit: "/100", icon: BarChart2, bg: "bg-cyan-500/10", fg: "text-cyan-400", delta: "+3 from last" },
    { label: "Improvement", value: "+21%", unit: "", icon: TrendingUp, bg: "bg-emerald-500/10", fg: "text-emerald-400", delta: "since first session" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Good morning, Alex 👋</h1>
          <p className="text-white/38 text-sm mt-1">{"You're on a 5-day streak. Keep it up — you're improving fast."}</p>
        </div>
        <Btn v="glow" sz="md" onClick={() => navigate("setup")} className="hidden md:inline-flex">
          <Mic className="w-4 h-4" /> New Interview
        </Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Glass key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-white/38 font-semibold uppercase tracking-wide">{s.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-3.5 h-3.5 ${s.fg}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{s.value}</span>
              {s.unit && <span className="text-xs text-white/28">{s.unit}</span>}
            </div>
            <p className="text-[10px] text-white/28 mt-1">{s.delta}</p>
          </Glass>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Recent Interviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Recent Interviews</h2>
              <button onClick={() => navigate("history")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <Glass>
              <div className="divide-y divide-white/[0.04]">
                {INTERVIEWS.slice(0, 4).map((r) => (
                  <div key={r.id} onClick={() => navigate("report")}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white truncate">{r.role}</span>
                        <Tag v={r.type === "Technical" ? "violet" : r.type === "HR" ? "cyan" : "indigo"}>{r.type}</Tag>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/28">
                        <span>{r.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {r.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <ScoreRing score={r.score} size={42} />
                      <div className={`flex items-center gap-0.5 text-xs font-bold ${r.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {r.delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {r.delta >= 0 ? "+" : ""}{r.delta}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          <Glass className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Weak Areas</h3>
            </div>
            <div className="space-y-3">
              {WEAK_AREAS.map((area, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white/55">{area}</span>
                    <span className="text-xs text-white/28 font-mono">{60 - i * 7}%</span>
                  </div>
                  <Bar pct={60 - i * 7} colorClass="bg-amber-500" />
                </div>
              ))}
            </div>
          </Glass>

          <Glass className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Recommended</h3>
            </div>
            <div className="space-y-1.5">
              {RECOMMENDED.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  <span className="text-xs text-white/55">{t}</span>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/15 p-7 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/35 via-indigo-900/25 to-violet-900/35 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(124,58,237,0.12),transparent_60%)] pointer-events-none" />
        <div className="relative">
          <h2 className="text-lg font-black text-white mb-1">Start a New Interview Session</h2>
          <p className="text-sm text-white/38">{"AI memory will personalize your session based on previous performance."}</p>
        </div>
        <Btn v="glow" sz="lg" onClick={() => navigate("setup")} className="relative flex-shrink-0">
          <Mic className="w-4 h-4" /> Start Now <ArrowRight className="w-4 h-4" />
        </Btn>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: INTERVIEW SETUP
// ══════════════════════════════════════════════════════════════════════════════

const Setup = ({ navigate }: { navigate: Nav }) => {
  const [type, setType] = useState("Technical");
  const [role, setRole] = useState("Frontend Dev");
  const [diff, setDiff] = useState("Intermediate");
  const [dur, setDur] = useState("20");

  const OptionGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="text-[11px] text-white/38 font-semibold uppercase tracking-[0.15em] block mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${value === opt
              ? "bg-violet-600/25 border-violet-500/50 text-violet-200 shadow-[0_0_14px_rgba(124,58,237,0.2)]"
              : "bg-white/[0.04] border-white/[0.07] text-white/45 hover:text-white/75 hover:border-white/15"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const estQ = Math.round(parseInt(dur) / 2.5);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-white mb-1">Interview Setup</h1>
          <p className="text-white/38 text-sm">Configure your session. AI uses your history to personalize every question.</p>
        </div>
        <div className="grid lg:grid-cols-[1fr_268px] gap-5">
          <Glass className="p-6 space-y-7">
            <OptionGroup label="Interview Type" options={["Technical", "HR", "Mixed"]} value={type} onChange={setType} />
            <OptionGroup label="Target Role" options={["Frontend Dev", "Backend Dev", "Full Stack", "Data Analyst", "Custom"]} value={role} onChange={setRole} />
            <OptionGroup label="Difficulty" options={["Beginner", "Intermediate", "Advanced"]} value={diff} onChange={setDiff} />
            <OptionGroup label="Duration" options={["10 min", "20 min", "30 min"]} value={`${dur} min`} onChange={(v) => setDur(v.replace(" min", ""))} />
          </Glass>

          <div className="space-y-4">
            <Glass className="p-5">
              <h3 className="text-sm font-bold text-white mb-4">Session Preview</h3>
              <div className="space-y-0">
                {[
                  { label: "Type", value: type, icon: Cpu },
                  { label: "Role", value: role, icon: User },
                  { label: "Difficulty", value: diff, icon: Zap },
                  { label: "Duration", value: `${dur} min`, icon: Clock },
                  { label: "Est. Questions", value: `~${estQ}`, icon: MessageCircle },
                ].map(({ label, value, icon: Icon }, i) => (
                  <div key={label} className={`flex items-center justify-between py-3 ${i < 4 ? "border-b border-white/[0.04]" : ""}`}>
                    <div className="flex items-center gap-2 text-xs text-white/38">
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </div>
                    <span className="text-xs text-white font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </Glass>

            <div className="p-4 rounded-xl bg-violet-600/[0.08] border border-violet-500/15">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-300">AI Memory Active</span>
              </div>
              <p className="text-[11px] text-white/38 leading-relaxed">
                Based on 12 sessions, AI will focus on System Design and Big-O — your current weak areas.
              </p>
            </div>

            <Btn v="glow" sz="lg" className="w-full" onClick={() => navigate("interview")}>
              <Mic className="w-5 h-5" /> Start Voice Interview
            </Btn>
            <p className="text-[10px] text-center text-white/22">Make sure your microphone is enabled. The AI begins speaking immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: LIVE VOICE INTERVIEW ★ MOST IMPORTANT
// ══════════════════════════════════════════════════════════════════════════════

const LiveInterview = ({ navigate }: { navigate: Nav }) => {
  const [orbState, setOrbState] = useState<OrbState>("speaking");
  const [qIndex, setQIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const totalQ = 8;

  useEffect(() => {
    const seq: OrbState[] = ["speaking", "thinking", "listening", "thinking", "speaking", "thinking", "listening"];
    const durations = [6000, 2200, 7000, 2000, 6000, 2200, 7000];
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      idx = (idx + 1) % seq.length;
      setOrbState(seq[idx]);
      if (idx === 4) setQIndex((q) => Math.min(q + 1, totalQ - 1));
      timer = setTimeout(next, durations[idx]);
    };
    timer = setTimeout(next, durations[0]);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const BG_MAP: Record<OrbState, string> = {
    speaking: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 65%)",
    listening: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 65%)",
    thinking: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(251,191,36,0.09) 0%, transparent 65%)",
    idle: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.06) 0%, transparent 65%)",
  };

  return (
    <div className="fixed inset-0 bg-[#050509] flex flex-col overflow-hidden">
      <GlobalStyles />
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1500"
        style={{ background: BG_MAP[orbState] }} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.5)]">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-black text-white">VoxInterview AI</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Tag v="violet">Technical</Tag>
            <Tag v="muted">Frontend Dev</Tag>
            <Tag v="indigo">Intermediate</Tag>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.07] rounded-xl px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-white/38" />
            <span className="text-sm font-mono text-white font-semibold">{fmt(elapsed)}</span>
            <span className="text-xs text-white/25">/ 20:00</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <span className="font-black text-white">Q{qIndex + 1}</span>
            <span className="text-white/28">/ {totalQ}</span>
          </div>
          <Btn v="danger" sz="sm" onClick={() => navigate("complete")}><PhoneOff className="w-3.5 h-3.5" /> End</Btn>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/[0.04] flex-shrink-0">
        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
          style={{ width: `${((qIndex + 1) / totalQ) * 100}%` }} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Center voice stage */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative gap-6">
          {/* THE VOICE ORB — CENTER STAGE */}
          <VoiceOrb state={orbState} />

          {/* Waveform */}
          <Waveform active={orbState !== "idle" && !muted} state={orbState} />

          {/* Current question */}
          <div className="w-full max-w-lg">
            <Glass className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] text-white/22 uppercase tracking-[0.2em] font-semibold">Question {qIndex + 1} of {totalQ}</span>
                <div className="flex-1 h-px bg-white/[0.05]" />
                <div className="flex gap-1">
                  {Array.from({ length: totalQ }).map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= qIndex ? "bg-violet-500 w-4" : "bg-white/10 w-2"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm md:text-base text-white/88 leading-relaxed font-medium">{QUESTIONS[qIndex]}</p>
            </Glass>
          </div>
        </div>

        {/* Transcript panel */}
        {showTranscript && (
          <div className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-white/[0.05] flex flex-col max-h-52 lg:max-h-none bg-black/10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-white/35" />
                <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">Live Transcript</span>
              </div>
              <button onClick={() => setShowTranscript(false)} className="text-white/22 hover:text-white/55 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {TRANSCRIPT_DEMO.map((item, i) => (
                <div key={i}>
                  <div className={`text-[10px] font-bold mb-1.5 uppercase tracking-wider ${item.speaker === "AI" ? "text-violet-400" : "text-indigo-400"}`}>
                    {item.speaker === "AI" ? "VoxInterview AI" : "You"}
                  </div>
                  <div className={`text-xs leading-relaxed rounded-xl px-3 py-2.5 ${item.speaker === "AI"
                    ? "bg-violet-600/[0.08] border border-violet-500/15 text-white/65"
                    : "bg-indigo-600/[0.08] border border-indigo-500/15 text-white/65 ml-4"}`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {orbState === "listening" && (
                <div className="flex gap-1.5 ml-1">
                  {[0, 0.18, 0.36].map((d) => (
                    <div key={d} className="w-2 h-2 rounded-full bg-indigo-400"
                      style={{ animation: `dotBounce 1.2s ${d}s ease-in-out infinite` }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center justify-center gap-4 md:gap-5 px-6 py-5 border-t border-white/[0.05] flex-shrink-0 bg-black/25 backdrop-blur-md">
        {/* Mute */}
        <button onClick={() => setMuted(!muted)} title={muted ? "Unmute" : "Mute"}
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-200 ${muted
            ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_14px_rgba(239,68,68,0.25)]"
            : "bg-white/[0.06] border-white/10 text-white/60 hover:bg-white/[0.1] hover:text-white/90"}`}>
          {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* End Interview — central red button */}
        <button onClick={() => navigate("complete")} title="End Interview"
          className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500/40 text-red-400 hover:bg-red-600/30 hover:border-red-500/70 flex items-center justify-center transition-all duration-200 shadow-[0_0_24px_rgba(239,68,68,0.2)]">
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Repeat question */}
        <button title="Repeat Question"
          className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 text-white/60 hover:bg-white/[0.1] hover:text-white/90 flex items-center justify-center transition-all duration-200">
          <Repeat2 className="w-5 h-5" />
        </button>

        {/* Toggle transcript */}
        <button onClick={() => setShowTranscript(!showTranscript)} title="Toggle Transcript"
          className={`hidden lg:flex w-10 h-10 rounded-full border items-center justify-center transition-all duration-200 ${showTranscript
            ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
            : "bg-white/[0.06] border-white/10 text-white/45"}`}>
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: INTERVIEW COMPLETE
// ══════════════════════════════════════════════════════════════════════════════

const Complete = ({ navigate }: { navigate: Nav }) => {
  const metrics = [
    { label: "Technical Knowledge", score: 78, color: "#7c3aed" },
    { label: "Communication", score: 85, color: "#6366f1" },
    { label: "Relevance", score: 88, color: "#06b6d4" },
    { label: "Confidence", score: 80, color: "#10b981" },
    { label: "Problem Solving", score: 72, color: "#f59e0b" },
  ];

  const strengths = [
    "Clear explanation of React lifecycle and hooks",
    "Strong REST API design knowledge",
    "Good communication clarity and pacing",
    "Concise and well-structured code examples",
  ];

  const weaknesses = [
    "System design depth needs significant improvement",
    "Big-O analysis was incomplete for the array problem",
    "Missed caching as an optimization opportunity",
  ];

  const mistakes = [
    "Confused useEffect dependency array behavior under concurrent mode",
    "Did not mention memoization for the performance question",
    "Skipped error handling in async/await code examples",
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="relative inline-flex mb-5">
          <div className="w-18 h-18 w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.25)]">
            <Award className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Interview Complete</h1>
        <p className="text-white/38 text-sm">{"Great session, Alex. Here's your full performance breakdown."}</p>
      </div>

      {/* Score overview */}
      <Glass className="p-7 mb-5">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <ScoreRing score={83} size={110} color="#7c3aed" />
            <span className="text-xs text-white/35 uppercase tracking-widest font-semibold">Overall Score</span>
          </div>
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-white/45">{m.label}</span>
                    <span className="text-xs font-black text-white">{m.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${m.score}%`, backgroundColor: m.color, boxShadow: `0 0 8px ${m.color}60` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Glass>

      {/* Strengths + Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Glass className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Strengths</h3>
          </div>
          <div className="space-y-2">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-500/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                <span className="text-xs text-white/55 leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </Glass>
        <Glass className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Needs Work</h3>
          </div>
          <div className="space-y-2">
            {weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <span className="text-xs text-white/55 leading-relaxed">{w}</span>
              </div>
            ))}
          </div>
        </Glass>
      </div>

      {/* Mistakes + AI Feedback */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Glass className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <X className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white">Mistakes Made</h3>
          </div>
          <div className="space-y-2">
            {mistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-red-500/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                <span className="text-xs text-white/55 leading-relaxed">{m}</span>
              </div>
            ))}
          </div>
        </Glass>
        <Glass className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">AI Feedback</h3>
          </div>
          <p className="text-xs text-white/52 leading-relaxed">
            {"You demonstrated strong communication skills and solid React fundamentals. To reach the next level, deepen your system design knowledge — particularly horizontal scaling and database optimization strategies. Your structured answers were good but occasionally lacked measurable outcomes. Focus on the STAR method for behavioral questions. Great improvement from your previous session!"}
          </p>
        </Glass>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Btn v="outline" sz="lg" onClick={() => navigate("setup")}><Target className="w-4 h-4" /> Practice Weak Areas</Btn>
        <Btn v="glow" sz="lg" onClick={() => navigate("setup")}><Mic className="w-4 h-4" /> Start Another</Btn>
        <Btn v="secondary" sz="lg" onClick={() => navigate("report")}><BarChart2 className="w-4 h-4" /> Detailed Report</Btn>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: PERFORMANCE REPORT
// ══════════════════════════════════════════════════════════════════════════════

const MEMORY_DATA = [
  { type: "Weak Topics", items: ["System Design", "Big-O Analysis", "SQL Optimization"], icon: Target, textCls: "text-amber-400", borderCls: "border-amber-500/15", bgCls: "bg-amber-500/[0.06]", dotCls: "bg-amber-400" },
  { type: "Repeated Mistakes", items: ["Skipping error handling", "Missing memoization", "Vague STAR answers"], icon: RotateCcw, textCls: "text-red-400", borderCls: "border-red-500/15", bgCls: "bg-red-500/[0.06]", dotCls: "bg-red-400" },
  { type: "Strong Skills", items: ["React Hooks", "REST API Design", "CSS Architecture"], icon: Check, textCls: "text-emerald-400", borderCls: "border-emerald-500/15", bgCls: "bg-emerald-500/[0.06]", dotCls: "bg-emerald-400" },
  { type: "Improvement Areas", items: ["Communication conciseness", "Database indexing", "Confidence under pressure"], icon: TrendingUp, textCls: "text-violet-400", borderCls: "border-violet-500/15", bgCls: "bg-violet-500/[0.06]", dotCls: "bg-violet-400" },
];

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[10px] text-white/35 mb-1">{label}</p>
      <p className="text-sm font-black text-violet-400">{payload[0].value}<span className="text-white/28 text-xs">/100</span></p>
    </div>
  );
};

const Report = ({ navigate }: { navigate: Nav }) => (
  <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-black text-white">Performance Report</h1>
        <p className="text-white/38 text-sm mt-1">Complete analytics across all your interview sessions.</p>
      </div>
      <Tag v="violet"><Activity className="w-3 h-3" /> 12 Sessions</Tag>
    </div>

    {/* Charts row */}
    <div className="grid lg:grid-cols-2 gap-5">
      <Glass className="p-6">
        <h3 className="text-sm font-bold text-white mb-0.5">Score Over Time</h3>
        <p className="text-[11px] text-white/28 mb-5">Interview score progression (last 6 sessions)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={PERF_DATA}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[55, 95]} tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2}
              fill="url(#sg)" dot={{ fill: "#7c3aed", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a78bfa" }} />
          </AreaChart>
        </ResponsiveContainer>
      </Glass>

      <Glass className="p-6">
        <h3 className="text-sm font-bold text-white mb-0.5">Skill Breakdown</h3>
        <p className="text-[11px] text-white/28 mb-5">Scores across all interview dimensions</p>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={SKILL_DATA} margin={{ top: 5, right: 25, bottom: 5, left: 25 }}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.18} strokeWidth={2}
              dot={{ fill: "#a78bfa", r: 3, strokeWidth: 0 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Glass>
    </div>

    {/* Communication trends */}
    <Glass className="p-6">
      <h3 className="text-sm font-bold text-white mb-0.5">Communication Trends</h3>
      <p className="text-[11px] text-white/28 mb-5">Clarity, fluency, and pace tracked monthly</p>
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={COMM_DATA}>
          <defs>
            {[["cg1", "#7c3aed"], ["cg2", "#6366f1"], ["cg3", "#06b6d4"]].map(([id, color]) => (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.22} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[40, 100]} tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
            labelStyle={{ color: "rgba(255,255,255,0.38)", fontSize: 10 }} itemStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="clarity" stroke="#7c3aed" strokeWidth={1.5} fill="url(#cg1)" name="Clarity" />
          <Area type="monotone" dataKey="fluency" stroke="#6366f1" strokeWidth={1.5} fill="url(#cg2)" name="Fluency" />
          <Area type="monotone" dataKey="pace" stroke="#06b6d4" strokeWidth={1.5} fill="url(#cg3)" name="Pace" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4">
        {[{ label: "Clarity", color: "#7c3aed" }, { label: "Fluency", color: "#6366f1" }, { label: "Pace", color: "#06b6d4" }].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-[11px] text-white/38">{l.label}</span>
          </div>
        ))}
      </div>
    </Glass>

    {/* AI Memory */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-violet-400" />
        <h2 className="text-base font-bold text-white">AI Memory</h2>
        <Tag v="violet">Powered by Qdrant</Tag>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MEMORY_DATA.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className={`p-5 rounded-xl border ${m.borderCls} ${m.bgCls}`}>
              <div className={`flex items-center gap-2 mb-3 ${m.textCls}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{m.type}</span>
              </div>
              <div className="space-y-2">
                {m.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className={`w-1 h-1 rounded-full ${m.dotCls} flex-shrink-0 mt-1.5`} />
                    <span className="text-[11px] text-white/48 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Recommendations */}
    <Glass className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-bold text-white">AI Recommendations</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {RECOMMENDED.map((topic, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/15 hover:bg-violet-500/[0.1] cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{topic}</div>
              <div className="text-[10px] text-white/28 mt-0.5">From weak areas</div>
            </div>
          </div>
        ))}
      </div>
    </Glass>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: INTERVIEW HISTORY
// ══════════════════════════════════════════════════════════════════════════════

const InterviewHistory = ({ navigate }: { navigate: Nav }) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Technical", "HR", "Mixed"];
  const filtered = filter === "All" ? INTERVIEWS : INTERVIEWS.filter((r) => r.type === filter);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Interview History</h1>
          <p className="text-white/38 text-sm mt-1">All {INTERVIEWS.length} of your past sessions.</p>
        </div>
        <Btn v="glow" sz="sm" onClick={() => navigate("setup")}><Plus className="w-3.5 h-3.5" /> New Session</Btn>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 border transition-all ${filter === f ? "bg-violet-600/20 border-violet-500/40 text-violet-300" : "bg-white/[0.04] border-white/[0.07] text-white/38 hover:text-white/65"}`}>
            {f}
          </button>
        ))}
      </div>

      <Glass>
        <div className="hidden md:grid grid-cols-[1fr_110px_90px_80px_80px_72px] gap-4 px-5 py-3 border-b border-white/[0.04]">
          {["Session", "Date", "Duration", "Score", "Change", ""].map((h) => (
            <div key={h} className="text-[10px] text-white/22 font-semibold uppercase tracking-widest">{h}</div>
          ))}
        </div>
        <div className="divide-y divide-white/[0.04]">
          {filtered.map((r) => (
            <div key={r.id} onClick={() => navigate("report")}
              className="grid grid-cols-1 md:grid-cols-[1fr_110px_90px_80px_80px_72px] gap-2 md:gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer items-center">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white">{r.role}</span>
                  <Tag v={r.type === "Technical" ? "violet" : r.type === "HR" ? "cyan" : "indigo"}>{r.type}</Tag>
                </div>
              </div>
              <div className="text-xs text-white/38">{r.date}</div>
              <div className="flex items-center gap-1 text-xs text-white/38">
                <Clock className="w-3 h-3" /> {r.duration}
              </div>
              <ScoreRing score={r.score} size={40} />
              <div className={`flex items-center gap-0.5 text-xs font-bold ${r.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {r.delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {r.delta >= 0 ? "+" : ""}{r.delta}%
              </div>
              <Btn v="ghost" sz="xs"><Eye className="w-3 h-3" /> View</Btn>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: PROFILE & SETTINGS
// ══════════════════════════════════════════════════════════════════════════════

const ProfileSettings = ({ navigate }: { navigate: Nav }) => {
  const [tab, setTab] = useState<"profile" | "preferences" | "account">("profile");
  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/22 focus:outline-none focus:border-violet-500/40 transition-all";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-black text-white">Profile & Settings</h1>
        <p className="text-white/38 text-sm mt-1">Manage your account, preferences, and voice settings.</p>
      </div>

      <div className="flex gap-1 mb-7 bg-white/[0.04] p-1 rounded-xl w-fit">
        {(["profile", "preferences", "account"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${tab === t ? "bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.35)]" : "text-white/38 hover:text-white/65"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-5">
          <Glass className="p-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-xl font-black text-white shadow-[0_0_20px_rgba(124,58,237,0.35)]">AJ</div>
            <div>
              <div className="text-base font-bold text-white">Alex Johnson</div>
              <div className="text-sm text-white/38">alex@example.com</div>
              <button className="text-xs text-violet-400 hover:text-violet-300 mt-1 transition-colors">Change photo</button>
            </div>
          </Glass>
          <Glass className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Personal Information</h3>
            {[
              { label: "Full Name", value: "Alex Johnson", ph: "Alex Johnson" },
              { label: "Email", value: "alex@example.com", ph: "you@example.com" },
              { label: "Target Role", value: "Frontend Developer", ph: "e.g. Senior Frontend Engineer" },
              { label: "Years of Experience", value: "3 years", ph: "Years of experience" },
            ].map(({ label, value, ph }) => (
              <div key={label}>
                <label className="text-xs text-white/38 mb-1.5 block font-semibold">{label}</label>
                <input className={inputCls} placeholder={ph} defaultValue={value} />
              </div>
            ))}
            <div>
              <label className="text-xs text-white/38 mb-1.5 block font-semibold">Skills</label>
              <input className={inputCls} defaultValue="React, TypeScript, Node.js, CSS, GraphQL, PostgreSQL" />
            </div>
            <Btn v="primary" sz="md">Save Changes</Btn>
          </Glass>
        </div>
      )}

      {tab === "preferences" && (
        <div className="space-y-4">
          <Glass className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Interview Preferences</h3>
            {[
              { label: "Preferred Language", opts: ["English", "Spanish", "French", "German", "Portuguese"] },
              { label: "Default Difficulty", opts: ["Beginner", "Intermediate", "Advanced"] },
              { label: "Default Duration", opts: ["10 min", "20 min", "30 min"] },
              { label: "Default Interview Type", opts: ["Technical", "HR", "Mixed"] },
            ].map(({ label, opts }) => (
              <div key={label}>
                <label className="text-xs text-white/38 mb-1.5 block font-semibold">{label}</label>
                <select className={selectCls}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </Glass>
          <Glass className="p-6">
            <h3 className="text-sm font-bold text-white mb-5">Voice Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Auto-advance Questions", desc: "Automatically move to the next question", on: true },
                { label: "Background Noise Reduction", desc: "Filter ambient noise from microphone input", on: true },
                { label: "AI Voice Feedback", desc: "Receive spoken feedback after each answer", on: false },
                { label: "Session Reminders", desc: "Daily reminder notifications to practice", on: true },
              ].map(({ label, desc, on }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{label}</div>
                    <div className="text-xs text-white/28 mt-0.5">{desc}</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer flex-shrink-0 transition-colors ${on ? "bg-violet-600" : "bg-white/15"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      )}

      {tab === "account" && (
        <div className="space-y-4">
          <Glass className="p-6">
            <h3 className="text-sm font-bold text-white mb-4">Account Security</h3>
            <div className="space-y-2">
              {[
                { icon: Lock, label: "Change Password" },
                { icon: Shield, label: "Two-Factor Authentication" },
                { icon: Globe, label: "Connected Accounts" },
              ].map(({ icon: Icon, label }) => (
                <Btn key={label} v="secondary" sz="md" className="w-full justify-start">
                  <Icon className="w-4 h-4" /> {label}
                </Btn>
              ))}
            </div>
          </Glass>
          <Glass className="p-6">
            <h3 className="text-sm font-bold text-white mb-1">Subscription</h3>
            <p className="text-xs text-white/28 mb-4">Current plan: Free tier (3 interviews/month)</p>
            <Btn v="glow" sz="md"><Zap className="w-4 h-4" /> Upgrade to Pro</Btn>
          </Glass>
          <Glass className="p-5">
            <h3 className="text-sm font-bold text-white mb-4">Danger Zone</h3>
            <div className="p-4 rounded-xl border border-red-500/18 bg-red-500/[0.04]">
              <div className="text-sm font-semibold text-red-400 mb-1">Delete Account</div>
              <div className="text-xs text-white/38 mb-3">This will permanently delete all your data and interview history. This action cannot be undone.</div>
              <Btn v="danger" sz="sm">Delete Account</Btn>
            </div>
          </Glass>
          <Btn v="ghost" sz="md" className="text-white/35" onClick={() => navigate("landing")}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Btn>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const navigate: Nav = (s) => setScreen(s);

  if (screen === "landing") return <><GlobalStyles /><Landing navigate={navigate} /></>;
  if (screen === "auth") return <><GlobalStyles /><Auth navigate={navigate} /></>;
  if (screen === "interview") return <><GlobalStyles /><LiveInterview navigate={navigate} /></>;

  const SCREEN_MAP: Partial<Record<Screen, ReactNode>> = {
    dashboard: <Dashboard navigate={navigate} />,
    setup: <Setup navigate={navigate} />,
    complete: <Complete navigate={navigate} />,
    report: <Report navigate={navigate} />,
    history: <InterviewHistory navigate={navigate} />,
    profile: <ProfileSettings navigate={navigate} />,
  };

  return (
    <>
      <GlobalStyles />
      <AppLayout active={screen} navigate={navigate}>
        {SCREEN_MAP[screen] ?? <Dashboard navigate={navigate} />}
      </AppLayout>
    </>
  );
}
