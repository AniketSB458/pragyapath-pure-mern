import { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { PYQ_BANK } from "../data/mockData";
import {
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Languages,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Zap,
  Volume2,
  Loader2,
  Lightbulb
} from "lucide-react";

const AdaptivePracticeView = () => {
  const { profile, updateProfile, addWeakTopic, resolveWeakTopic, toggleBookmarkQuestion, showToast, t } = useApp();

  const [activeSubject, setActiveSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isMultilingualModalOpen, setIsMultilingualModalOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(profile.language || "en");
  const [translatedExplanation, setTranslatedExplanation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Dynamic AI Question Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const combinedBank = useMemo(() => {
    return [...generatedQuestions, ...PYQ_BANK];
  }, [generatedQuestions]);

  const subjects = [
    "All",
    "Operating Systems",
    "Computer Architecture",
    "Computer Networks",
    "Database Management Systems",
    "Algorithms & Data Structures",
    "General Studies & Polity"
  ];

  const filteredQuestions = useMemo(() => {
    return combinedBank.filter((q) => {
      const matchSub = activeSubject === "All" || q.subject.toLowerCase().includes(activeSubject.toLowerCase());
      const matchDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      return matchSub && matchDiff;
    });
  }, [combinedBank, activeSubject, selectedDifficulty]);

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0];
  const isBookmarked = currentQ ? profile.bookmarkedQuestionIds.includes(currentQ.id) : false;

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswerIndex;
    const newQuestionsSolved = profile.questionsSolved + 1;
    const newCorrect = profile.correctAnswers + (isCorrect ? 1 : 0);

    updateProfile({
      questionsSolved: newQuestionsSolved,
      correctAnswers: newCorrect
    });

    if (isCorrect) {
      resolveWeakTopic(currentQ.topic);
      showToast("Correct! +2.0 marks added to your diagnostic tally", "success");
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } else {
      addWeakTopic(currentQ.topic);
      showToast(`Incorrect! Marked "${currentQ.topic}" as an active weak topic for revision`, "error");
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTranslatedExplanation(null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTranslatedExplanation(null);
    }
  };

  const handleResetFilters = () => {
    setActiveSubject("All");
    setSelectedDifficulty("All");
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/practice/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic,
          exam: profile.targetGoal || "GATE CS",
          difficulty: selectedDifficulty === "All" ? "Hard" : selectedDifficulty,
          count: 3
        })
      });

      const data = await response.json();
      if (data && data.questions && data.questions.length > 0) {
        setGeneratedQuestions((prev) => [...data.questions, ...prev]);
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        showToast(`Synthesized ${data.questions.length} authentic exam questions for ${customTopic}!`, "success");
        setCustomTopic("");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not generate questions. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchMultilingualExplanation = async (targetLang) => {
    setActiveLanguage(targetLang);
    if (targetLang === "en") {
      setTranslatedExplanation(null);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch("/api/explain/concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: currentQ.keyConcept,
          context: currentQ.explanation,
          language: targetLang
        })
      });
      const data = await res.json();
      if (data && data.explanation) {
        setTranslatedExplanation(data.explanation);
      }
    } catch (e) {
      console.error(e);
      showToast("Language model unavailable. Showing standard derivation.", "info");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakText = (text) => {
    if (!window.speechSynthesis) {
      showToast("Audio synthesis not supported by this browser.", "info");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeLanguage === "hi" ? "hi-IN" : activeLanguage === "mr" ? "mr-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
    showToast("Reading solution aloud...", "info");
  };

  return (
    <div className="space-y-6 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("practice_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("practice_banner_desc")}
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 font-bold">
            Solved: {profile.questionsSolved}
          </div>
          <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            Accuracy: {profile.questionsSolved > 0 ? Math.round((profile.correctAnswers / profile.questionsSolved) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* AI Dynamic Question Generator Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              AI Adaptive Drill Generator
            </h3>
            <p className="text-[11px] text-slate-400">
              Need targeted questions on an elusive weak area? Generate high-yield PYQs instantly.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateQuestions} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="e.g. Cache Mapping, Virtual Memory Paging, or Indian Polity Writs"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={isGenerating || !customTopic.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Formulating PYQs...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Generate Adaptive Drill</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter Selector Bars */}
      <div className="space-y-3">
        {/* Subject Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setActiveSubject(sub);
                setCurrentIdx(0);
                setSelectedOption(null);
                setIsAnswerSubmitted(false);
              }}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeSubject === sub
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-2xs"
                  : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Difficulty:</span>
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setCurrentIdx(0);
                setSelectedOption(null);
                setIsAnswerSubmitted(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xs"
                  : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Question Card */}
      {currentQ ? (
        <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl space-y-5">
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30">
                {currentQ.exam} {currentQ.year}
              </span>
              <span className="text-xs text-slate-400">
                {currentQ.subject} • {currentQ.topic}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  currentQ.difficulty === "Hard"
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    : currentQ.difficulty === "Medium"
                    ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {currentQ.difficulty}
              </span>

              <button
                onClick={() => toggleBookmarkQuestion(currentQ.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer"
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {currentIdx + 1} of {filteredQuestions.length}</span>
              <span className="text-amber-400 font-semibold">+2.0 Marks • Negative: -0.66</span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed font-sans">
              {currentQ.question}
            </p>

            {/* Options List */}
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === currentQ.correctAnswerIndex;

                let optionStyle = "bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-amber-400/30 text-slate-200";

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-xs";
                  } else if (isSelected) {
                    optionStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-bold";
                  } else {
                    optionStyle = "bg-slate-900/40 border-white/5 text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-amber-500/20 border-amber-400 text-white font-bold ring-1 ring-amber-400/50 shadow-xs";
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-start space-x-3 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? "bg-amber-400 text-slate-950 font-black" : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {["A", "B", "C", "D"][oIdx]}
                    </span>
                    <span className="flex-1 mt-0.5 leading-relaxed">{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button
                disabled={currentIdx === 0}
                onClick={handlePrevQuestion}
                className="px-3 py-1.5 rounded-xl border border-white/15 text-slate-300 hover:bg-white/10 text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                disabled={currentIdx >= filteredQuestions.length - 1}
                onClick={handleNextQuestion}
                className="px-3 py-1.5 rounded-xl border border-white/15 text-slate-300 hover:bg-white/10 text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleVerifyAnswer}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
                >
                  Verify & Derive Solution
                </button>
              ) : (
                <button
                  onClick={() => setIsMultilingualModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  <span>Multilingual Explanation (हिंदी / मराठी)</span>
                </button>
              )}
            </div>
          </div>

          {/* Verified Solution Card */}
          {isAnswerSubmitted && (
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct Answer: Option {["A", "B", "C", "D"][currentQ.correctAnswerIndex]}</span>
                </div>

                <button
                  onClick={() => handleSpeakText(currentQ.explanation)}
                  className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-amber-400 transition-colors"
                  title="Speak Solution"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center space-x-2 text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-semibold">Key Principle: {currentQ.keyConcept}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 p-8 text-center space-y-3 bg-slate-900/60">
          <p className="text-sm text-slate-400">No questions match the selected subject and difficulty filters.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Multilingual Explanation Modal */}
      {isMultilingualModalOpen && currentQ && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-xl w-full p-6 border border-white/15 bg-slate-900/95 space-y-4 text-white animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Languages className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Multilingual Concept Derivation</h3>
              </div>
              <button
                onClick={() => setIsMultilingualModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Language Switcher Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchMultilingualExplanation("en")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  activeLanguage === "en"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                English
              </button>
              <button
                onClick={() => fetchMultilingualExplanation("hi")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  activeLanguage === "hi"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                onClick={() => fetchMultilingualExplanation("mr")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  activeLanguage === "mr"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                मराठी (Marathi)
              </button>
            </div>

            {/* Translation Output */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 min-h-[140px] text-xs leading-relaxed space-y-2">
              {isTranslating ? (
                <div className="flex items-center justify-center space-x-2 py-8 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Translating exam derivation with grammatical precision...</span>
                </div>
              ) : (
                <>
                  <div className="font-bold text-amber-400">{currentQ.keyConcept}</div>
                  <p className="text-slate-200">
                    {translatedExplanation || currentQ.explanation}
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsMultilingualModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdaptivePracticeView };
