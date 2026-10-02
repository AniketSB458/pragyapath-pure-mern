import { useMemo } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import {
  Flame,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  Shield,
  Zap,
  Target
} from "lucide-react";

const ConsistencyStreak = () => {
  const { profile, updateProfile, dailySessions, showToast, t } = useApp();

  const milestones = useMemo(
    () => [
      {
        days: 3,
        title: "Ignition Stage",
        subtitle: "First Habit Loop Formed",
        rewardXp: 50,
        icon: Zap,
        color: {
          bg: "bg-amber-400/10",
          border: "border-amber-400/30",
          text: "text-amber-300",
          badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/40",
          gradient: "from-amber-400 to-amber-500"
        }
      },
      {
        days: 7,
        title: "Fortitude Week",
        subtitle: "100% Habit Retention",
        rewardXp: 120,
        icon: Target,
        color: {
          bg: "bg-amber-400/10",
          border: "border-amber-400/30",
          text: "text-amber-300",
          badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/40",
          gradient: "from-amber-400 to-amber-500"
        }
      },
      {
        days: 14,
        title: "Discipline Anchor",
        subtitle: "Two Weeks Unbroken Practice",
        rewardXp: 250,
        icon: Award,
        color: {
          bg: "bg-amber-400/10",
          border: "border-amber-400/30",
          text: "text-amber-300",
          badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/40",
          gradient: "from-amber-400 to-amber-500"
        }
      },
      {
        days: 30,
        title: "Iron Resolve Month",
        subtitle: "Cognitive Endurance Mastered",
        rewardXp: 500,
        icon: Flame,
        color: {
          bg: "bg-amber-400/10",
          border: "border-amber-400/30",
          text: "text-amber-300",
          badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/40",
          gradient: "from-amber-400 to-amber-500"
        }
      },
      {
        days: 60,
        title: "Ranker Zenith",
        subtitle: "Top 0.1% Preparation Mindset",
        rewardXp: 1000,
        icon: Shield,
        color: {
          bg: "bg-amber-400/10",
          border: "border-amber-400/30",
          text: "text-amber-300",
          badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/40",
          gradient: "from-amber-400 to-amber-500"
        }
      }
    ],
    []
  );

  const currentStreak = profile.streakDays || 1;
  const todayStr = new Date().toISOString().split("T")[0];
  const isStudiedToday = profile.lastActiveDate === todayStr || dailySessions.some((s) => s.completed);

  const achievedMilestones = useMemo(
    () => milestones.filter((m) => currentStreak >= m.days),
    [milestones, currentStreak]
  );

  const nextMilestone = useMemo(() => {
    const unachieved = milestones.find((m) => currentStreak < m.days);
    return unachieved || milestones[milestones.length - 1];
  }, [milestones, currentStreak]);

  const daysToNextMilestone = Math.max(0, nextMilestone.days - currentStreak);
  const milestoneProgress = Math.min(100, Math.round((currentStreak / nextMilestone.days) * 100));

  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateNum = d.getDate();
      const isDone = i === 0 ? isStudiedToday : i <= currentStreak;
      days.push({
        dStr,
        dayName,
        dateNum,
        isDone,
        isToday: i === 0
      });
    }
    return days;
  }, [currentStreak, isStudiedToday]);

  const handleCheckInToday = () => {
    if (isStudiedToday) {
      showToast("Today's study streak is already secured and verified!", "info");
      return;
    }

    const newStreak = currentStreak + 1;
    updateProfile({
      streakDays: newStreak,
      lastActiveDate: todayStr
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#d97706", "#ffffff"]
      });
    } catch (e) {
      // Confetti fallback
    }

    showToast(`🔥 Daily Study Streak Advanced! You are now on a ${newStreak}-day streak. Keep pushing!`, "success");
  };

  const handleMilestoneClick = (milestone) => {
    if (currentStreak >= milestone.days) {
      try {
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.65 },
          colors: ["#f59e0b", "#d97706", "#ffffff"]
        });
      } catch (e) {
        // Confetti fallback
      }
      showToast(`🏆 Milestone '${milestone.title}' (${milestone.days}d) Active! Reward: +${milestone.rewardXp} XP.`, "success");
    } else {
      showToast(`🎯 Keep going! Reach ${milestone.days} consecutive study days to unlock '${milestone.title}' (+${milestone.rewardXp} XP).`, "info");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-white/10 shadow-sm relative overflow-hidden text-white">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Streak Metric + Milestone Pill + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center space-x-3.5">
          {/* Animated Flame Container */}
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300 transform transition-transform group-hover:scale-105">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
            {/* Small active badge */}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center space-x-1.5">
                <span>Consistency Streak:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-mono text-xl sm:text-2xl font-black">
                  {currentStreak} Days
                </span>
              </h2>

              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-2xs">
                🔥 ON FIRE
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
              <span>Next Milestone: <strong className="text-slate-200 font-semibold">{nextMilestone.title} ({nextMilestone.days}d)</strong></span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{daysToNextMilestone === 0 ? "Goal Achieved!" : `${daysToNextMilestone} days left`}</span>
            </p>
          </div>
        </div>

        {/* Check-in / Protect Streak Action */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-bold text-slate-300">
              {isStudiedToday ? "Streak Secured" : "Action Needed"}
            </div>
            <div className="text-[10px] text-slate-400">
              {isStudiedToday ? "Today counted" : "Study to protect"}
            </div>
          </div>

          <button
            onClick={handleCheckInToday}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 border ${
              isStudiedToday
                ? "bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
                : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/25"
            }`}
            title="Log study session check-in to advance streak"
          >
            {isStudiedToday ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Today Completed</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Check-in Today (+1d)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 7-Day Rolling Visual Calendar Strip */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xs relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Weekly Study Continuity</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            {weekDays.filter((d) => d.isDone).length} of 7 Days Completed
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                d.isDone
                  ? "bg-amber-400/15 border-amber-400/30 text-amber-300 shadow-2xs"
                  : d.isToday
                  ? "bg-slate-800 border-amber-400/50 border-dashed text-amber-300 ring-2 ring-amber-400/20"
                  : "bg-slate-800/40 border-white/5 text-slate-500"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">{d.dayName}</span>
              <span className="text-xs font-black font-mono my-0.5">{d.dateNum}</span>
              {d.isDone ? <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-in zoom-in" /> : <span className="w-2 h-2 rounded-full bg-slate-600 my-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar Toward Next Milestone */}
      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <span>Milestone Target:</span>
            <strong className="text-amber-400">{nextMilestone.title} ({nextMilestone.days} Days)</strong>
          </span>
          <span className="font-bold font-mono text-amber-400">
            {currentStreak} / {nextMilestone.days} Days ({milestoneProgress}%)
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>
      </div>

      {/* Milestone Checkpoints Shield Grid */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak Milestones & Rewards</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-full">
            {achievedMilestones.length} of {milestones.length} Milestones Hit
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {milestones.map((m) => {
            const isHit = currentStreak >= m.days;
            const Icon = m.icon;
            return (
              <button
                key={m.days}
                onClick={() => handleMilestoneClick(m)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                  isHit
                    ? `${m.color.bg} ${m.color.border} hover:shadow-md hover:scale-[1.02]`
                    : "bg-slate-800/40 border-white/5 opacity-60 hover:opacity-80"
                }`}
              >
                {/* Hit Badge Stamp */}
                {isHit && (
                  <span className="absolute top-2 right-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-2xs">
                    HIT!
                  </span>
                )}

                <div>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 shadow-2xs ${
                      isHit ? `bg-gradient-to-tr ${m.color.gradient} text-slate-950` : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-black font-mono text-white">{m.days}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Days</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 truncate mt-0.5">{m.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{m.subtitle}</p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-400">+{m.rewardXp} XP</span>
                  <span className={isHit ? "text-emerald-400 font-extrabold" : "text-slate-400 font-medium"}>
                    {isHit ? "Unlocked" : `${m.days - currentStreak}d to go`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { ConsistencyStreak };
