import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { EXAMS_DATABASE, ROADMAPS_DATABASE } from "../data/mockData";
import { evaluateEligibility } from "../utils/eligibilityEngine";
import {
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  BookOpen
} from "lucide-react";

const ExamEligibilityView = () => {
  const { profile, updateProfile, activeExam, setActiveExam, setActiveTab, setActiveRoadmap, showToast, t } = useApp();
  const [selectedExamId, setSelectedExamId] = useState(activeExam?.id || EXAMS_DATABASE[0]?.id || "upsc_cse");
  const [educationLevel, setEducationLevel] = useState(
    profile.educationStage || "graduate_job_seeker"
  );
  const [degreeOrBranch, setDegreeOrBranch] = useState(
    profile.degreeOrStream || "Bachelor Degree (Final Year / Graduate)"
  );
  const [graduationStatus, setGraduationStatus] = useState("completed");
  const [age, setAge] = useState(22);
  const [category, setCategory] = useState("General");
  const [nationality, setNationality] = useState("Indian");
  const [aggregatePercentage, setAggregatePercentage] = useState(72);

  const currentExam = useMemo(() => {
    return EXAMS_DATABASE.find((e) => e.id === selectedExamId) || EXAMS_DATABASE[0];
  }, [selectedExamId]);

  const evaluation = useMemo(() => {
    return evaluateEligibility({
      examId: selectedExamId,
      educationLevel,
      degreeOrBranch,
      graduationStatus,
      age,
      category,
      nationality,
      aggregatePercentage
    });
  }, [
    selectedExamId,
    educationLevel,
    degreeOrBranch,
    graduationStatus,
    age,
    category,
    nationality,
    aggregatePercentage
  ]);

  const handleSelectExamAsGoal = (exam) => {
    setActiveExam(exam);
    updateProfile({
      targetGoal: exam.name,
      targetExamId: exam.id
    });
    const matchingRoadmap =
      ROADMAPS_DATABASE[`roadmap_${exam.id}`] ||
      ROADMAPS_DATABASE[`${exam.id}-roadmap`] ||
      Object.values(ROADMAPS_DATABASE)[0];
    if (matchingRoadmap) {
      setActiveRoadmap(matchingRoadmap);
    }
    showToast(`Target goal updated to: ${exam.name}`, "success");
    setActiveTab("roadmap");
  };

  return (
    <div className="space-y-6 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("exams_banner_title") || "National Examination Eligibility Verifier"}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("exams_banner_desc") || "Official gazette-backed statutory rules, age relaxation thresholds, and reservation audits"}
          </p>
        </div>
      </div>

      {/* Select Exam Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {EXAMS_DATABASE.map((exam) => {
          const isSelected = exam.id === selectedExamId;
          return (
            <button
              key={exam.id}
              onClick={() => {
                setSelectedExamId(exam.id);
                setActiveExam(exam);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-400"
                  : "bg-slate-900/80 text-slate-300 border border-white/10 hover:border-amber-400/30 hover:bg-slate-800 backdrop-blur-md shadow-2xs"
              }`}
            >
              {exam.name}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column: Left = Interactive Eligibility Engine, Right = Exam Official Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Eligibility Checker */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Check Your Eligibility for {currentExam.name}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Instant real-time statutory rule engine calculation
                </p>
              </div>

              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded">
                Verified: {currentExam.verifiedDate}
              </span>
            </div>

            {/* Input Form */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  >
                    <option value="ug_engineering">Undergraduate Engineering (B.Tech/B.E.)</option>
                    <option value="ug_general">Undergraduate General (B.Sc, BCA, B.Com, B.A.)</option>
                    <option value="diploma">Polytechnic Diploma (3-Year)</option>
                    <option value="12th_science">12th Standard Science (PCM/PCB)</option>
                    <option value="graduate_job_seeker">Completed Bachelor Degree (Graduate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Degree / Branch
                  </label>
                  <input
                    type="text"
                    value={degreeOrBranch}
                    onChange={(e) => setDegreeOrBranch(e.target.value)}
                    placeholder="e.g. Computer Science, Mechanical"
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={graduationStatus}
                    onChange={(e) => setGraduationStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  >
                    <option value="pre_final_year">3rd Year (Pre-Final)</option>
                    <option value="final_year">4th Year (Final Year)</option>
                    <option value="completed">Completed / Graduated</option>
                    <option value="pursuing_early">1st / 2nd Year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Current Age: <strong className="text-amber-400">{age} yrs</strong>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Social Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  >
                    <option value="General">General (Unreserved)</option>
                    <option value="OBC-NCL">OBC-NCL</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS</option>
                    <option value="PwD">PwD (Benchmark Disabilities)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Degree Aggregate: <strong className="text-amber-400">{aggregatePercentage}%</strong>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={aggregatePercentage}
                    onChange={(e) => setAggregatePercentage(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Nationality / Citizenship
                  </label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  >
                    <option value="Indian">Citizen of India</option>
                    <option value="Other">Non-Indian / Foreign National</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                evaluation.isEligible === "eligible"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : evaluation.isEligible === "conditionally_eligible"
                  ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                {evaluation.isEligible === "eligible" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : evaluation.isEligible === "conditionally_eligible" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{evaluation.headline}</h3>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{evaluation.summary}</p>
                  <p className="text-xs mt-2 font-semibold text-amber-300">{evaluation.actionAdvice}</p>
                </div>
              </div>

              {/* Systematic Criteria Breakdown */}
              <div className="mt-4 space-y-2.5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Detailed Verification Audit
                </h4>

                {evaluation.checks.map((check, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-xl border border-white/10 bg-slate-950/70 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        {check.passed === true ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        ) : check.passed === false ? (
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                        <p className="font-bold text-white">{check.category}</p>
                      </div>
                      <p className="text-slate-400 text-[11px]">{check.explanation}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        check.passed === true
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : check.passed === false
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      {check.passed === true ? "PASSED" : check.passed === false ? "FAILED" : "CONDITIONAL"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Official Rule Source: <strong className="text-white">{evaluation.officialClause}</strong>
                </span>
                <a
                  href={evaluation.officialSourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comprehensive Official Exam Dossier */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-xl space-y-5 border border-white/10 bg-slate-900/80 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                  {currentExam.conductingBody}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  {currentExam.fullName}
                </h2>
              </div>

              <button
                onClick={() => handleSelectExamAsGoal(currentExam)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 transition-all cursor-pointer self-start sm:self-auto"
              >
                Set as My Goal & Build Roadmap →
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Notification Window
                </span>
                <p className="font-bold text-white mt-0.5">{currentExam.notificationPeriod}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Examination Schedule
                </span>
                <p className="font-bold text-white mt-0.5">{currentExam.examDates}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Age Rules (General)
                </span>
                <p className="font-bold text-amber-300 mt-0.5">{currentExam.ageCriteriaGeneral}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Category Relaxations
                </span>
                <p className="font-bold text-white mt-0.5">
                  OBC: {currentExam.ageRelaxations.obc} • SC/ST: {currentExam.ageRelaxations.scSt}
                </p>
              </div>
            </div>

            {/* Official Qualification Clause */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Official Eligibility Mandate
              </h3>
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/10 leading-relaxed">
                {currentExam.educationalQualification}
              </p>
            </div>

            {/* Exam Pattern & Stages */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Exam Stages & Marking Pattern
              </h3>
              <div className="space-y-2">
                {currentExam.examStages.map((stage, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl border border-white/10 bg-slate-950/60 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-amber-400">{stage.stageName}</p>
                      <span className="font-bold text-slate-200 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                        {stage.marks} Marks • {stage.duration}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{stage.format}</p>
                    <p className="text-amber-300/90 font-medium text-[11px]">
                      <strong>Negative Marking:</strong> {stage.negativeMarking}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Weightage Breakdown */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Historical Subject Weightage Distribution
              </h3>

              <div className="space-y-2.5">
                {currentExam.subjectWeightage.map((sub, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{sub.subject}</span>
                      <span className="font-bold text-amber-400">{sub.weightagePercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, sub.weightagePercentage * 3)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Key Topics: {sub.keyTopics.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExamEligibilityView };
