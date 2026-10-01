import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toast } from "./components/Toast";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { LandingPageView } from "./components/LandingPageView";

import { DashboardView } from "./components/DashboardView";
import { CareerDiscoveryView } from "./components/CareerDiscoveryView";
import { ExamEligibilityView } from "./components/ExamEligibilityView";
import { RoadmapView } from "./components/RoadmapView";
import { FreeResourcesView } from "./components/FreeResourcesView";
import { DailyPlannerView } from "./components/DailyPlannerView";
import { AdaptivePracticeView } from "./components/AdaptivePracticeView";
import { MockTestsView } from "./components/MockTestsView";
import { MentorChatView } from "./components/MentorChatView";
import { MyLibraryView } from "./components/MyLibraryView";
import { ProfileModal } from "./components/ProfileModal";
import { AuthModal } from "./components/AuthModal";
import logoImg from "./assets/logo.png";
import heroVideo from "./assets/pragyapath-video.mp4";

import { ShieldCheck } from "lucide-react";

const AppContent = () => {
  const {
    activeTab,
    setActiveTab,
    t,
    isAuthenticated,
    isAuthModalOpen,
    closeAuthModal,
    authModalInitialMode
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 1. Initial State: Cinematic Video Landing Page with Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans selection:bg-amber-500 selection:text-slate-950">
        <LandingPageView />

        {/* Auth Modal for Sign In & Registration with MongoDB Atlas */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalInitialMode}
        />

        {/* Global Toast Alerts */}
        <Toast />
      </div>
    );
  }

  // 2. Authenticated State: Full PragyaPath Portal & Learning Modules
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white animate-in fade-in duration-300">
      {/* Ambient Glassmorphic Background Glow Orbs */}
      <div className="fixed top-[-12%] left-[-8%] w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full ambient-glow-1 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[32%] right-[-12%] w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] rounded-full ambient-glow-2 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-15%] left-[20%] w-[650px] sm:w-[800px] h-[650px] sm:h-[800px] rounded-full ambient-glow-3 blur-3xl pointer-events-none -z-10" />

      {/* Titlebar Header */}
      <Header onOpenProfileModal={() => setIsProfileModalOpen(true)} />

      {/* Navigation (Desktop Tabs & Mobile Bottom Navigation Bar) */}
      <Navigation onOpenProfileModal={() => setIsProfileModalOpen(true)} />

      {/* Optional Compact Hero Banner on Dashboard */}
      {activeTab === "dashboard" && (
        <div className="relative w-full h-48 sm:h-64 overflow-hidden shadow-md border-b border-amber-500/20 bg-slate-950">
          <video 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-50 z-0"
            src={heroVideo}
            autoPlay 
            loop 
            muted 
            playsInline
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full bg-gradient-to-b from-black/60 via-black/40 to-slate-950/80 text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-serif">
              PRAGYAPATH LEARNING PORTAL
            </h2>
            <p className="text-xs sm:text-sm text-amber-300 uppercase tracking-widest mt-1">
              Wisdom • Path • Knowledge
            </p>
          </div>
        </div>
      )}

      {/* Main Content Modules */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-8 relative z-0">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "careers" && <CareerDiscoveryView />}
        {activeTab === "exams" && <ExamEligibilityView />}
        {activeTab === "roadmap" && <RoadmapView />}
        {activeTab === "resources" && <FreeResourcesView />}
        {activeTab === "planner" && <DailyPlannerView />}
        {activeTab === "practice" && <AdaptivePracticeView />}
        {activeTab === "mocks" && <MockTestsView />}
        {activeTab === "mentor" && <MentorChatView />}
        {activeTab === "library" && <MyLibraryView />}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalInitialMode}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast />

      {/* Footer */}
      <footer className="glass-card border-x-0 border-b-0 mt-12 py-8 text-xs text-slate-500 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* PragyaPath Brand Logo */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-400 shadow-sm shrink-0 group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
              <img
                src={logoImg}
                alt="PragyaPath Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              PragyaPath
            </span>
            <span className="text-slate-300">|</span>
            <span>{t("tagline")}</span>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-600 font-medium">
            <button
              onClick={() => setActiveTab("careers")}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {t("nav_careers")}
            </button>
            <button
              onClick={() => setActiveTab("exams")}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {t("nav_exams")}
            </button>
            <button
              onClick={() => setActiveTab("roadmap")}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {t("nav_roadmap")}
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {t("nav_resources")}
            </button>
            <button
              onClick={() => setActiveTab("practice")}
              className="hover:text-indigo-600 cursor-pointer"
            >
              {t("nav_practice")}
            </button>
          </div>

          {/* Source Information */}
          <div className="flex items-center space-x-1.5 text-slate-400 text-center sm:text-left">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Sourced from Official Gazettes & IISc / UPSC / SSC Notifications
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
