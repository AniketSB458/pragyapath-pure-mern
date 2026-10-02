import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Zap,
  TrendingUp,
  Volume2,
  VolumeX,
  PlusCircle,
  History,
  Check
} from "lucide-react";
import { playCelebrationSound, playReminderChime, sendDesktopNotification } from "../utils/sound";

const FocusTimer = () => {
  const { profile, updateProfile, addDailySession, showToast, t } = useApp();

  const timerModes = [
    { label: "Pomodoro (25m)", minutes: 25, type: "pomodoro", icon: Clock },
    { label: "Deep Sprint (50m)", minutes: 50, type: "deep", icon: Zap },
    { label: "Rapid Drill (15m)", minutes: 15, type: "rapid", icon: TrendingUp }
  ];

  const subjectOptions = [
    "Indian Polity & Governance",
    "Quantitative Aptitude & DI",
    "Modern Indian History",
    "General Science & Tech",
    "Indian Economy & Schemes",
    "General Intelligence & Reasoning",
    "Environment & Ecology",
    "Current Affairs & IR"
  ];

  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSubject, setActiveSubject] = useState(subjectOptions[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalSecondsElapsedInSession, setTotalSecondsElapsedInSession] = useState(0);

  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("pragyapath_focus_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalSessionSeconds = selectedMinutes * 60;
  const progressPercent = totalSessionSeconds > 0
    ? Math.min(100, Math.max(0, Math.round(((totalSessionSeconds - timeLeftSeconds) / totalSessionSeconds) * 100)))
    : 0;

  useEffect(() => {
    try {
      localStorage.setItem("pragyapath_focus_history", JSON.stringify(sessionHistory.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }
  }, [sessionHistory]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
        setTotalSecondsElapsedInSession((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeftSeconds]);

  const handleSessionComplete = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (soundEnabled) {
      playCelebrationSound();
    }
    sendDesktopNotification(
      "Focus Sprint Completed! 🎯",
      `Outstanding focus! You mastered ${selectedMinutes} minutes on ${activeSubject}.`
    );

    logSessionToPerformance(selectedMinutes);

    showToast(`Sprint Completed! +${selectedMinutes} minutes added to your daily progress.`, "success");
    setIsRunning(false);
  };

  const logSessionToPerformance = (minutesToLog) => {
    const newEntry = {
      id: "focus-" + Date.now(),
      subject: activeSubject,
      topic: customTopic.trim() || "Deep Topic Practice",
      durationMinutes: minutesToLog,
      completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0]
    };

    setSessionHistory((prev) => [newEntry, ...prev].slice(0, 15));

    const updatedTotalMinutes = (profile.totalStudyMinutes || 0) + minutesToLog;
    updateProfile({
      totalStudyMinutes: updatedTotalMinutes
    });

    addDailySession({
      title: `${activeSubject}: ${customTopic.trim() || "Focus Sprint"}`,
      subject: activeSubject,
      topic: customTopic.trim() || "Focused Revision",
      durationMinutes: minutesToLog,
      sessionType: "Focus Sprint",
      completed: true,
      priority: "high"
    });
  };

  const handleManualLogElapsed = () => {
    const elapsedMinutes = Math.max(1, Math.round(totalSecondsElapsedInSession / 60));
    logSessionToPerformance(elapsedMinutes);
    setTimeLeftSeconds(selectedMinutes * 60);
    setTotalSecondsElapsedInSession(0);
    if (soundEnabled) {
      playCelebrationSound();
    }
    showToast(`Logged ${elapsedMinutes} minutes of active study to your performance ledger!`, "success");
  };

  const handleStart = () => {
    setIsRunning(true);
    if (soundEnabled) {
      playReminderChime();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = (newMinutes) => {
    const mins = newMinutes !== undefined ? newMinutes : selectedMinutes;
    setIsRunning(false);
    setSelectedMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    setTotalSecondsElapsedInSession(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const todayLoggedMinutes = useMemo(() => {
    return sessionHistory.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [sessionHistory]);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-white/10 shadow-sm relative overflow-hidden text-white">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5 relative z-10">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-md">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Active Focus Timer</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
                  {todayLoggedMinutes}m Logged Today
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Timed deep study sprints. Completed sessions automatically sync with your performance metrics and topic analytics.
          </p>
        </div>

        {/* Preset Modes */}
        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-0.5 rounded-xl border border-white/10 text-[11px] font-semibold">
          {timerModes.map((m) => (
            <button
              key={m.minutes}
              onClick={() => handleReset(m.minutes)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedMinutes === m.minutes
                  ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timer Display & Subject Target Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
        {/* Left: Interactive Circular Timer Ring */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-white/10 text-white shadow-inner relative overflow-hidden">
          {/* Circular Countdown Display */}
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-amber-400 transition-all duration-500 ease-out"
                strokeWidth="6"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl font-black tracking-tight text-white drop-shadow-md">
                {formatTime(timeLeftSeconds)}
              </span>
              <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest mt-0.5">
                {isRunning ? "Sprint Active" : timeLeftSeconds === 0 ? "Completed" : "Ready"}
              </span>
            </div>
          </div>

          {/* Timer Controls Strip */}
          <div className="flex items-center space-x-2.5 mt-2">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer flex items-center space-x-1.5 border border-amber-300"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Start Sprint</span>
              </button>
            )}

            <button
              onClick={() => handleReset()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              title={soundEnabled ? "Chime sound enabled" : "Muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {totalSecondsElapsedInSession >= 60 && !isRunning && (
              <button
                onClick={handleManualLogElapsed}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition-all cursor-pointer flex items-center space-x-1 border border-white/15"
                title="Log completed study time so far to performance data"
              >
                <Check className="w-3 h-3" />
                <span>Log ({Math.round(totalSecondsElapsedInSession / 60)}m)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Study Subject & Custom Topic Assignment Form */}
        <div className="md:col-span-6 space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Study Subject:</span>
            </label>
            <select
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-white/15 bg-slate-800/90 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-2xs"
            >
              {subjectOptions.map((subj) => (
                <option key={subj} value={subj} className="bg-slate-900 text-white">
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Specific Topic / Chapter (Optional):</span>
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Fundamental Rights Art 19-22, Quadratic Equations"
              className="w-full text-xs px-3 py-2 rounded-xl border border-white/15 bg-slate-800/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs"
            />
          </div>

          {/* Quick Study Tip Pill */}
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between text-xs text-amber-200">
            <span className="text-[11px] leading-relaxed">
              💡 <strong>Performance Sync:</strong> Time logged here increments your total study hours, advances your study streak, and directly updates subject mastery charts.
            </span>
          </div>

          {/* Quick Action: Log Current Focus Session Now */}
          <button
            onClick={() => {
              logSessionToPerformance(selectedMinutes);
              showToast(`Logged ${selectedMinutes}m for ${activeSubject} directly to performance data!`, "success");
              if (soundEnabled) playCelebrationSound();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 border border-white/15"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick-Log {selectedMinutes}m Session Without Waiting</span>
          </button>
        </div>
      </div>

      {/* Recent Logged Sessions Strip */}
      {sessionHistory.length > 0 && (
        <div className="pt-3 border-t border-white/10 text-xs relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-300 flex items-center space-x-1.5 text-[11px]">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Recent Focus Sessions Logged:</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Synced with Performance Dashboard
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sessionHistory.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-white/10 text-[11px] text-slate-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">{item.durationMinutes}m</span>
                <span className="text-slate-500">•</span>
                <span className="truncate max-w-[130px] font-medium">{item.subject.split("&")[0]}</span>
                <span className="text-[10px] text-slate-400">({item.completedAt})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { FocusTimer };
