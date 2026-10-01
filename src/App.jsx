import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toast } from "./components/Toast";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";

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

import { ShieldCheck, ArrowRight, PlayCircle, LogIn, Sparkles } from "lucide-react";

const AppContent = () => {
  const {
    activeTab,
    setActiveTab,
    t,
    isAuthenticated,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authModalInitialMode
  } = useApp();

  // Sequential Flow: "intro" -> "auth" -> "profile" -> "portal"
  // Starts fresh on every page refresh (no sessionStorage bypass)
  const [flowStage, setFlowStage] = useState("intro");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // If user logs out from inside the portal, reset back to intro
  useEffect(() => {
    if (!isAuthenticated && flowStage === "portal") {
      setFlowStage("intro");
    }
  }, [isAuthenticated, flowStage]);

  // STAGE 1, 2, 3: Pre-Portal Sequential Gate (Video Intro -> Auth Modal -> Profile Form)
  if (flowStage !== "portal") {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
        {/* Full-screen Background Video */}
        <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover opacity-60 scale-105 transition-opacity duration-1000"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Glassmorphic Film Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-slate-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.85)_100%)]" />
        </div>

        {/* Top Header Bar on Intro */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/30 border-2 border-amber-400 bg-white/10 backdrop-blur-md p-0.5 group-hover:scale-105 transition-transform">
              <img src={logoImg} alt="PragyaPath Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-md">
                PragyaPath
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={() => setFlowStage("portal")}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                Skip to Portal →
              </button>
            )}
            <button
              onClick={() => setFlowStage("auth")}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-lg shadow-amber-500/25"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          </div>
        </header>

        {/* Center Intro Showcase */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.35)] border-2 border-amber-400/90 mb-5 bg-white/10 backdrop-blur-xl p-1.5 animate-in zoom-in duration-500">
            <img src={logoImg} alt="PragyaPath Logo" className="w-full h-full object-cover rounded-2xl" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] mb-2 font-serif">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              PRAGYAPATH
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.25em] text-amber-300 drop-shadow-md mb-4">
            Wisdom • Path • Knowledge
          </p>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
            AI-powered career discovery, exam eligibility engine, personalized phase-wise syllabi, curated free resources, and adaptive practice drills for competitive examinations.
          </p>

          {/* Step 1 CTA: Opens Authentication Modal */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={() => setFlowStage("auth")}
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2 group hover:scale-102"
            >
              <span>Continue to Authentication</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400 border-t border-white/10 backdrop-blur-md bg-black/40">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sourced from Official Gazettes & Examination Portals</span>
            </div>
          </div>
        </footer>

        {/* STEP 2: Authentication Modal */}
        <AuthModal
          isOpen={flowStage === "auth" || isAuthModalOpen}
          onClose={() => {
            closeAuthModal();
            if (flowStage === "auth") setFlowStage("intro");
          }}
          onSuccess={() => {
            closeAuthModal();
            // Advance to Step 3: Profile/Information Form
            setFlowStage("profile");
          }}
          initialMode={authModalInitialMode}
        />

        {/* STEP 3: Profile / Information Modal */}
        <ProfileModal
          isOpen={flowStage === "profile"}
          onClose={() => {
            // Once profile is reviewed or closed, advance to Step 4: Main Website Portal
            setFlowStage("portal");
          }}
          onComplete={() => {
            // After saving profile information, reveal the main website
            setFlowStage("portal");
          }}
        />

        <Toast />
      </div>
    );
  }

  // STAGE 4: Main Website Portal (Revealed only after Video -> Auth -> Profile)
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-amber-50/40 via-rose-50/25 to-pink-50/40 text-slate-900 font-sans flex flex-col selection:bg-pink-500 selection:text-white animate-in fade-in duration-500">
      {/* Ambient Glassmorphic Background Glow Orbs */}
      <div className="fixed top-[-12%] left-[-8%] w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full ambient-glow-1 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[32%] right-[-12%] w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] rounded-full ambient-glow-2 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-15%] left-[20%] w-[650px] sm:w-[800px] h-[650px] sm:h-[800px] rounded-full ambient-glow-3 blur-3xl pointer-events-none -z-10" />

      {/* Titlebar Header */}
      <Header onOpenProfileModal={() => setIsProfileModalOpen(true)} />

      {/* Navigation (Desktop Tabs & Mobile Bottom Navigation Bar) */}
      <Navigation onOpenProfileModal={() => setIsProfileModalOpen(true)} />

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

      {/* Profile Modal from within the website */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Auth Modal for re-authentication / switching */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalInitialMode}
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
              className="hover:text-pink-600 cursor-pointer"
            >
              {t("nav_careers")}
            </button>
            <button
              onClick={() => setActiveTab("exams")}
              className="hover:text-pink-600 cursor-pointer"
            >
              {t("nav_exams")}
            </button>
            <button
              onClick={() => setActiveTab("roadmap")}
              className="hover:text-pink-600 cursor-pointer"
            >
              {t("nav_roadmap")}
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className="hover:text-pink-600 cursor-pointer"
            >
              {t("nav_resources")}
            </button>
            <button
              onClick={() => setActiveTab("practice")}
              className="hover:text-pink-600 cursor-pointer"
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
