import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import logoImg from "../assets/logo.png";
import {
  Compass,
  FileCheck2,
  GitFork,
  BookOpen,
  CalendarDays,
  Target,
  FileSpreadsheet,
  BotMessageSquare,
  BookmarkCheck,
  ChevronDown,
  X
} from "lucide-react";

const Navigation = ({ onOpenProfileModal }) => {
  const { activeTab, setActiveTab, t } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const primaryNavItems = [
    { id: "careers", label: t("nav_careers"), icon: Compass },
    { id: "exams", label: t("nav_exams"), icon: FileCheck2 },
    { id: "roadmap", label: t("nav_roadmap"), icon: GitFork },
    { id: "resources", label: t("nav_resources"), icon: BookOpen },
    { id: "planner", label: t("nav_planner"), icon: CalendarDays },
    { id: "mentor", label: t("nav_mentor"), icon: BotMessageSquare }
  ];

  const secondaryNavItems = [
    { id: "practice", label: t("nav_practice"), icon: Target },
    { id: "mocks", label: t("nav_mocks"), icon: FileSpreadsheet },
    { id: "library", label: t("nav_library"), icon: BookmarkCheck }
  ];

  const activeSecondaryItem = secondaryNavItems.find((item) => item.id === activeTab);

  return (
    <>
      {/* Sleek Obsidian Glass Desktop Navigation (Yellow, Black & White Theme) */}
      <nav className="bg-slate-950/85 backdrop-blur-xl border-b border-white/10 sticky top-14 z-30 hidden md:block shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-1">
              {/* Dashboard Tab with PragyaPath Logo Icon */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 border border-amber-300 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title="PragyaPath Dashboard & Overview"
              >
                <div className="w-4 h-4 rounded-md overflow-hidden border border-amber-400 shrink-0 shadow-2xs bg-white flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{t("nav_dashboard") || "Dashboard"}</span>
              </button>

              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 border border-amber-300 font-bold"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Compact "More Tools" Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeSecondaryItem
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {activeSecondaryItem ? (
                    <>
                      <activeSecondaryItem.icon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeSecondaryItem.label}</span>
                    </>
                  ) : (
                    <span>{t("all_modules")}</span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isMoreOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-white">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMoreOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-xs"
                              : "text-slate-300 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Obsidian Glass with PragyaPath Logo Icon) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-1 flex items-center justify-around safe-area-pb shadow-2xl text-white">
        {/* Home Button with PragyaPath Emblem Logo as Icon */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl cursor-pointer transition-all ${
            activeTab === "dashboard" ? "text-amber-400 font-bold bg-amber-400/10" : "text-slate-400 hover:text-white"
          }`}
          title="PragyaPath Home"
        >
          <div
            className={`w-7 h-7 rounded-xl overflow-hidden border transition-all bg-white flex items-center justify-center ${
              activeTab === "dashboard"
                ? "border-amber-400 ring-2 ring-amber-400 shadow-md shadow-amber-500/25 scale-110"
                : "border-amber-300/80 shadow-2xs hover:scale-105"
            }`}
          >
            <img
              src={logoImg}
              alt="PragyaPath Home"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Home</span>
        </button>

        {primaryNavItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl cursor-pointer ${
                isActive ? "text-amber-400 font-bold bg-amber-400/10" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Mentor / AI Chat */}
        <button
          onClick={() => setActiveTab("mentor")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl cursor-pointer ${
            activeTab === "mentor" ? "text-amber-400 font-bold bg-amber-400/10" : "text-slate-400 hover:text-white"
          }`}
          title="AI Mentor"
        >
          <BotMessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t("nav_mentor")}</span>
        </button>

        {/* More Button */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl cursor-pointer ${
            activeSecondaryItem || activeTab === "library"
              ? "text-amber-400 font-bold bg-amber-400/10"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">
            {activeSecondaryItem ? activeSecondaryItem.label : t("all_modules")}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setIsMobileMoreOpen(false)}
        >
          <div
            className="bg-slate-900 border border-white/15 rounded-t-3xl p-5 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg overflow-hidden border border-amber-400 bg-white">
                  <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold text-white">{t("all_modules")}</span>
              </div>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setActiveTab("library");
                  setIsMobileMoreOpen(false);
                }}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  activeTab === "library"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-xs"
                    : "bg-slate-800/80 text-slate-200 border-white/10 hover:bg-slate-800"
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <span>{t("nav_library")}</span>
              </button>

              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMoreOpen(false);
                    }}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-xs"
                        : "bg-slate-800/80 text-slate-200 border-white/10 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Navigation };
