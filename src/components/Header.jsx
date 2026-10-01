import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { formatTime12h } from "../utils/sound";
import logoImg from "../assets/logo.png";
import {
  Flame,
  Settings2,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  LogIn,
  LogOut,
  UserCheck
} from "lucide-react";

const Header = ({ onOpenProfileModal }) => {
  const {
    profile,
    language,
    setLanguage,
    activeExam,
    dailySessions,
    toggleTaskReminder,
    triggerStudyReminderToast,
    quickScheduleAllReminders,
    setActiveTab,
    user,
    isAuthenticated,
    openAuthModal,
    logout
  } = useApp();

  const [reminderMenuOpen, setReminderMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeReminders = dailySessions.filter((s) => s.reminderEnabled && !s.completed);
  const activeRemindersCount = activeReminders.length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setReminderMenuOpen(false);
      }
    }
    if (reminderMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [reminderMenuOpen]);

  const getInitials = (name) => {
    if (!name) return "PB";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || profile.name || "Student Aspirant";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Titlebar Brand Logo & Active Goal */}
            <div
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 cursor-pointer group"
              title="PragyaPath - Intelligent Career & Exam Navigator"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-amber-500/25 border-2 border-amber-400 shrink-0 group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="PragyaPath Emblem Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                  PragyaPath
                </span>
                <span className="hidden xs:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50/80 backdrop-blur-md text-pink-700 border border-pink-200/80 shadow-2xs">
                  {activeExam?.name || profile.targetGoal}
                </span>
              </div>
            </div>

            {/* Right: Daily Reminder Bell + Streak + Language Toggle + Profile / Auth */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              {/* Daily Study Reminder Notification Bell */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setReminderMenuOpen(!reminderMenuOpen)}
                  className={`relative p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                    reminderMenuOpen
                      ? "bg-pink-50 border-pink-300 text-pink-700"
                      : "bg-white/60 hover:bg-white/90 border-white/80 text-slate-700 hover:text-pink-600 backdrop-blur-md"
                  }`}
                  title="Daily Study Reminders & Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {activeRemindersCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[9px] font-extrabold shadow-xs">
                      {activeRemindersCount}
                    </span>
                  )}
                </button>

                {/* Reminders Popover Menu */}
                {reminderMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">Daily Study Reminders</h3>
                          <p className="text-[10px] text-slate-500">Toast notification alerts</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                        {activeRemindersCount} Scheduled
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {dailySessions.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No study tasks planned for today.</p>
                      ) : (
                        dailySessions.map((session) => (
                          <div
                            key={session.id}
                            className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                              session.completed
                                ? "bg-slate-50/60 border-slate-200/50 opacity-60"
                                : session.reminderEnabled
                                ? "bg-pink-50/40 border-pink-100 hover:border-pink-200"
                                : "bg-white border-slate-100"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-1.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  session.priority === "high"
                                    ? "bg-rose-100 text-rose-700"
                                    : session.priority === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}>
                                  {session.priority.toUpperCase()}
                                </span>
                                <h4 className="font-bold text-slate-800 truncate text-[11px]">
                                  {session.title}
                                </h4>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                {session.subject} • {session.durationMinutes}m
                              </p>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <span className="text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                                {formatTime12h(session.reminderTime || "09:00")}
                              </span>
                              <button
                                onClick={() => toggleTaskReminder(session.id)}
                                className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                                  session.reminderEnabled
                                    ? "text-pink-600 bg-pink-100/60"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                                title={session.reminderEnabled ? "Disable Reminder" : "Enable Reminder"}
                              >
                                <Clock className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={quickScheduleAllReminders}
                        className="text-pink-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Schedule All Day</span>
                      </button>
                      <button
                        onClick={() => {
                          setReminderMenuOpen(false);
                          setActiveTab("planner");
                        }}
                        className="text-slate-600 hover:text-pink-600 font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Planner</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Consistency Streak */}
              <div
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-rose-50/80 backdrop-blur-md shadow-2xs text-amber-700 font-bold text-xs"
                title={`${profile.streakDays || 1}-Day Active Study Consistency Streak`}
              >
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{profile.streakDays || 1}d</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center rounded-xl border border-pink-100 p-0.5 bg-white/60 backdrop-blur-md shadow-2xs text-[11px] font-medium">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-white text-pink-600 font-bold shadow-xs border border-pink-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    language === "hi"
                      ? "bg-white text-pink-600 font-bold shadow-xs border border-pink-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguage("mr")}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    language === "mr"
                  ? "bg-white text-pink-600 font-bold shadow-xs border border-pink-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
                >
                  मराठी
                </button>
              </div>

              {/* User Profile & Authentication Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={onOpenProfileModal}
                    className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-rose-200/80 bg-rose-50/40 backdrop-blur-md hover:bg-rose-100/60 shadow-2xs transition-all cursor-pointer group"
                    title={`Account: ${user?.email || profile.email}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs border border-white/20">
                      {getInitials(displayName)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 hidden sm:inline group-hover:text-pink-600 transition-colors">
                      {displayName.split(" ")[0]}
                    </span>
                    <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                      PRO
                    </span>
                  </button>

                  <button
                    onClick={logout}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center space-x-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openAuthModal("login")}
                    className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/90 hover:bg-rose-100 text-rose-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    title="Sign In to your PragyaPath account"
                  >
                    <LogIn className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => openAuthModal("register")}
                    className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white text-xs font-bold shadow-sm shadow-pink-500/25 transition-all cursor-pointer"
                  >
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export { Header };
