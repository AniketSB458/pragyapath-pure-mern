import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import {
  Award,
  Crown,
  Sun,
  Target,
  Zap,
  BookOpen,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight
} from "lucide-react";

const Badges = () => {
  const { profile, dailySessions, recentAttempts, notes, setActiveTab } = useApp();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badgesList = useMemo(() => {
    const streak = profile.streakDays || 1;
    const questionsSolved = profile.questionsSolved || 0;
    const correctAnswers = profile.correctAnswers || 0;
    const accuracy = questionsSolved > 0 ? Math.round((correctAnswers / questionsSolved) * 100) : 0;
    const totalMinutes =
      profile.totalStudyMinutes ||
      dailySessions.filter((s) => s.completed).reduce((acc, s) => acc + s.durationMinutes, 0) + 120;
    const completedTopics = profile.completedTopicIds?.length || 0;
    const notesCount = notes?.length || 0;
    const attemptsCount = recentAttempts?.length || 0;
    const completedSessionsCount = dailySessions.filter((s) => s.completed).length;

    const hasEarlySession = dailySessions.some((s) => {
      if (!s.reminderTime) return false;
      const hour = parseInt(s.reminderTime.split(":")[0], 10);
      return !isNaN(hour) && hour < 10;
    });

    return [
      {
        id: "early-bird",
        title: "Early Bird",
        description: "Schedule and complete study sessions in the morning hours before 10:00 AM.",
        category: "Focus",
        tier: "Bronze",
        icon: Sun,
        color: {
          bg: "bg-slate-900/70",
          border: "border-amber-400/30",
          text: "text-amber-300",
          gradient: "from-amber-400 to-amber-500",
          iconBg: "bg-amber-500/20 text-amber-400"
        },
        isUnlocked: hasEarlySession || completedSessionsCount > 0,
        progress: hasEarlySession || completedSessionsCount > 0 ? 100 : 50,
        currentValue: hasEarlySession ? "Morning Active" : "Pending",
        targetValue: "Morning Slot",
        unlockedAt: "Unlocked Today",
        xpPoints: 50
      },
      {
        id: "consistency-king",
        title: "Discipline Master",
        description: "Achieve and sustain an unbroken study streak of 7 consecutive active days.",
        category: "Streak",
        tier: "Silver",
        icon: Crown,
        color: {
          bg: "bg-slate-900/70",
          border: "border-amber-400/40",
          text: "text-amber-300",
          gradient: "from-amber-400 to-yellow-500",
          iconBg: "bg-amber-400/20 text-amber-300"
        },
        isUnlocked: streak >= 7,
        progress: Math.min(100, Math.round((streak / 7) * 100)),
        currentValue: `${streak} Days`,
        targetValue: "7 Days",
        unlockedAt: streak >= 7 ? "Week 1 Mastered" : undefined,
        xpPoints: 120
      },
      {
        id: "accuracy-ace",
        title: "Precision Sniper",
        description: "Maintain an overall question solving accuracy exceeding 75% across drills.",
        category: "Mastery",
        tier: "Gold",
        icon: Target,
        color: {
          bg: "bg-slate-900/70",
          border: "border-emerald-400/30",
          text: "text-emerald-300",
          gradient: "from-emerald-400 to-emerald-500",
          iconBg: "bg-emerald-500/20 text-emerald-400"
        },
        isUnlocked: accuracy >= 75 && questionsSolved >= 10,
        progress: Math.min(100, Math.round((accuracy / 75) * 100)),
        currentValue: `${accuracy}% Acc`,
        targetValue: "75% Acc",
        unlockedAt: accuracy >= 75 ? "Diagnostic Calibrated" : undefined,
        xpPoints: 150
      },
      {
        id: "century-club",
        title: "Century Solver",
        description: "Solve more than 50 rigorous competitive examination practice items.",
        category: "Practice",
        tier: "Silver",
        icon: Zap,
        color: {
          bg: "bg-slate-900/70",
          border: "border-cyan-400/30",
          text: "text-cyan-300",
          gradient: "from-cyan-400 to-blue-500",
          iconBg: "bg-cyan-500/20 text-cyan-400"
        },
        isUnlocked: questionsSolved >= 50,
        progress: Math.min(100, Math.round((questionsSolved / 50) * 100)),
        currentValue: `${questionsSolved} Items`,
        targetValue: "50 Items",
        unlockedAt: questionsSolved >= 50 ? "PYQ Milestone" : undefined,
        xpPoints: 100
      },
      {
        id: "deep-worker",
        title: "Deep Work Anchor",
        description: "Commit over 5 cumulative hours of high-concentration Pomodoro focus sprints.",
        category: "Focus",
        tier: "Gold",
        icon: BookOpen,
        color: {
          bg: "bg-slate-900/70",
          border: "border-amber-400/30",
          text: "text-amber-300",
          gradient: "from-amber-400 to-amber-600",
          iconBg: "bg-amber-500/20 text-amber-400"
        },
        isUnlocked: totalMinutes >= 300,
        progress: Math.min(100, Math.round((totalMinutes / 300) * 100)),
        currentValue: `${Math.round(totalMinutes / 60)}h`,
        targetValue: "5 Hours",
        unlockedAt: totalMinutes >= 300 ? "Cognitive Depth" : undefined,
        xpPoints: 130
      },
      {
        id: "syllabus-crusher",
        title: "Syllabus Conqueror",
        description: "Mark and verify completion of 5 distinct high-yield topics in the roadmap.",
        category: "Milestone",
        tier: "Silver",
        icon: ShieldCheck,
        color: {
          bg: "bg-slate-900/70",
          border: "border-emerald-400/30",
          text: "text-emerald-300",
          gradient: "from-emerald-400 to-teal-500",
          iconBg: "bg-emerald-500/20 text-emerald-400"
        },
        isUnlocked: completedTopics >= 5,
        progress: Math.min(100, Math.round((completedTopics / 5) * 100)),
        currentValue: `${completedTopics} Topics`,
        targetValue: "5 Topics",
        unlockedAt: completedTopics >= 5 ? "Phase Cleared" : undefined,
        xpPoints: 90
      },
      {
        id: "vault-keeper",
        title: "Vault Scribe",
        description: "Draft and preserve high-yield revision formulas and short notes in the Library Vault.",
        category: "Study",
        tier: "Bronze",
        icon: FileText,
        color: {
          bg: "bg-slate-900/70",
          border: "border-amber-400/30",
          text: "text-amber-300",
          gradient: "from-amber-400 to-yellow-500",
          iconBg: "bg-amber-500/20 text-amber-400"
        },
        isUnlocked: notesCount >= 1,
        progress: Math.min(100, Math.round((notesCount / 1) * 100)),
        currentValue: `${notesCount} Notes`,
        targetValue: "1 Note",
        unlockedAt: notesCount >= 1 ? "Vault Initiated" : undefined,
        xpPoints: 60
      },
      {
        id: "mock-gladiator",
        title: "Mock Gladiator",
        description: "Complete authentic timed mock examinations to benchmark real cutoff readiness.",
        category: "Milestone",
        tier: "Gold",
        icon: Award,
        color: {
          bg: "bg-slate-900/70",
          border: "border-amber-400/40",
          text: "text-amber-300",
          gradient: "from-amber-500 to-amber-600",
          iconBg: "bg-amber-500/20 text-amber-400"
        },
        isUnlocked: attemptsCount >= 1,
        progress: Math.min(100, Math.round((attemptsCount / 1) * 100)),
        currentValue: `${attemptsCount} Attempted`,
        targetValue: "1 Mock",
        unlockedAt: attemptsCount >= 1 ? "Simulated Readiness" : undefined,
        xpPoints: 110
      }
    ];
  }, [profile, dailySessions, recentAttempts, notes]);

  const unlockedCount = badgesList.filter((b) => b.isUnlocked).length;
  const totalCount = badgesList.length;
  const totalXp = badgesList.filter((b) => b.isUnlocked).reduce((sum, b) => sum + b.xpPoints, 0);

  const filteredBadges = useMemo(() => {
    if (selectedFilter === "unlocked") {
      return badgesList.filter((b) => b.isUnlocked);
    }
    if (selectedFilter === "progress") {
      return badgesList.filter((b) => !b.isUnlocked);
    }
    return badgesList;
  }, [badgesList, selectedFilter]);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    if (badge.isUnlocked) {
      try {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.7 },
          colors: ["#f59e0b", "#d97706", "#ffffff"]
        });
      } catch (e) {}
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-white/10 shadow-xl relative overflow-hidden bg-slate-900/60 backdrop-blur-xl text-white">
      {/* Background Accent Pill */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-400/10 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/25">
            <Award className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>Aspirant Badges & Honors</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {unlockedCount} / {totalCount} Earned
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified milestones rewarding discipline, active recall, and simulation mastery
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setSelectedFilter("unlocked")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedFilter === "unlocked"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setSelectedFilter("progress")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedFilter === "progress"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            In Progress ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1.5 overflow-hidden">
            {badgesList.slice(0, 4).map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs shadow-2xs ${
                    b.isUnlocked ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              );
            })}
          </div>
          <div>
            <span className="font-bold text-white">Honor Track Progression</span>
            <p className="text-[11px] text-slate-400">
              {Math.round((unlockedCount / totalCount) * 100)}% of total awards unlocked
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Aspirant XP</span>
            <div className="text-sm font-extrabold text-amber-400">+{totalXp} XP</div>
          </div>
          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                badge.isUnlocked
                  ? "bg-slate-900/70 border-amber-400/30 hover:border-amber-400 shadow-md text-white"
                  : "bg-slate-950/40 border-white/5 text-slate-500 hover:border-white/15"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      badge.isUnlocked ? "bg-amber-500/20 text-amber-400 border border-amber-400/30" : "bg-white/5 text-slate-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      badge.isUnlocked
                        ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
                        : "bg-slate-800 text-slate-500 border-white/5"
                    }`}
                  >
                    {badge.tier}
                  </span>
                </div>

                <h4
                  className={`text-xs font-bold leading-tight ${
                    badge.isUnlocked ? "text-white group-hover:text-amber-300" : "text-slate-400"
                  }`}
                >
                  {badge.title}
                </h4>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400">{badge.currentValue}</span>
                  <span className="text-slate-400">Target: {badge.targetValue}</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      badge.isUnlocked ? "bg-amber-400" : "bg-slate-700"
                    }`}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>

                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[9px] font-bold text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> Unlocked
                    </span>
                    <span className="text-[9px] font-extrabold text-amber-400">+{badge.xpPoints} XP</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[9px] font-medium text-slate-500 flex items-center">
                      <Lock className="w-2.5 h-2.5 mr-0.5" /> {badge.progress}% progress
                    </span>
                    <span className="text-[9px] text-slate-500">+{badge.xpPoints} XP</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Dialog Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-white/15 bg-slate-900/95 text-white animate-in zoom-in-95 duration-150 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25 bg-amber-500/20 text-amber-400 border border-amber-400/40">
              {React.createElement(selectedBadge.icon, { className: "w-8 h-8 text-amber-400" })}
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {selectedBadge.tier} Tier Honor • +{selectedBadge.xpPoints} XP
              </span>
              <h3 className="text-base font-bold text-white mt-1.5">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedBadge.description}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-xs flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <span className={`font-bold ${selectedBadge.isUnlocked ? "text-emerald-400" : "text-amber-400"}`}>
                {selectedBadge.isUnlocked ? "Unlocked & Verified ✓" : `${selectedBadge.progress}% In Progress`}
              </span>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Continue Preparation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Badges };
