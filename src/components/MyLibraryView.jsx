import { useState } from "react";
import { useApp } from "../context/AppContext";
import { FREE_RESOURCES_DATABASE, PYQ_BANK } from "../data/mockData";
import {
  BookmarkCheck,
  BookOpen,
  HelpCircle,
  FileText,
  Trash2,
  Plus,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

const MyLibraryView = () => {
  const {
    profile,
    toggleBookmarkResource,
    toggleBookmarkQuestion,
    customSavedResources,
    notes,
    addNote,
    deleteNote,
    setActiveTab,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState("resources");
  const [newNoteTopic, setNewNoteTopic] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  const allKnownResources = [...FREE_RESOURCES_DATABASE, ...(customSavedResources || [])];
  const uniqueResourcesMap = new Map();
  allKnownResources.forEach((r) => uniqueResourcesMap.set(r.id, r));

  const bookmarkedResources = Array.from(uniqueResourcesMap.values()).filter(
    (r) => profile.bookmarkedResourceIds.includes(r.id)
  );

  const bookmarkedQuestions = PYQ_BANK.filter(
    (q) => profile.bookmarkedQuestionIds.includes(q.id)
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTopic.trim() || !newNoteContent.trim()) return;
    addNote(newNoteTopic, newNoteContent);
    setNewNoteTopic("");
    setNewNoteContent("");
  };

  const handleCopyNote = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  return (
    <div className="space-y-4 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("library_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("library_banner_desc")}
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950/60 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-2xs shrink-0">
          <button
            onClick={() => setActiveSubTab("resources")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "resources"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Saved Resources ({bookmarkedResources.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("questions")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "questions"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PYQs ({bookmarkedQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("notes")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "notes"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* Content Panes */}
      {activeSubTab === "resources" && (
        <div>
          {bookmarkedResources.length === 0 ? (
            <div className="glass-card rounded-2xl border border-white/10 p-8 text-center text-slate-400 space-y-3 bg-slate-900/60 backdrop-blur-xl">
              <p className="text-sm">You haven't bookmarked any free learning resources yet.</p>
              <button
                onClick={() => setActiveTab("resources")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                Browse Free Resources Hub →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedResources.map((res) => (
                <div
                  key={res.id}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400/40 bg-slate-900/60 backdrop-blur-xl border border-white/10 transition-all shadow-lg"
                >
                  <div>
                    {res.thumbnailUrl && (
                      <div className="relative mb-3 rounded-xl overflow-hidden aspect-video bg-slate-950 border border-white/10">
                        <img
                          src={res.thumbnailUrl}
                          alt={res.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center space-x-1 border border-white/15">
                            <span>YouTube Video</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                        {res.stepCategory} • {res.platform}
                      </span>
                      <button
                        onClick={() => toggleBookmarkResource(res.id)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{res.title}</h3>
                    <p className="text-xs text-amber-300 font-semibold mb-2">
                      Source / Educator: {res.instructorOrEntity}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">{res.description}</p>
                  </div>

                  <a
                    href={res.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
                  >
                    <span>{res.platform?.toLowerCase().includes("youtube") ? "Watch on YouTube" : "Open Resource"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "questions" && (
        <div className="space-y-4">
          {bookmarkedQuestions.length === 0 ? (
            <div className="glass-card rounded-2xl border border-white/10 p-8 text-center text-slate-400 space-y-3 bg-slate-900/60 backdrop-blur-xl">
              <p className="text-sm">No PYQs bookmarked yet.</p>
              <button
                onClick={() => setActiveTab("practice")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                Go to Adaptive Practice & PYQs →
              </button>
            </div>
          ) : (
            bookmarkedQuestions.map((q) => (
              <div
                key={q.id}
                className="glass-card rounded-2xl border border-white/10 p-5 shadow-xl space-y-3 bg-slate-900/60 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {q.exam} {q.year} • {q.subject}
                  </span>
                  <button
                    onClick={() => toggleBookmarkQuestion(q.id)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Remove Bookmark
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed font-sans">
                  {q.question}
                </p>

                <div className="p-3 bg-slate-950/70 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                  <p className="font-bold text-emerald-400">Correct Solution:</p>
                  <p>{q.explanation}</p>
                  <p className="font-semibold text-amber-300 pt-1">
                    Key Principle: {q.keyConcept}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-7 space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="glass-card rounded-2xl border border-white/10 p-5 shadow-xl space-y-2 relative group bg-slate-900/60 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{note.topic}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">{note.createdAt}</span>
                    <button
                      onClick={() => handleCopyNote(note.id, note.content)}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedNoteId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono bg-slate-950/70 p-3 rounded-xl border border-white/10">
                  {note.content}
                </p>
              </div>
            ))}
          </div>

          {/* Add Note Form */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl border border-white/10 p-5 shadow-xl space-y-4 sticky top-32 bg-slate-900/80 backdrop-blur-xl text-white">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Quick Revision Note / Formula</span>
              </h3>

              <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Concept / Formula Name</label>
                  <input
                    type="text"
                    required
                    value={newNoteTopic}
                    onChange={(e) => setNewNoteTopic(e.target.value)}
                    placeholder="e.g. Master Theorem Case 2 Formula"
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Note Content & Derivations</label>
                  <textarea
                    required
                    rows={4}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write key equations, common traps, or exam shortcuts..."
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  Save Note to Vault
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MyLibraryView };
