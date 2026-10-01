import { useState } from "react";
import { useApp } from "../context/AppContext";
import logoImg from "../assets/logo.png";
import heroVideo from "../assets/pragyapath-video.mp4";
import {
  Compass,
  GraduationCap,
  Sparkles,
  BotMessageSquare,
  ArrowRight,
  ShieldCheck,
  LogIn,
  UserPlus,
  PlayCircle,
  Award,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export const LandingPageView = () => {
  const { openAuthModal, login, register, showToast } = useApp();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleQuickDemo = async () => {
    setIsDemoLoading(true);
    try {
      const demoEmail = "student.demo@pragyapath.edu";
      const demoPassword = "DemoStudent2026!";
      try {
        await login(demoEmail, demoPassword);
      } catch {
        // Auto-register if not yet created in MongoDB Atlas
        await register({
          name: "Anya Bandgar",
          email: demoEmail,
          password: demoPassword,
          targetExamId: "upsc_cse",
          targetGoal: "National & State Competitive Exams (IAS / IPS / CGL)",
          degreeOrStream: "Bachelor Degree (Final Year / Graduate)",
          dailyHours: 4
        });
      }
    } catch (err) {
      showToast("Demo sign in failed. Please use Create Account.", "error");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Background Cinematic Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60 scale-105 transition-opacity duration-1000"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Dark Film Noir & Amber Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/30 border-2 border-amber-400 bg-white/10 backdrop-blur-md p-0.5 group-hover:scale-105 transition-transform">
            <img src={logoImg} alt="PragyaPath Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-md">
              PragyaPath
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              MERN Stack
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => openAuthModal("login")}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white hover:text-amber-300 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => openAuthModal("register")}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-lg shadow-amber-500/25 hover:scale-102"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Get Started</span>
          </button>
        </div>
      </header>

      {/* Main Center Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto py-8 sm:py-12">
        {/* Emblem Logo Badge */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.35)] border-2 border-amber-400/90 mb-6 bg-white/10 backdrop-blur-xl p-1.5 animate-in zoom-in duration-500">
          <img
            src={logoImg}
            alt="PragyaPath Emblem Logo"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] mb-3">
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
            PRAGYAPATH
          </span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.25em] text-amber-300 drop-shadow-md mb-4">
          Wisdom • Path • Knowledge
        </p>

        <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
          Intelligent AI-powered career discovery, exam eligibility engine, personalized phase-wise syllabi, curated free learning resources, and adaptive practice drills for India&apos;s toughest competitive examinations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
          <button
            onClick={() => openAuthModal("register")}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2 group hover:scale-102"
          >
            <span>Create Student Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => openAuthModal("login")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/30 shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Instant 1-Click Demo Login */}
        <div className="mt-4">
          <button
            onClick={handleQuickDemo}
            disabled={isDemoLoading}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 backdrop-blur-md transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isDemoLoading ? "Authenticating with MongoDB..." : "Instant Demo Student Access (1-Click)"}</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-10 w-full max-w-3xl">
          {[
            { title: "UPSC, SSC, Banking", desc: "Targeted Exam Roadmaps", icon: Compass },
            { title: "Adaptive PYQs", desc: "Real-time Streaks & Analytics", icon: Award },
            { title: "AI Study Mentor", desc: "24/7 Contextual Guidance", icon: BotMessageSquare },
            { title: "MongoDB Atlas", desc: "Synchronized Cloud Progress", icon: ShieldCheck }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-left hover:border-amber-400/40 transition-colors"
              >
                <Icon className="w-4 h-4 text-amber-400 mb-1.5" />
                <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 border-t border-white/10 backdrop-blur-md bg-black/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">PragyaPath Portal</span>
            <span className="text-slate-600">•</span>
            <span>MERN Stack (MongoDB, Express, React, Node.js)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Official Gazettes & Examination Portals</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
