import { useState } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { formatTime12h, playReminderChime, requestNotificationPermission } from "../utils/sound";
import {
  CalendarCheck2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  CheckSquare,
  Bell,
  BellRing,
  Volume2,
  Zap
} from "lucide-react";

const DailyPlannerView = () => {
  const {
    profile,
    updateProfile,
    dailySessions,
    toggleDailySession,
    addDailySession,
    setTaskReminder,
    triggerStudyReminderToast,
    quickScheduleAllReminders,
    startFocusForSession,
    showToast,
    focusTimer,
    t
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("General Studies & Aptitude");
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [newTaskType, setNewTaskType] = useState("Concept & Theory");
  const [newTaskPriority, setNewTaskPriority] = useState("high");
  const [newTaskReminderEnabled, setNewTaskReminderEnabled] = useState(true);
  const [newTaskReminderTime, setNewTaskReminderTime] = useState("09:00");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [reminderModalTime, setReminderModalTime] = useState("09:00");
  const [reminderModalEnabled, setReminderModalEnabled] = useState(true);

  const completedCount = dailySessions.filter((s) => s.completed).length;
  const totalCount = dailySessions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalMinutes = dailySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const completedMinutes = dailySessions.filter((s) => s.completed).reduce((acc, s) => acc + s.durationMinutes, 0);
  const activeRemindersCount = dailySessions.filter((s) => s.reminderEnabled && !s.completed).length;

  const handleToggleTask = (session) => {
    const isNowCompleted = !session.completed;
    toggleDailySession(session.id);
    if (isNowCompleted) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addDailySession({
      title: newTaskTitle,
      subject: newTaskSubject,
      topic: newTaskSubject,
      durationMinutes: newTaskDuration,
      sessionType: newTaskType,
      priority: newTaskPriority,
      reminderTime: newTaskReminderEnabled ? newTaskReminderTime : undefined,
      reminderEnabled: newTaskReminderEnabled
    });

    setNewTaskTitle("");
    setShowAddModal(false);
  };

  const openReminderEditor = (session, e) => {
    if (e) e.stopPropagation();
    setEditingSession(session);
    setReminderModalTime(session.reminderTime || "09:00");
    setReminderModalEnabled(session.reminderEnabled ?? true);
  };

  const saveReminderChanges = () => {
    if (!editingSession) return;
    setTaskReminder(editingSession.id, reminderModalTime, reminderModalEnabled);
    setEditingSession(null);
  };

  const handleTestReminder = (session, e) => {
    if (e) e.stopPropagation();
    triggerStudyReminderToast(session);
  };

  const handleTestChimeOnly = () => {
    playReminderChime();
    showToast("Synthesized notification chime played!", "info");
  };

  const handleRequestBrowserPerm = async () => {
    const perm = await requestNotificationPermission();
    if (perm === "granted") {
      showToast("Desktop notifications enabled alongside toasts!", "success");
    } else {
      showToast("Browser notifications blocked. Toasts will continue to alert you in-app.", "info");
    }
  };

  const handleRebalanceSchedule = (hours) => {
    updateProfile({ dailyHours: hours });
    confetti({ particleCount: 30, spread: 45 });
  };

  const presetTimes = [
    { label: "Morning", time: "08:00", icon: "🌅" },
    { label: "Mid-Morning", time: "10:30", icon: "☀️" },
    { label: "Afternoon", time: "14:00", icon: "🌤️" },
    { label: "Evening", time: "18:00", icon: "🌆" },
    { label: "Night", time: "21:00", icon: "🌙" }
  ];

  return (
    <div className="space-y-4 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <CalendarCheck2 className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("planner_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("planner_banner_desc")}
          </p>
        </div>

        {/* Daily Hours Selector */}
        <div className="flex items-center space-x-1.5 text-xs shrink-0">
          <span className="text-slate-400 font-medium hidden sm:inline">{t("planner_available_hours")}:</span>
          {[2, 3, 4, 6].map((hrs) => (
            <button
              key={hrs}
              onClick={() => handleRebalanceSchedule(hrs)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                profile.dailyHours === hrs
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-400"
                  : "bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15 backdrop-blur-md"
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </div>

      {/* Daily Study Reminders Control Bar */}
      <div className="glass-card rounded-2xl p-4 border border-amber-400/25 bg-slate-900/70 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0 font-bold">
            <BellRing className="w-5 h-5 animate-wiggle" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold text-white">Daily Study Reminders (Toast Notifications)</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                {activeRemindersCount} Active Today
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Scheduled tasks display interactive toast notifications with audio chimes and one-click Focus Sprint launch.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              const pending = dailySessions.find((s) => !s.completed) || dailySessions[0];
              if (pending) {
                triggerStudyReminderToast(pending);
              }
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            title="Immediately trigger a live toast reminder for the next upcoming study task"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Test Reminder Toast</span>
          </button>

          <button
            onClick={quickScheduleAllReminders}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Auto-assign scheduled times across the day for all planned tasks"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Schedule All</span>
          </button>

          <button
            onClick={handleTestChimeOnly}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 transition-all cursor-pointer shadow-2xs"
            title="Test synthetic notification chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column: Left Tasks & Balance, Right Pomodoro Focus Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks List & Balance Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                  <span>{t("planner_today_schedule")}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {completedMinutes} of {totalMinutes} study minutes completed ({progressPercent}%)
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("planner_btn_add_task")}</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-amber-400/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* 50/25/15/10 Rule Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 mb-4 text-xs text-slate-300">
              <div className="flex items-center justify-between font-bold text-[11px] text-slate-300 uppercase mb-2">
                <span>Cognitive Balance Allocation:</span>
                <span className="text-amber-400">Active Recall Formula</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-white/10 font-bold text-slate-200">50% Theory</div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-white/10 font-bold text-slate-200">25% PYQs</div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-white/10 font-bold text-slate-200">15% Revision</div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-white/10 font-bold text-slate-200">10% Quiz</div>
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-3">
              {dailySessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleToggleTask(session)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    session.completed
                      ? "bg-slate-950/40 border-white/5 text-slate-500"
                      : "bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-amber-400/30 text-white shadow-2xs"
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <button
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        session.completed ? "bg-emerald-500 text-slate-950 font-black" : "border-2 border-slate-600 hover:border-amber-400"
                      }`}
                    >
                      {session.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          session.completed ? "line-through text-slate-500" : "text-white"
                        }`}
                      >
                        {session.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span className="font-semibold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded">
                          {session.subject}
                        </span>
                        <span>•</span>
                        <span>{session.sessionType}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{session.durationMinutes}m</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Reminder Pill + Priority + Actions */}
                  <div
                    className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Reminder Status Badge & Trigger */}
                    {session.reminderEnabled && session.reminderTime ? (
                      <button
                        onClick={(e) => openReminderEditor(session, e)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer shadow-2xs ${
                          session.completed
                            ? "bg-slate-900 text-slate-500 border-white/5"
                            : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30 group"
                        }`}
                        title="Click to edit reminder time or toggle"
                      >
                        <Bell className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>{formatTime12h(session.reminderTime)}</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => openReminderEditor(session, e)}
                        className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-amber-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                        title="Set daily reminder"
                      >
                        <Bell className="w-3 h-3" />
                        <span>+ Reminder</span>
                      </button>
                    )}

                    {/* Quick Test Toast for this task */}
                    {!session.completed && (
                      <button
                        onClick={(e) => handleTestReminder(session, e)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-400 transition-colors cursor-pointer border border-white/10"
                        title="Trigger toast reminder now"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Launch Focus Timer for this task */}
                    {!session.completed && (
                      <button
                        onClick={() => startFocusForSession(session)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all cursor-pointer border border-white/10"
                        title={`Start focus timer (${session.durationMinutes}m)`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        session.priority === "high"
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : session.priority === "medium"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                          : "bg-slate-800 text-slate-400 border border-white/10"
                      }`}
                    >
                      {session.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Focus Timer & Scientific Recall Principles */}
        <div className="lg:col-span-5 space-y-6">
          {/* Integrated Pomodoro Deep Work Timer */}
          <div className="glass-card rounded-3xl p-6 shadow-xl text-center space-y-5 border border-white/10 bg-slate-900/70 backdrop-blur-2xl">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/20 shadow-2xs">
                Deep Work Mode
              </span>
              <h3 className="text-base font-bold text-white mt-2">
                Integrated Pomodoro Focus Timer
              </h3>
              <p className="text-xs text-slate-400">
                Retain 40% more information with timed concentration sprints
              </p>
            </div>

            {/* Timer Dial Display */}
            <div className="py-4">
              <div className="w-48 h-48 mx-auto rounded-full border-8 border-amber-500/30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md shadow-inner shadow-black">
                <span className="font-mono text-4xl font-extrabold tracking-tight text-white">
                  {String(focusTimer.minutes).padStart(2, "0")}:
                  {String(focusTimer.seconds).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-bold text-amber-400 mt-1 uppercase">
                  {focusTimer.isRunning ? "Active Focus Sprint" : "Paused"}
                </span>
              </div>
            </div>

            {/* Quick Intervals */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => focusTimer.reset(25)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer"
              >
                25m Standard
              </button>
              <button
                onClick={() => focusTimer.reset(50)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer"
              >
                50m Deep Work
              </button>
              <button
                onClick={() => focusTimer.reset(5)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer"
              >
                5m Break
              </button>
            </div>

            {/* Timer Action Controls */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              {focusTimer.isRunning ? (
                <button
                  onClick={focusTimer.pause}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause Timer</span>
                </button>
              ) : (
                <button
                  onClick={focusTimer.start}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Focus Session</span>
                </button>
              )}

              <button
                onClick={() => focusTimer.reset(25)}
                className="p-2.5 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Notification Opt-in Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-white/10 p-5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Smart Study Reminders</span>
              </div>
              <button
                onClick={handleRequestBrowserPerm}
                className="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
              >
                Browser Permission
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              PragyaPath delivers study reminders through in-app toast notifications. Keep this tab open or pinned in your browser to never miss your study slots.
            </p>
          </div>

          {/* Cognitive Science Study Tip */}
          <div className="bg-amber-500/10 rounded-2xl border border-amber-400/25 p-5 shadow-2xs">
            <div className="flex items-center space-x-2 text-amber-300 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Pragya Pedagogical Principle: The Testing Effect
              </h4>
            </div>
            <p className="text-xs text-amber-200 leading-relaxed">
              Passively re-reading notes creates an illusion of competence. Attempting 5 hard PYQs where you struggle produces up to <strong className="text-white">300% higher neural retention</strong> than re-watching lecture videos.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Configure Study Reminder */}
      {editingSession && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-white/15 bg-slate-900/95 text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Set Daily Study Reminder</h3>
                  <p className="text-[11px] text-slate-400">Toast notification alert</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSession(null)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                <div className="font-bold text-white text-xs">{editingSession.title}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {editingSession.subject} • {editingSession.durationMinutes} mins
                </div>
              </div>

              {/* Enable toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-white/10">
                <div>
                  <div className="font-bold text-white text-xs">Enable Reminder Alert</div>
                  <div className="text-slate-400 text-[11px]">Show toast notification at scheduled time</div>
                </div>
                <input
                  type="checkbox"
                  checked={reminderModalEnabled}
                  onChange={(e) => setReminderModalEnabled(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
                />
              </div>

              {/* Time Selector */}
              {reminderModalEnabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Reminder Time (24-Hour / Local Clock)
                    </label>
                    <input
                      type="time"
                      value={reminderModalTime}
                      onChange={(e) => setReminderModalTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono font-bold rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Formatted as: <strong className="text-amber-300">{formatTime12h(reminderModalTime)}</strong>
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div>
                    <span className="block font-bold text-slate-300 mb-1.5">Quick Presets:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {presetTimes.map((preset) => (
                        <button
                          key={preset.time}
                          type="button"
                          onClick={() => setReminderModalTime(preset.time)}
                          className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                            reminderModalTime === preset.time
                              ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs"
                              : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                          }`}
                        >
                          <div className="text-[11px]">{preset.icon} {preset.label}</div>
                          <div className="text-[10px] font-mono mt-0.5 opacity-90">{formatTime12h(preset.time)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleTestReminder(editingSession)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Toast Alert Now</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingSession(null)}
                    className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveReminderChanges}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    Save Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-white/15 bg-slate-900/95 text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Add Custom Study Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 10 Paging & TLB Gate PYQs"
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Session Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Concept & Theory">Concept & Theory</option>
                    <option value="PYQ Practice">PYQ Practice</option>
                    <option value="Weak Topic Revision">Weak Topic Revision</option>
                    <option value="Adaptive Quiz">Adaptive Quiz</option>
                    <option value="Mock Test">Mock Test</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Study Reminder Configuration in Add Modal */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-white font-bold">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Set Daily Study Reminder</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newTaskReminderEnabled}
                    onChange={(e) => setNewTaskReminderEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                  />
                </div>

                {newTaskReminderEnabled && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Reminder Time ({formatTime12h(newTaskReminderTime)})
                    </label>
                    <input
                      type="time"
                      value={newTaskReminderTime}
                      onChange={(e) => setNewTaskReminderTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { DailyPlannerView };
