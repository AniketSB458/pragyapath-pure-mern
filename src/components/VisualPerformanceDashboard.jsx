import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  TrendingUp,
  Clock,
  BarChart3,
  ArrowUpRight,
  Zap
} from "lucide-react";

const VisualPerformanceDashboard = () => {
  const { profile, dailySessions, recentAttempts, setActiveTab, t } = useApp();
  const [activeView, setActiveView] = useState("both");
  const [timeFilter, setTimeFilter] = useState("all");

  const mockTrendData = useMemo(() => {
    const defaultHistoricalMocks = [
      {
        name: "Mock 1: Baseline",
        shortName: "Mock 1",
        date: "Aug 15",
        score: 58,
        accuracy: 62,
        cutoff: 65,
        questions: 50
      },
      {
        name: "Mock 2: Quantitative Drill",
        shortName: "Mock 2",
        date: "Aug 24",
        score: 64,
        accuracy: 69,
        cutoff: 65,
        questions: 40
      },
      {
        name: "Mock 3: Indian Polity",
        shortName: "Mock 3",
        date: "Sep 02",
        score: 72,
        accuracy: 75,
        cutoff: 65,
        questions: 45
      },
      {
        name: "Mock 4: History Sprint",
        shortName: "Mock 4",
        date: "Sep 10",
        score: 76,
        accuracy: 78,
        cutoff: 65,
        questions: 45
      },
      {
        name: "Mock 5: CS & Aptitude",
        shortName: "Mock 5",
        date: "Sep 18",
        score: 83,
        accuracy: 85,
        cutoff: 65,
        questions: 50
      },
      {
        name: "Mock 6: Full Simulation",
        shortName: "Mock 6",
        date: "Sep 27",
        score: 88,
        accuracy: 89,
        cutoff: 65,
        questions: 60
      }
    ];

    if (recentAttempts && recentAttempts.length > 0) {
      const attemptsReversed = [...recentAttempts].reverse();
      const dynamicAttempts = attemptsReversed.map((att, idx) => {
        const attemptDate = att.createdAt
          ? new Date(att.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
          : `Test ${idx + 1}`;
        const scoreOutOf100 = att.totalMarks > 0 ? Math.round((att.score / att.totalMarks) * 100) : att.score;
        return {
          name: att.testTitle || `Attempt ${idx + 1}`,
          shortName: `Test ${idx + 1}`,
          date: attemptDate,
          score: scoreOutOf100,
          accuracy: att.accuracyPercentage || att.accuracyPercent || 70,
          cutoff: 65,
          questions: att.totalQuestions || 20
        };
      });
      return dynamicAttempts;
    }

    return defaultHistoricalMocks;
  }, [recentAttempts]);

  const filteredMockTrendData = useMemo(() => {
    if (timeFilter === "recent") {
      return mockTrendData.slice(-3);
    }
    if (timeFilter === "month") {
      return mockTrendData.slice(-5);
    }
    return mockTrendData;
  }, [mockTrendData, timeFilter]);

  const topicTimeData = useMemo(() => {
    const subjectsMap = {
      "General Studies & Aptitude": { totalMins: 380, theory: 190, practice: 95, revision: 60, color: "#f59e0b" },
      "Operating Systems & Architecture": { totalMins: 320, theory: 160, practice: 80, revision: 50, color: "#eab308" },
      "Indian Polity & Governance": { totalMins: 290, theory: 145, practice: 75, revision: 45, color: "#10b981" },
      "Data Structures & Algorithms": { totalMins: 240, theory: 120, practice: 60, revision: 40, color: "#06b6d4" },
      "General Science": { totalMins: 210, theory: 110, practice: 70, revision: 30, color: "#fbbf24" },
      "Current Affairs & Schemes": { totalMins: 165, theory: 90, practice: 45, revision: 30, color: "#a855f7" }
    };

    dailySessions.forEach((s) => {
      const match = Object.keys(subjectsMap).find(
        (k) => s.subject.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(s.subject.toLowerCase())
      );
      if (match) {
        subjectsMap[match].totalMins += s.durationMinutes;
        if (s.sessionType.includes("Practice") || s.sessionType.includes("PYQ")) {
          subjectsMap[match].practice += s.durationMinutes;
        } else if (s.sessionType.includes("Revision") || s.sessionType.includes("Quiz")) {
          subjectsMap[match].revision += s.durationMinutes;
        } else {
          subjectsMap[match].theory += s.durationMinutes;
        }
      }
    });

    return Object.entries(subjectsMap)
      .map(([subject, stats]) => {
        const shortSubject = subject.length > 18 ? subject.split("&")[0].trim() : subject;
        return {
          subject,
          shortSubject,
          hours: parseFloat((stats.totalMins / 60).toFixed(1)),
          minutes: stats.totalMins,
          theoryMinutes: stats.theory,
          practiceMinutes: stats.practice,
          revisionMinutes: stats.revision,
          color: stats.color
        };
      })
      .sort((a, b) => b.hours - a.hours);
  }, [dailySessions]);

  const cognitiveFormulaData = useMemo(() => {
    let totalTheory = 0;
    let totalPractice = 0;
    let totalRevision = 0;
    let totalQuiz = 0;

    topicTimeData.forEach((t) => {
      totalTheory += t.theoryMinutes;
      totalPractice += t.practiceMinutes;
      totalRevision += t.revisionMinutes;
    });

    totalQuiz = Math.round(totalPractice * 0.35);
    const sum = totalTheory + totalPractice + totalRevision + totalQuiz;
    if (sum === 0) return [];

    return [
      { name: "Concept & Theory", value: Math.round((totalTheory / sum) * 100), color: "#f59e0b", target: "50%" },
      { name: "PYQ Practice", value: Math.round((totalPractice / sum) * 100), color: "#eab308", target: "25%" },
      { name: "Weak Topic Revision", value: Math.round((totalRevision / sum) * 100), color: "#06b6d4", target: "15%" },
      { name: "Adaptive Quizzes", value: Math.round((totalQuiz / sum) * 100), color: "#10b981", target: "10%" }
    ];
  }, [topicTimeData]);

  const latestMock = mockTrendData[mockTrendData.length - 1] || { score: 88, accuracy: 89 };
  const firstMock = mockTrendData[0] || { score: 58, accuracy: 62 };
  const scoreImprovement = latestMock.score - firstMock.score;
  const accuracyImprovement = latestMock.accuracy - firstMock.accuracy;

  const totalStudyMinutes = useMemo(() => {
    return topicTimeData.reduce((acc, t) => acc + t.minutes, 0);
  }, [topicTimeData]);

  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Sleek Obsidian Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl text-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
              <span>{t("analytics_banner_title") || "Visual Performance Intelligence"}</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              CBT simulation trajectories, accuracy curves, and subject hour distribution
            </p>
          </div>
        </div>

        {/* View Mode & Range Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center rounded-xl border border-white/10 p-0.5 bg-slate-950/60 text-[11px] font-semibold">
            <button
              onClick={() => setActiveView("both")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeView === "both"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Analytics
            </button>
            <button
              onClick={() => setActiveView("trends")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeView === "trends"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Mock Trends
            </button>
            <button
              onClick={() => setActiveView("topics")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeView === "topics"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Topic Hours
            </button>
          </div>

          {/* Time Filter */}
          <div className="flex items-center rounded-xl border border-white/10 p-0.5 bg-slate-950/60 text-[11px] font-semibold">
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === "all"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter("month")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === "month"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeFilter("recent")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === "recent"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-400/30 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Latest Mock Score
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-white">{latestMock.score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{scoreImprovement} pts trajectory
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-emerald-400/30 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Peak Accuracy
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{latestMock.accuracy}%</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{accuracyImprovement}% over baseline
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Cumulative Study
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-300">{totalStudyHours}</span>
            <span className="text-xs text-slate-400">Hours</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 mt-1">
            Across {topicTimeData.length} syllabus subjects
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Exam Cutoff Delta
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-white">
              +{Math.max(0, latestMock.score - 65)}
            </span>
            <span className="text-xs text-slate-400">pts above cutoff</span>
          </div>
          <span className="text-[10px] font-bold text-amber-400 mt-1">
            Target Cutoff: 65.0
          </span>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mock Test Score & Accuracy Progression */}
        {(activeView === "both" || activeView === "trends") && (
          <div className={`${activeView === "trends" ? "lg:col-span-12" : "lg:col-span-7"} glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Mock Score & Accuracy Progression</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chronological performance across timed diagnostic simulations
                </p>
              </div>

              <div className="flex items-center space-x-3 text-[11px] font-semibold">
                <span className="flex items-center space-x-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Score (pts)</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Accuracy %</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredMockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="accuracyGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="shortName" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[40, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "12px"
                    }}
                  />
                  <ReferenceLine
                    y={65}
                    label={{ value: "Cutoff: 65", fill: "#f59e0b", fontSize: 10 }}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                  />
                  <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} fill="url(#scoreGlow)" name="Score" />
                  <Area type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} fill="url(#accuracyGlow)" name="Accuracy %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Topic Time Distribution */}
        {(activeView === "both" || activeView === "topics") && (
          <div className={`${activeView === "topics" ? "lg:col-span-12" : "lg:col-span-5"} glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Subject Time Distribution (Hours)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Cumulative hours committed across high-yield subjects
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicTimeData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis type="category" dataKey="shortSubject" tick={{ fill: "#cbd5e1", fontSize: 10 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="hours" radius={[0, 8, 8, 0]}>
                    {topicTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Cognitive 50/25/15/10 Active Recall Compliance */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Scientific Cognitive Balance Compliance
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
            Active Recall Target: 50% Theory • 25% PYQ • 15% Revision • 10% Quizzes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {cognitiveFormulaData.map((item) => (
            <div key={item.name} className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.name}</span>
                <span className="text-amber-400 font-bold">Goal: {item.target}</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-black text-white">{item.value}%</span>
                <span className="text-[10px] text-slate-400">actual effort</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { VisualPerformanceDashboard };
