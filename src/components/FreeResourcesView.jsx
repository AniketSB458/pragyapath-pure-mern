import { useState } from "react";
import { useApp } from "../context/AppContext";
import { FREE_RESOURCES_DATABASE } from "../data/mockData";
import {
  BookOpen,
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Video,
  FileText,
  Sparkles,
  Layers,
  Globe,
  Loader2,
  X,
  Play
} from "lucide-react";

const FreeResourcesView = () => {
  const { profile, toggleBookmarkResource, customSavedResources, showToast, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [liveQuery, setLiveQuery] = useState("");
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState(null);

  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const allResources = [...FREE_RESOURCES_DATABASE, ...(customSavedResources || [])];
  const uniqueResources = Array.from(new Map(allResources.map((item) => [item.id, item])).values());

  const categories = [
    "All",
    "Operating Systems",
    "Computer Architecture",
    "Computer Networks",
    "Database Systems",
    "General Studies",
    "Full Mock Tests"
  ];

  const formats = ["All", "Video Lecture", "PDF Notes", "Interactive Portal", "Course Playlist"];

  const filteredResources = uniqueResources.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.stepCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      item.curatedForExam.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesFormat = selectedFormat === "All" || item.format === selectedFormat;

    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructorOrEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesFormat && matchesSearch;
  });

  const handleLiveSearch = async (e) => {
    e.preventDefault();
    if (!liveQuery.trim()) return;
    setIsSearchingLive(true);
    try {
      const response = await fetch("/api/resources/live-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: liveQuery })
      });
      const data = await response.json();
      if (data && data.results) {
        setLiveSearchResults(data.results);
        showToast(`Discovered ${data.results.length} verified open resources!`, "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not complete live open search. Please retry.", "error");
    } finally {
      setIsSearchingLive(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  const openResource = (res) => {
    const embedUrl = getYoutubeEmbedUrl(res.linkUrl);
    if (embedUrl) {
      setActiveVideoModal({
        title: res.title,
        instructor: res.instructorOrEntity,
        embedUrl,
        directUrl: res.linkUrl
      });
    } else {
      window.open(res.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Sleek Compact Glass Header */}
      <div className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="tracking-tight">{t("resources_banner_title")}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("resources_banner_desc")}
          </p>
        </div>
      </div>

      {/* Live Open-Access Search Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Globe className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Live Open-Access Educational Search
            </h3>
            <p className="text-[11px] text-slate-400">
              Query open universities, NPTEL archives, MIT OpenCourseWare, and verified YouTube lectures
            </p>
          </div>
        </div>

        <form onSubmit={handleLiveSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={liveQuery}
              onChange={(e) => setLiveQuery(e.target.value)}
              placeholder="e.g. NPTEL Operating Systems Kharagpur or Discrete Mathematics MIT"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingLive || !liveQuery.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isSearchingLive ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Open Web...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Open Search</span>
              </>
            )}
          </button>
        </form>

        {/* Live Search Results */}
        {liveSearchResults && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Found {liveSearchResults.length} live open-access resources</span>
              <button
                onClick={() => setLiveSearchResults(null)}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Close live results
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {liveSearchResults.map((res, rIdx) => (
                <div
                  key={rIdx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-amber-400/20 hover:border-amber-400/40 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-400">{res.platform}</span>
                    <h5 className="font-bold text-white leading-tight">{res.title}</h5>
                    <p className="text-[11px] text-slate-400">{res.instructorOrEntity}</p>
                  </div>
                  <button
                    onClick={() => openResource(res)}
                    className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition-colors shrink-0"
                    title="Open Resource"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Local Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter curated repository..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/15 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Formats Filter */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedFormat === fmt
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-2xs"
                  : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const isBookmarked = profile.bookmarkedResourceIds.includes(res.id);
          const isVideo = res.platform?.toLowerCase().includes("youtube") || res.format === "Video Lecture";

          return (
            <div
              key={res.id}
              className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60 backdrop-blur-xl hover:border-amber-400/40 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Optional Video Thumbnail Preview */}
                {res.thumbnailUrl && (
                  <div
                    onClick={() => openResource(res)}
                    className="relative mb-3.5 rounded-xl overflow-hidden aspect-video bg-slate-950 border border-white/10 group-hover:border-amber-400/30 transition-colors cursor-pointer"
                  >
                    <img
                      src={res.thumbnailUrl}
                      alt={res.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40">
                        <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {res.stepCategory}
                  </span>

                  <button
                    onClick={() => toggleBookmarkResource(res.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer"
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Resource"}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs text-amber-400/90 font-semibold mb-2">
                  {res.instructorOrEntity} • {res.platform}
                </p>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                  {isVideo ? <Video className="w-3 h-3 text-amber-400" /> : <FileText className="w-3 h-3 text-cyan-400" />}
                  <span>{res.format}</span>
                </span>

                <button
                  onClick={() => openResource(res)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>{isVideo ? "Watch In-App" : "Open Resource"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-App YouTube Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="glass-panel rounded-3xl max-w-3xl w-full border border-white/15 bg-slate-900/95 overflow-hidden shadow-2xl space-y-0 text-white animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-950/80">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{activeVideoModal.title}</h4>
                <p className="text-[11px] text-amber-400">{activeVideoModal.instructor}</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={activeVideoModal.embedUrl}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-3.5 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Streamed via YouTube Open-Access Content</span>
              <a
                href={activeVideoModal.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Open in YouTube Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FreeResourcesView };
