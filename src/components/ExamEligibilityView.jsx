import { useState } from "react";
import { useApp } from "../context/AppContext";
import { EXAMS_DATABASE } from "../data/mockData";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
  Sparkles,
  BookOpen
} from "lucide-react";

const ExamEligibilityView = () => {
  const { profile, updateProfile, setActiveExam, setActiveTab, showToast, t } = useApp();
  const [selectedExamId, setSelectedExamId] = useState(profile.targetExamId || "gate-cs");
  const [age, setAge] = useState(21);
  const [category, setCategory] = useState("General");
  const [degree, setDegree] = useState("B.Tech / B.E. (Final Year / Graduated)");
  const [percentage, setPercentage] = useState(72);
  const [attemptsMade, setAttemptsMade] = useState(0);

  const selectedExam = EXAMS_DATABASE.find((e) => e.id === selectedExamId) || EXAMS_DATABASE[0];

  const checkEligibility = () => {
    const reasons = [];
    let isEligible = true;

    let maxAge = selectedExam.eligibilityCriteria.ageLimitMax;
    if (category === "OBC") maxAge += 3;
    if (category === "SC" || category === "ST") maxAge += 5;

    if (age < selectedExam.eligibilityCriteria.ageLimitMin) {
      isEligible = false;
      reasons.push(`Minimum age required is ${selectedExam.eligibilityCriteria.ageLimitMin} years. You are ${age}.`);
    } else if (age > maxAge) {
      isEligible = false;
      reasons.push(
        `Maximum age limit for ${category} category is ${maxAge} years. You are ${age} (General limit: ${selectedExam.eligibilityCriteria.ageLimitMax}).`
      );
    }

    if (selectedExam.eligibilityCriteria.minPercentage > 0 && percentage < selectedExam.eligibilityCriteria.minPercentage) {
      isEligible = false;
      reasons.push(
        `Requires minimum ${selectedExam.eligibilityCriteria.minPercentage}% aggregate in qualifying degree. You entered ${percentage}%.`
      );
    }

    let maxAttempts = selectedExam.eligibilityCriteria.maxAttempts;
    if (maxAttempts > 0) {
      if (category === "OBC") maxAttempts = Math.max(maxAttempts, 9);
      if (category === "SC" || category === "ST") maxAttempts = 99;

      if (attemptsMade >= maxAttempts) {
        isEligible = false;
        reasons.push(`Maximum permissible attempts for ${category} category is ${maxAttempts === 99 ? "Unlimited" : maxAttempts}. You have made ${attemptsMade}.`);
      }
    }

    return { isEligible, reasons };
  };

  const { isEligible, reasons } = checkEligibility();

  const handleSelectAsGoal = () => {
    setActiveExam(selectedExam);
    updateProfile({
      targetExamId: selectedExam.id,
      targetGoal: selectedExam.name
    });
    showToast(`Target exam updated to: ${selectedExam.name}`, "success");
    setActiveTab("roadmap");
  };

  return (
    <div className="space-y-6 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("exams_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("exams_banner_desc")}
          </p>
        </div>
      </div>

      {/* Exam Selection Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {EXAMS_DATABASE.map((exam) => (
          <button
            key={exam.id}
            onClick={() => setSelectedExamId(exam.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedExamId === exam.id
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-400"
                : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {exam.shortName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Calculator Form */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Eligibility Evaluation Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Calculated against official {selectedExam.shortName} examination gazette
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded">
                {selectedExam.conductingBody}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Your Age (Years)</label>
                  <input
                    type="number"
                    min="16"
                    max="60"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Social Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="General">General / EWS</option>
                    <option value="OBC">OBC (Non-Creamy Layer)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Current Academic Qualification</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="B.Tech / B.E. (Final Year / Graduated)">B.Tech / B.E. (Final Year or Graduated)</option>
                  <option value="Degree in Science / Arts / Commerce">Any Recognized Bachelor Degree (Final Year / Graduated)</option>
                  <option value="Diploma in Engineering">Diploma in Engineering (Polytechnic)</option>
                  <option value="12th Standard Passed">12th Standard Passed (HSC / Intermediate)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Graduation Percentage / CGPA</label>
                  <input
                    type="number"
                    min="35"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Previous Attempts Made</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={attemptsMade}
                    onChange={(e) => setAttemptsMade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Verdict Alert */}
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isEligible
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                {isEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <h4 className="text-sm font-extrabold text-white">
                  {isEligible ? "Verified Eligible to Register & Appear" : "Ineligible Under Current Criteria"}
                </h4>
              </div>

              {isEligible ? (
                <p className="text-xs text-emerald-200 leading-relaxed">
                  You meet all age limits, academic qualifications, and attempt restrictions for{" "}
                  <strong>{selectedExam.name}</strong> under the {category} reservation category.
                </p>
              ) : (
                <ul className="text-xs list-disc list-inside space-y-1 text-rose-200">
                  {reasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleSelectAsGoal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>Adopt {selectedExam.shortName} as Primary Target Goal</span>
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </button>
          </div>
        </div>

        {/* Right Column: Official Exam Dossier & Structure */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Official Dossier
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedExam.name} ({selectedExam.shortName})
                </h2>
              </div>

              <a
                href={selectedExam.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold border border-white/15 transition-all"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedExam.description}
            </p>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10">
                <span className="text-[10px] font-bold uppercase text-slate-400">Conducting Body</span>
                <p className="font-bold text-white mt-0.5">{selectedExam.conductingBody}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10">
                <span className="text-[10px] font-bold uppercase text-slate-400">Frequency</span>
                <p className="font-bold text-white mt-0.5">{selectedExam.frequency}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10">
                <span className="text-[10px] font-bold uppercase text-slate-400">Application Cycle</span>
                <p className="font-bold text-amber-300 mt-0.5">{selectedExam.typicalMonth}</p>
              </div>
            </div>

            {/* Exam Stages / Pattern */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Examination Architecture & Stages</span>
              </h4>

              <div className="space-y-2">
                {selectedExam.stages.map((stg, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-start space-x-3 text-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {sIdx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-white">{stg.name}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{stg.pattern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative Marking Rule */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-start space-x-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-amber-200">
                <strong className="text-white font-bold">Negative Marking Rule: </strong>
                {selectedExam.negativeMarking
                  ? "Penalty of 1/3rd (0.66 marks) applies for each incorrect response. Skipping yields 0 marks."
                  : "No negative marking applicable in this examination."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExamEligibilityView };
