import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Bell,
  Flame,
  User,
  LogIn,
  LogOut,
  CalendarCheck2,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import logoImg from "../assets/logo.png";

const Header = ({ onOpenProfileModal }) => {
  const {
    profile,
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    activeExam,
    setActiveTab,
    language,
    setLanguage,
    t,
    dailySessions,
    toggleDailySession,
    triggerStudyReminderToast
  } = useApp();

  const [reminderMenuOpen, setReminderMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeRemindersCount = dailySessions.filter(
    (s) => s.reminderEnabled && !s.completed
  ).length;

  const formatTime12h = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    const hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${m} ${suffix}`;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Titlebar Brand Logo & Active Goal */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 cursor-pointer group"
            title="PragyaPath - Intelligent Career & Exam Navigator"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-amber-500/25 border-2 border-amber-400 shrink-0 group-hover:scale-105 transition-transform bg-white/10 p-0.5 flex items-center justify-center">
              <img
                src={logoImg}
                alt="PragyaPath Emblem Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                PragyaPath
              </span>
              <span className="hidden xs:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow-2xs">
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
                    ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                    : "bg-white/10 hover:bg-white/20 border-white/15 text-slate-300 hover:text-white backdrop-blur-md"
                }`}
                title="Daily Study Reminders & Alerts"
              >
                <Bell className="w-4 h-4" />
                {activeRemindersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black shadow-xs">
                    {activeRemindersCount}
                  </span>
                )}
              </button>

              {/* Reminders Popover Menu */}
              {reminderMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl p-4 z-50 text-white animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">Daily Study Reminders</h3>
                        <p className="text-[10px] text-slate-400">Toast notification alerts</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
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
                          className={`p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                            session.completed
                              ? "bg-slate-800/40 border-white/5 opacity-60 text-slate-400"
                              : "bg-slate-800/80 border-white/10 hover:border-amber-400/40 text-white"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <button
                              onClick={() => toggleDailySession(session.id)}
                              className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                                session.completed ? "bg-emerald-500 text-slate-950 font-bold" : "border border-white/30 hover:border-amber-400"
                              }`}
                            >
                              {session.completed && <CheckCircle2 className="w-3 h-3" />}
                            </button>
                            <div>
                              <p className={`font-semibold line-clamp-1 ${session.completed ? "line-through text-slate-400" : "text-white"}`}>
                                {session.title}
                              </p>
                              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-0.5">
                                <span>{session.subject}</span>
                                <span>•</span>
                                <span>{session.durationMinutes}m</span>
                                {session.reminderTime && (
                                  <>
                                    <span>•</span>
                                    <span className="text-amber-400 flex items-center space-x-0.5 font-medium">
                                      <Clock className="w-2.5 h-2.5" />
                                      <span>{formatTime12h(session.reminderTime)}</span>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {!session.completed && (
                              <button
                                onClick={() => triggerStudyReminderToast(session)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-400/15 text-amber-300 hover:bg-amber-400/25 border border-amber-400/30 transition-colors cursor-pointer"
                                title="Trigger toast preview alert now"
                              >
                                Test Alert
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setReminderMenuOpen(false);
                        setActiveTab("planner");
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <CalendarCheck2 className="w-3.5 h-3.5" />
                      <span>Manage Timetable in Planner →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Streak Counter Pill */}
            <div
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 backdrop-blur-md text-amber-300 text-xs font-bold shadow-2xs cursor-pointer hover:bg-amber-400/20 transition-all"
              title="Daily Active Study Streak"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{profile.streakDays || 1}</span>
              <span className="hidden sm:inline font-semibold text-[11px] text-amber-300/80">days</span>
            </div>

            {/* Multilingual Switcher */}
            <div className="flex items-center border border-white/10 rounded-xl p-0.5 bg-slate-900/90 backdrop-blur-md text-xs shadow-2xs">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  language === "mr"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
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
                  className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 shadow-2xs transition-all cursor-pointer group"
                  title={`Account: ${user?.email || profile.email}`}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                    {getInitials(displayName)}
                  </div>
                  <span className="text-xs font-semibold text-white hidden sm:inline group-hover:text-amber-300 transition-colors">
                    {displayName.split(" ")[0]}
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center space-x-1"
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
                  className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  title="Sign In to your PragyaPath account"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal("register")}
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-sm shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
