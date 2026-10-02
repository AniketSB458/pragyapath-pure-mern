import { useState } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { ROADMAPS_DATABASE } from "../data/mockData";
import {
  GitFork,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  CalendarCheck
} from "lucide-react";

const RoadmapView = () => {
  const { profile, activeRoadmap, toggleTopicCompletion, addDailySession, setActiveTab, showToast, t } = useApp();
  const [expandedPhases, setExpandedPhases] = useState({ 0: true, 1: true });
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const roadmap = activeRoadmap || ROADMAPS_DATABASE["gate-cs-roadmap"] || Object.values(ROADMAPS_DATABASE)[0];

  const totalTopics = roadmap.phases.reduce((acc, p) => acc + p.topics.length, 0);
  const completedTopicsCount = roadmap.phases
    .flatMap((p) => p.topics)
    .filter((topic) => profile.completedTopicIds.includes(topic.id)).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  const togglePhase = (idx) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleToggleTopic = (topicId) => {
    const isNowCompleted = !profile.completedTopicIds.includes(topicId);
    toggleTopicCompletion(topicId);
    if (isNowCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleAddTopicToPlanner = (topic, phaseTitle) => {
    addDailySession({
      title: `Phase Prep: ${topic.title}`,
      subject: roadmap.examCategory,
      topic: topic.title,
      durationMinutes: 60,
      sessionType: "Concept & Theory",
      priority: topic.priority === "high" ? "high" : "medium"
    });
    showToast(`Added "${topic.title}" to Daily Planner!`, "success");
    setActiveTab("planner");
  };

  const handleGenerateCustomRoadmap = (e) => {
    e.preventDefault();
    if (!customGoalInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast(`Custom syllabus generated for: "${customGoalInput}"`, "success");
      setCustomGoalInput("");
    }, 900);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("roadmap_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("roadmap_banner_desc")}
          </p>
        </div>

        {/* Target Indicator */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400">Target Goal:</span>
          <span className="text-xs font-bold bg-amber-500/10 text-amber-300 px-3 py-1 rounded-xl border border-amber-400/30 shadow-2xs">
            {profile.targetGoal || roadmap.title}
          </span>
        </div>
      </div>

      {/* Progress & Architecture Banner */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                {roadmap.examCategory}
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{roadmap.estimatedTotalMonths} Months Full-Cycle Blueprint</span>
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-1">{roadmap.title}</h2>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              {progressPercent}% <span className="text-xs font-normal text-slate-400">Completed</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {completedTopicsCount} of {totalTopics} high-yield topics mastered
            </p>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full transition-all duration-500 shadow-md shadow-amber-500/25"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Multi-Phase Accordion */}
      <div className="space-y-4">
        {roadmap.phases.map((phase, pIdx) => {
          const isExpanded = !!expandedPhases[pIdx];
          const phaseCompletedCount = phase.topics.filter((t) => profile.completedTopicIds.includes(t.id)).length;
          const isPhaseDone = phaseCompletedCount === phase.topics.length && phase.topics.length > 0;

          return (
            <div
              key={phase.phaseNumber}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl bg-slate-900/60 backdrop-blur-xl transition-all"
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(pIdx)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                      isPhaseDone
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-bold"
                    }`}
                  >
                    {isPhaseDone ? "✓" : `P${phase.phaseNumber}`}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold text-white">{phase.title}</h3>
                      <span className="hidden xs:inline text-[10px] font-semibold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                        {phase.durationWeeks} Weeks
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{phase.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    {phaseCompletedCount}/{phase.topics.length} Topics
                  </span>
                  <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Topics Body */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-white/10 bg-slate-950/40 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                    {phase.topics.map((topic) => {
                      const isCompleted = profile.completedTopicIds.includes(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                            isCompleted
                              ? "bg-slate-950/60 border-white/5 opacity-70"
                              : "bg-slate-900/80 border-white/10 hover:border-amber-400/40 shadow-xs"
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <button
                                onClick={() => handleToggleTopic(topic.id)}
                                className={`flex items-center space-x-2 text-left cursor-pointer group`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                                    isCompleted
                                      ? "bg-emerald-500 text-slate-950 font-black"
                                      : "border-2 border-slate-600 group-hover:border-amber-400"
                                  }`}
                                >
                                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </span>
                                <span
                                  className={`text-xs font-bold ${
                                    isCompleted ? "line-through text-slate-500" : "text-white group-hover:text-amber-300"
                                  }`}
                                >
                                  {topic.title}
                                </span>
                              </button>

                              <span
                                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                  topic.priority === "high"
                                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                                    : "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                                }`}
                              >
                                {topic.priority} Yield
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 pl-7 leading-relaxed mb-3">
                              {topic.coreCompetency}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10 pl-7 text-[10px]">
                            <span className="text-slate-400 font-medium">Est. {topic.estimatedHours} Hours</span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleAddTopicToPlanner(topic, phase.title)}
                                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 cursor-pointer"
                                title="Add to Daily Planner"
                              >
                                <CalendarCheck className="w-3 h-3" />
                                <span>+ Planner</span>
                              </button>

                              <button
                                onClick={() => {
                                  showToast(`Filter questions for "${topic.title}" in practice!`, "info");
                                  setActiveTab("practice");
                                }}
                                className="text-slate-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Target className="w-3 h-3" />
                                <span>Practice</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Custom Roadmap Generator Card */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Generate Tailored Syllabus Roadmap
            </h3>
            <p className="text-[11px] text-slate-400">
              Need a roadmap for a specific niche exam or specialization? Type it below to generate a phase-wise curriculum.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateCustomRoadmap} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={customGoalInput}
            onChange={(e) => setCustomGoalInput(e.target.value)}
            placeholder="e.g. RBI Grade B Legal Officer or ISRO Scientist SC (CS)"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !customGoalInput.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? "Synthesizing Syllabus..." : "Generate AI Roadmap →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { RoadmapView };
