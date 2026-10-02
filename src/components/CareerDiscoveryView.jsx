import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { CAREERS_DATABASE, ROADMAPS_DATABASE } from "../data/mockData";
import {
  Compass,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  BrainCircuit,
  Zap,
  RotateCcw,
  Loader2
} from "lucide-react";

const CareerDiscoveryView = () => {
  const { profile, updateProfile, setActiveCareer, setActiveTab, setActiveRoadmap, showToast, t } = useApp();
  const [selectedSector, setSelectedSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCareerDetail, setActiveCareerDetail] = useState(CAREERS_DATABASE[0]);

  const [stream, setStream] = useState("B.Tech Computer Science");
  const [interests, setInterests] = useState("Artificial Intelligence, Algorithms, Problem Solving");
  const [workStyle, setWorkStyle] = useState("High Impact Engineering & Deep Tech");
  const [targetSector, setTargetSector] = useState("Tech / AI & Research");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);

  const detailPaneRef = useRef(null);

  const sectors = ["All", "Technology", "Public Sector", "Administration", "Cyber Defense"];

  const filteredCareers = CAREERS_DATABASE.filter((c) => {
    const matchesSector = selectedSector === "All" || c.sector.toLowerCase().includes(selectedSector.toLowerCase());
    const matchesQuery =
      searchQuery.trim() === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.coreSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSector && matchesQuery;
  });

  const handleSelectCareer = (career) => {
    setActiveCareerDetail(career);
    if (window.innerWidth < 1024 && detailPaneRef.current) {
      detailPaneRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRunAiDiscovery = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/discovery/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stream, interests, workStyle, targetSector })
      });
      const data = await res.json();
      if (data && data.recommendations && data.recommendations.length > 0) {
        setAiRecommendations(data.recommendations);
        showToast("Identified tailored career matches!", "success");
      } else {
        showToast("Generated preliminary matches for your academic stream.", "info");
      }
    } catch (e) {
      console.error(e);
      showToast("Error connecting to AI advisor. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectCareerAsGoal = (career) => {
    updateProfile({
      targetGoal: career.title,
      targetSector: career.sector
    });
    setActiveCareer(career);
    if (ROADMAPS_DATABASE[career.recommendedRoadmapId]) {
      setActiveRoadmap(ROADMAPS_DATABASE[career.recommendedRoadmapId]);
    }
    showToast(`Target goal updated to: ${career.title}`, "success");
    setActiveTab("roadmap");
  };

  const handleResetSearch = () => {
    setSelectedSector("All");
    setSearchQuery("");
  };

  return (
    <div className="space-y-4 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("careers_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("careers_banner_desc")}
          </p>
        </div>
      </div>

      {/* Interactive AI Career Discovery Form */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {t("careers_engine_title")}
              </h2>
              <p className="text-xs text-slate-400">
                {t("careers_engine_desc")}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-500/10 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-md border border-amber-400/30 shrink-0 self-start sm:self-auto shadow-2xs">
            {t("careers_powered_gemini")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t("careers_lbl_stream")}
            </label>
            <input
              type="text"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              placeholder="e.g. 12th PCM, Diploma ME, B.Tech CSE"
              className="w-full text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-950 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t("careers_lbl_interests")}
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Coding, Math, Administration, Hardware"
              className="w-full text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-950 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Preferred Work Culture
            </label>
            <input
              type="text"
              value={workStyle}
              onChange={(e) => setWorkStyle(e.target.value)}
              placeholder="e.g. High Innovation, Job Security, Public Service"
              className="w-full text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-950 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Target Industry / Sector
            </label>
            <input
              type="text"
              value={targetSector}
              onChange={(e) => setTargetSector(e.target.value)}
              placeholder="e.g. Tech Startups, PSUs, Civil Services"
              className="w-full text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-950 text-white placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunAiDiscovery}
            disabled={isAnalyzing}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Profiles & Trajectories...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Run Intelligent Career Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* AI Recommendations Output */}
        {aiRecommendations && (
          <div className="mt-6 pt-5 border-t border-white/10 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Tailored Career Matches & Strategic Rationale</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-400/30 bg-slate-950/70 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{rec.title}</span>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {rec.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {rec.rationale}
                    </p>

                    <div className="text-[11px] space-y-1 text-slate-400 mb-3">
                      <p><strong className="text-slate-200">Sector:</strong> {rec.sector}</p>
                      <p><strong className="text-slate-200">Est. Package:</strong> {rec.avgSalary}</p>
                      <p><strong className="text-slate-200">Key Exam:</strong> {rec.entryExam}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {rec.coreSkills?.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded text-slate-300 font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateProfile({ targetGoal: rec.title });
                      showToast(`Target goal updated to: ${rec.title}`, "success");
                      setActiveTab("roadmap");
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-amber-400 hover:text-slate-950 hover:bg-amber-400 border border-amber-400/40 rounded-xl transition-all cursor-pointer"
                  >
                    Adopt Pathway & Roadmap →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Career Database Explorer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">
              Verified Career Directory
            </h2>
            <p className="text-xs text-slate-400">
              Detailed breakdown of entry pathways from 10th, Diploma, and B.Tech
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search careers or skills..."
                className="w-full sm:w-60 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Sector Filters */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedSector === sec
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xs"
                      : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state when search returns no match */}
        {filteredCareers.length === 0 && (
          <div className="glass-card rounded-2xl border border-white/10 p-8 text-center space-y-3 bg-slate-900/60 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">No careers matching your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any career matching "{searchQuery}" in {selectedSector}.
            </p>
            <button
              onClick={handleResetSearch}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Search & Filter</span>
            </button>
          </div>
        )}

        {/* 2-Column: Career Cards List (Left) and Deep Details (Right) */}
        {filteredCareers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Cards */}
            <div className="lg:col-span-5 space-y-3">
              {filteredCareers.map((career) => {
                const isSelected = activeCareerDetail?.id === career.id;
                return (
                  <div
                    key={career.id}
                    onClick={() => handleSelectCareer(career)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-slate-800/90 shadow-md ring-1 ring-amber-400/50"
                        : "border-white/10 bg-slate-900/60 hover:bg-slate-800/70 hover:border-amber-400/30 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {career.sector}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {career.salaryRangeINR.split(" ")[0]}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{career.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {career.shortDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {career.coreSkills.slice(0, 2).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-slate-950 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {career.coreSkills.length > 2 && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            +{career.coreSkills.length - 2}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-amber-400 flex items-center lg:hidden">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Detail Pane */}
            <div className="lg:col-span-7" ref={detailPaneRef}>
              {activeCareerDetail ? (
                <div className="glass-card rounded-2xl border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5 lg:sticky lg:top-28 bg-slate-900/80 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                        {activeCareerDetail.sector}
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold text-white mt-2">
                        {activeCareerDetail.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => handleSelectCareerAsGoal(activeCareerDetail)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 transition-all cursor-pointer self-start sm:self-auto"
                    >
                      Select as My Primary Goal →
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeCareerDetail.fullDescription}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Compensation Range
                      </span>
                      <p className="font-bold text-white mt-0.5">
                        {activeCareerDetail.salaryRangeINR}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Growth Outlook
                      </span>
                      <p className="font-bold text-emerald-400 mt-0.5">
                        {activeCareerDetail.growthOutlook.split("(")[0]}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Key Entry Exams
                      </span>
                      <p className="font-bold text-amber-300 mt-0.5">
                        {activeCareerDetail.entryExams[0]}
                      </p>
                    </div>
                  </div>

                  {/* Multi-Pathway Trajectories */}
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Progression Pathways from Different Academic Stages</span>
                    </h3>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl border border-white/10 bg-slate-950/50">
                        <p className="text-xs font-bold text-amber-400">
                          Path from 10th Standard:
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300 mt-1">
                          {activeCareerDetail.pathwayFrom10th.map((step, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <span className="bg-slate-900 border border-white/15 px-2 py-0.5 rounded text-[11px] font-medium text-white">
                                {step}
                              </span>
                              {sIdx < activeCareerDetail.pathwayFrom10th.length - 1 && (
                                <ChevronRight className="w-3 h-3 text-slate-500" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-white/10 bg-slate-950/50">
                        <p className="text-xs font-bold text-amber-400">
                          Path for Diploma Students:
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300 mt-1">
                          {activeCareerDetail.pathwayFromDiploma.map((step, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <span className="bg-slate-900 border border-white/15 px-2 py-0.5 rounded text-[11px] font-medium text-white">
                                {step}
                              </span>
                              {sIdx < activeCareerDetail.pathwayFromDiploma.length - 1 && (
                                <ChevronRight className="w-3 h-3 text-slate-500" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-white/10 bg-slate-950/50">
                        <p className="text-xs font-bold text-amber-400">
                          Path for B.Tech / Undergraduates:
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300 mt-1">
                          {activeCareerDetail.pathwayFromBTech.map((step, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <span className="bg-slate-900 border border-white/15 px-2 py-0.5 rounded text-[11px] font-medium text-white">
                                {step}
                              </span>
                              {sIdx < activeCareerDetail.pathwayFromBTech.length - 1 && (
                                <ChevronRight className="w-3 h-3 text-slate-500" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day In The Life */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Day in the Life
                    </h3>
                    <p className="text-xs text-amber-200 italic bg-amber-500/10 p-3 rounded-xl border border-amber-400/20 leading-relaxed">
                      "{activeCareerDetail.dayInTheLife}"
                    </p>
                  </div>

                  {/* Core Skills & Recruiters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 mb-1.5">Core Skills Required</h4>
                      <div className="flex flex-wrap gap-1">
                        {activeCareerDetail.coreSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-300 mb-1.5">Prominent Recruiters</h4>
                      <div className="flex flex-wrap gap-1">
                        {activeCareerDetail.topRecruiters.map((rec, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-800 text-slate-300 border border-white/10 px-2 py-0.5 rounded"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl border border-white/10 p-8 text-center text-slate-400 bg-slate-900/60">
                  Select any career on the left to view comprehensive pathway analytics.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { CareerDiscoveryView };
