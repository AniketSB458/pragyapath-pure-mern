import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from "recharts";
import { useApp } from "../context/AppContext";
import {
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Layers,
  Zap,
  TrendingUp
} from "lucide-react";

const TopicMasteryHeatmap = () => {
  const { profile, setActiveTab, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [hoveredTopic, setHoveredTopic] = useState(null);

  const masteryData = useMemo(() => {
    const isWeakInPolity = (profile.weakTopics || []).some((t) => t.toLowerCase().includes("polity"));
    const isWeakInQuant = (profile.weakTopics || []).some(
      (t) => t.toLowerCase().includes("quant") || t.toLowerCase().includes("interpretation")
    );
    const isWeakInReasoning = (profile.weakTopics || []).some((t) => t.toLowerCase().includes("reasoning"));

    return [
      {
        subject: "Modern Indian History",
        shortSubject: "Modern History",
        masteryScore: 89,
        accuracy: 92,
        questionsTested: 42,
        status: "strength",
        color: "#10b981",
        subtopics: [
          { name: "1857 Revolt & British Expansion", score: 94, status: "strength", lastTested: "2 days ago" },
          { name: "Socio-Religious Reform Movements", score: 88, status: "strength", lastTested: "4 days ago" },
          { name: "Gandhian Mass Movements (1919-42)", score: 91, status: "strength", lastTested: "Yesterday" },
          { name: "Revolutionary Nationalism & Subhash Bose", score: 82, status: "strength", lastTested: "3 days ago" }
        ]
      },
      {
        subject: "General Science & Emerging Tech",
        shortSubject: "Gen Science",
        masteryScore: 84,
        accuracy: 86,
        questionsTested: 35,
        status: "strength",
        color: "#14b8a6",
        subtopics: [
          { name: "ISRO Space Missions & Launchers", score: 92, status: "strength", lastTested: "3 days ago" },
          { name: "Biotechnology & Vaccines", score: 85, status: "strength", lastTested: "5 days ago" },
          { name: "Artificial Intelligence & Semiconductors", score: 80, status: "strength", lastTested: "1 week ago" },
          { name: "Renewable Energy & Green Hydrogen", score: 78, status: "moderate", lastTested: "6 days ago" }
        ]
      },
      {
        subject: "Physical & Economic Geography",
        shortSubject: "Geography",
        masteryScore: 78,
        accuracy: 81,
        questionsTested: 38,
        status: "moderate",
        color: "#06b6d4",
        subtopics: [
          { name: "Indian River Systems & Tributaries", score: 86, status: "strength", lastTested: "2 days ago" },
          { name: "Monsoon Mechanism & Western Disturbances", score: 82, status: "strength", lastTested: "4 days ago" },
          { name: "Plate Tectonics & Seismic Zones", score: 74, status: "moderate", lastTested: "1 week ago" },
          { name: "Mineral Resources & Industrial Belts", score: 68, status: "moderate", lastTested: "5 days ago" }
        ]
      },
      {
        subject: "Environment, Ecology & Climate",
        shortSubject: "Environment",
        masteryScore: 72,
        accuracy: 74,
        questionsTested: 29,
        status: "moderate",
        color: "#f59e0b",
        subtopics: [
          { name: "National Parks, Biospheres & Ramsar Sites", score: 80, status: "strength", lastTested: "3 days ago" },
          { name: "IUCN Red List & Endemic Species", score: 73, status: "moderate", lastTested: "5 days ago" },
          { name: "COP Summits & Montreal Protocol", score: 71, status: "moderate", lastTested: "1 week ago" },
          { name: "Pollution Norms & Environmental Acts", score: 64, status: "moderate", lastTested: "4 days ago" }
        ]
      },
      {
        subject: "Logical Reasoning & Analytical Logic",
        shortSubject: "Reasoning",
        masteryScore: isWeakInReasoning ? 54 : 68,
        accuracy: isWeakInReasoning ? 56 : 70,
        questionsTested: 26,
        status: isWeakInReasoning ? "weakness" : "moderate",
        color: isWeakInReasoning ? "#f43f5e" : "#fbbf24",
        subtopics: [
          { name: "Syllogisms & Venn Diagrams", score: isWeakInReasoning ? 58 : 74, status: isWeakInReasoning ? "weakness" : "moderate", lastTested: "Yesterday" },
          { name: "Blood Relations & Coded Symbols", score: isWeakInReasoning ? 52 : 68, status: isWeakInReasoning ? "weakness" : "moderate", lastTested: "3 days ago" },
          { name: "Seating Arrangements (Circular/Linear)", score: isWeakInReasoning ? 48 : 62, status: "weakness", lastTested: "2 days ago" },
          { name: "Data Sufficiency & Statement Logic", score: isWeakInReasoning ? 56 : 70, status: isWeakInReasoning ? "weakness" : "moderate", lastTested: "5 days ago" }
        ]
      },
      {
        subject: "Quantitative Aptitude & Data Interpretation",
        shortSubject: "Quantitative Apt",
        masteryScore: isWeakInQuant ? 46 : 58,
        accuracy: isWeakInQuant ? 48 : 60,
        questionsTested: 32,
        status: "weakness",
        color: "#ef4444",
        subtopics: [
          { name: "Permutations, Combinations & Probability", score: isWeakInQuant ? 38 : 50, status: "weakness", lastTested: "Yesterday" },
          { name: "Time, Speed, Distance & Rel. Velocity", score: isWeakInQuant ? 44 : 56, status: "weakness", lastTested: "2 days ago" },
          { name: "Data Interpretation (Multi-tier Bar/Radar)", score: isWeakInQuant ? 49 : 62, status: "weakness", lastTested: "3 days ago" },
          { name: "Number Systems & Modular Arithmetic", score: isWeakInQuant ? 54 : 64, status: "weakness", lastTested: "4 days ago" }
        ]
      },
      {
        subject: "Indian Polity & Constitutional Framework",
        shortSubject: "Indian Polity",
        masteryScore: isWeakInPolity ? 48 : 62,
        accuracy: isWeakInPolity ? 50 : 65,
        questionsTested: 45,
        status: isWeakInPolity ? "weakness" : "moderate",
        color: isWeakInPolity ? "#e11d48" : "#f59e0b",
        subtopics: [
          { name: "Parliamentary Committees & Sessions", score: isWeakInPolity ? 42 : 58, status: "weakness", lastTested: "Yesterday" },
          { name: "Emergency Provisions & Judicial Review", score: isWeakInPolity ? 46 : 60, status: "weakness", lastTested: "2 days ago" },
          { name: "Fundamental Rights & Writ Jurisdiction", score: isWeakInPolity ? 56 : 72, status: isWeakInPolity ? "weakness" : "moderate", lastTested: "4 days ago" },
          { name: "Panchayati Raj & 73rd/74th Amendments", score: isWeakInPolity ? 49 : 64, status: "weakness", lastTested: "3 days ago" }
        ]
      }
    ];
  }, [profile.weakTopics]);

  const filteredMasteryData = useMemo(() => {
    let list = masteryData;
    if (selectedSubject !== "all") {
      list = list.filter((s) => s.subject === selectedSubject);
    }
    if (activeFilter === "strengths") {
      list = list.filter((s) => s.status === "strength");
    } else if (activeFilter === "weaknesses") {
      list = list.filter((s) => s.status === "weakness");
    } else if (activeFilter === "moderate") {
      list = list.filter((s) => s.status === "moderate");
    }
    return list;
  }, [masteryData, selectedSubject, activeFilter]);

  const matrixSubtopics = useMemo(() => {
    let list = [];
    masteryData.forEach((s) => {
      if (selectedSubject !== "all" && s.subject !== selectedSubject) return;
      s.subtopics.forEach((sub) => {
        if (activeFilter === "strengths" && sub.score < 75) return;
        if (activeFilter === "moderate" && (sub.score < 60 || sub.score >= 75)) return;
        if (activeFilter === "weaknesses" && sub.score >= 60) return;
        list.push({
          subject: s.subject,
          topic: sub.name,
          score: sub.score,
          status: sub.status,
          lastTested: sub.lastTested
        });
      });
    });
    return list.sort((a, b) => a.score - b.score);
  }, [masteryData, selectedSubject, activeFilter]);

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 backdrop-blur-xl p-3.5 rounded-2xl border border-white/15 shadow-2xl text-xs space-y-1.5 min-w-[220px] text-white">
          <div className="font-bold text-white border-b border-white/10 pb-1 flex items-center justify-between">
            <span>{data.subject}</span>
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                data.status === "strength"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : data.status === "moderate"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-400/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              {data.status.toUpperCase()}
            </span>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-slate-300">
              <span>Mastery Index:</span>
              <span className="font-bold font-mono text-sm text-amber-400">{data.masteryScore}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Historical Accuracy:</span>
              <span className="font-bold font-mono text-white">{data.accuracy}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Questions Solved:</span>
              <span className="font-bold text-white">{data.questionsTested} items</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Sleek Obsidian Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl text-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
              <span>Adaptive Topic Mastery Heatmap</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Diagnostic multi-axis retention matrix highlighting high-yield weak spots and ranker strengths
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Topics
          </button>
          <button
            onClick={() => setActiveFilter("weaknesses")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === "weaknesses"
                ? "bg-rose-500 text-white font-bold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Weaknesses
          </button>
          <button
            onClick={() => setActiveFilter("moderate")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === "moderate"
                ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Moderate
          </button>
          <button
            onClick={() => setActiveFilter("strengths")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeFilter === "strengths"
                ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Strengths
          </button>
        </div>
      </div>

      {/* High-Level Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-400/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Mastered Domains (≥ 75%)
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {masteryData.filter((s) => s.status === "strength").length} Subjects
            </div>
            <p className="text-[11px] text-slate-400 mt-1">High retention; maintain with periodic flash drills</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-400/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Consolidation Zone (60-74%)
            </span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {masteryData.filter((s) => s.status === "moderate").length} Subjects
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Requires 1-2 focused PYQ sessions to convert to strength</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-rose-400/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              Remediation Critical (&lt; 60%)
            </span>
            <div className="text-2xl font-black text-rose-400 mt-0.5">
              {masteryData.filter((s) => s.status === "weakness").length} Subjects
            </div>
            <p className="text-[11px] text-slate-400 mt-1">High negative marking risk in actual exam simulations</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Main Bar Chart of Mastery by Subject */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Mastery Index by Core Exam Syllabus Subject</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Derived from weighted performance across adaptive drill sessions and timed mock tests
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[10px]">
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>≥ 75% Strength</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>60-74% Moderate</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>&lt; 60% Weak</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredMasteryData} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis
                dataKey="shortSubject"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomBarTooltip />} />
              <ReferenceLine
                y={75}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{ value: "Mastery Benchmark: 75%", fill: "#10b981", fontSize: 10 }}
              />
              <ReferenceLine
                y={60}
                stroke="#f43f5e"
                strokeDasharray="3 3"
                label={{ value: "Safe Threshold: 60%", fill: "#f43f5e", fontSize: 10 }}
              />
              <Bar dataKey="masteryScore" radius={[8, 8, 0, 0]}>
                {filteredMasteryData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subtopic Heatmap Matrix Grid */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Granular Subtopic Diagnostic Matrix ({matrixSubtopics.length} Micro-Topics)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click any subtopic to immediately launch an adaptive targeted drill session
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-medium">Filter Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-950 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="all">All Subjects</option>
              {masteryData.map((s) => (
                <option key={s.subject} value={s.subject}>
                  {s.shortSubject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {matrixSubtopics.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                showToast(`Launching targeted drill on: ${item.topic}`, "info");
                setActiveTab("practice");
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                item.score >= 80
                  ? "bg-slate-900/70 border-emerald-500/30 hover:border-emerald-400 text-white"
                  : item.score >= 65
                  ? "bg-slate-900/70 border-cyan-500/30 hover:border-cyan-400 text-white"
                  : item.score >= 55
                  ? "bg-slate-900/70 border-amber-400/30 hover:border-amber-400 text-white"
                  : "bg-slate-900/70 border-rose-500/40 hover:border-rose-400 text-white animate-pulse"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-amber-400 truncate max-w-[170px]">{item.subject}</span>
                  <span>{item.lastTested}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.topic}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10">
                <div className="flex items-center space-x-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.score >= 75 ? "bg-emerald-400" : item.score >= 60 ? "bg-amber-400" : "bg-rose-500"
                    }`}
                  />
                  <span className="text-[10px] font-bold text-slate-300">
                    Mastery: <span className="font-mono text-white">{item.score}%</span>
                  </span>
                </div>

                <span className="text-[10px] font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                  Practice Drill <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { TopicMasteryHeatmap };
