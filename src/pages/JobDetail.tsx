import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import FitTag, { getFitLevel } from "../components/FitTag";
import JobTabs from "../components/JobTabs";
import { useJobs } from "../context/JobsContext";
import { useCandidates } from "../context/CandidateContext";
import { type Stage } from "../mock/data";

// ── Stage config ────────────────────────────────────────────────────────────

const STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

const STAGE_PILL: Record<Stage, { active: string; inactive: string }> = {
  Shortlisted:  { active: "bg-gray-200 text-gray-800 border-gray-300",       inactive: "border border-gray-200 text-gray-400 hover:bg-gray-50" },
  Interviewing: { active: "bg-blue-100 text-blue-700 border-blue-200",       inactive: "border border-blue-100 text-blue-400 hover:bg-blue-50" },
  Offer:        { active: "bg-purple-100 text-purple-700 border-purple-200", inactive: "border border-purple-100 text-purple-400 hover:bg-purple-50" },
  Hired:        { active: "bg-green-100 text-green-700 border-green-200",    inactive: "border border-green-100 text-green-400 hover:bg-green-50" },
  Rejected:     { active: "bg-red-50 text-red-600 border-red-200",           inactive: "border border-red-100 text-red-300 hover:bg-red-50" },
};

const STAGE_CHIP: Record<Stage, string> = {
  Shortlisted:  "bg-gray-100 text-gray-600",
  Interviewing: "bg-blue-50 text-blue-600",
  Offer:        "bg-purple-50 text-purple-600",
  Hired:        "bg-green-50 text-green-600",
  Rejected:     "bg-red-50 text-red-500",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const job = jobs.find((j) => j.id === id);
  const { candidates, statuses, stages, notes, moveStage, updateNote, toggleReviewed } = useCandidates();

  // ── Notes draft state (local — not worth putting in context) ─────────────
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [notesOpen, setNotesOpen] = useState<Record<string, boolean>>({});

  // ── Filter / sort state ─────────────────────────────────────────────────
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [search, setSearch] = useState("");
  const [fitFilter, setFitFilter] = useState("all");
  const [sortBy, setSortBy] = useState("fit");

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openNotes = (candidateId: string) => {
    setNotesDraft((prev) => ({ ...prev, [candidateId]: prev[candidateId] ?? notes[candidateId] ?? "" }));
    setNotesOpen((prev) => ({ ...prev, [candidateId]: true }));
  };

  const saveNote = (candidateId: string) => {
    updateNote(candidateId, notesDraft[candidateId] ?? "");
    setNotesOpen((prev) => ({ ...prev, [candidateId]: false }));
  };

  // ── Pipeline summary counts (always over full list) ───────────────────
  const stageCounts = Object.fromEntries(
    STAGES.map((s) => [s, candidates.filter((c) => stages[c.id] === s).length])
  ) as Record<Stage, number>;

  // ── Derived candidate list (compose all filters + sort) ───────────────
  const displayed = (() => {
    let list = [...candidates];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }

    if (fitFilter !== "all") {
      list = list.filter((c) => getFitLevel(c.fitScore) === fitFilter);
    }

    if (stageFilter !== "All") {
      list = list.filter((c) => stages[c.id] === stageFilter);
    }

    if (sortBy === "fit") list.sort((a, b) => b.fitScore - a.fitScore);
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "recent") list.sort((a, b) => Number(b.id) - Number(a.id));

    return list;
  })();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumb
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: job?.title ?? "Job" },
          ]}
        />

        {/* Heading row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{job?.title ?? "Job not found"}</h1>
            <p className="mt-1 text-sm text-gray-500">
              AI-ranked candidates · {candidates.length} total
            </p>
          </div>
          <button
            disabled
            className="shrink-0 flex items-center gap-2 text-sm text-gray-400 border border-gray-200 bg-gray-50 px-4 py-2 rounded-md cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scoring complete
          </button>
        </div>

        <JobTabs jobId={id!} active="shortlist" />

        {/* ── Pipeline summary bar ── */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <button
            onClick={() => setStageFilter("All")}
            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
              stageFilter === "All"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All ({candidates.length})
          </button>
          {STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stageFilter === stage ? "All" : stage)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                stageFilter === stage
                  ? "bg-gray-900 text-white"
                  : `${STAGE_CHIP[stage]} hover:opacity-80`
              }`}
            >
              {stage} ({stageCounts[stage]})
            </button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-5">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 min-w-0 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />

          {/* Fit filter */}
          <select
            value={fitFilter}
            onChange={(e) => setFitFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
          >
            <option value="all">All fits</option>
            <option value="strong">Strong fit</option>
            <option value="possible">Possible fit</option>
            <option value="weak">Weak fit</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
          >
            <option value="fit">Best fit first</option>
            <option value="name">Name A–Z</option>
            <option value="recent">Most recent</option>
          </select>
        </div>

        {/* ── Results count / empty state ── */}
        {displayed.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-16 text-center">
            <p className="text-sm text-gray-400">No candidates match your current filters.</p>
            <button
              onClick={() => { setSearch(""); setFitFilter("all"); setStageFilter("All"); }}
              className="mt-2 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              Showing {displayed.length} of {candidates.length} candidates
            </p>

            {/* ── Candidate cards ── */}
            <div className="space-y-3">
              {displayed.map((candidate, index) => {
                const isReviewed = statuses[candidate.id] === "REVIEWED";
                const currentStage = stages[candidate.id];
                const isNotesOpen = notesOpen[candidate.id];
                const savedNote = notes[candidate.id];
                const draft = notesDraft[candidate.id] ?? "";
                const isDirty = draft !== (savedNote ?? "");

                return (
                  <div
                    key={candidate.id}
                    className="border border-gray-200 rounded-lg px-4 sm:px-6 py-4 sm:py-5 bg-white"
                  >
                    {/* Top row: rank · name · fit tag · mark reviewed */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-4">
                        <span className="text-xs font-mono text-gray-400 mt-0.5 w-6 shrink-0">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                            <FitTag score={candidate.fitScore} />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{candidate.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleReviewed(candidate.id)}
                        className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${
                          isReviewed
                            ? "bg-gray-900 text-white border-gray-900"
                            : "text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {isReviewed && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {isReviewed ? "Reviewed" : "Mark Reviewed"}
                      </button>
                    </div>

                    {/* Stage pipeline pills */}
                    <div className="pl-10 flex items-center gap-1 flex-wrap mb-4">
                      {STAGES.map((stage) => {
                        const isActive = currentStage === stage;
                        return (
                          <button
                            key={stage}
                            onClick={() => moveStage(candidate.id, stage)}
                            className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${
                              isActive ? STAGE_PILL[stage].active : STAGE_PILL[stage].inactive
                            }`}
                          >
                            {stage}
                          </button>
                        );
                      })}
                    </div>

                    {/* AI brief */}
                    <div className="pl-10 mb-3">
                      <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-3.5 py-3 leading-relaxed">
                        {candidate.brief}
                      </p>
                    </div>

                    {/* Notes */}
                    <div className="pl-10 mb-3">
                      {!isNotesOpen ? (
                        savedNote ? (
                          <div>
                            <p className="text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-md px-3.5 py-3 leading-relaxed whitespace-pre-wrap">
                              {savedNote}
                            </p>
                            <button
                              onClick={() => openNotes(candidate.id)}
                              className="mt-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              Edit note
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openNotes(candidate.id)}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            + Add note
                          </button>
                        )
                      ) : (
                        <div>
                          <textarea
                            rows={3}
                            value={draft}
                            onChange={(e) =>
                              setNotesDraft((prev) => ({ ...prev, [candidate.id]: e.target.value }))
                            }
                            placeholder="Add a private note about this candidate…"
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                            autoFocus
                          />
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => saveNote(candidate.id)}
                              className="text-xs font-medium bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md transition-colors"
                            >
                              Save note
                            </button>
                            <button
                              onClick={() => setNotesOpen((prev) => ({ ...prev, [candidate.id]: false }))}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                            {isDirty && (
                              <span className="text-xs text-gray-400 italic">Unsaved</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary actions */}
                    <div className="pl-10 flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/jobs/${id}/candidates/${candidate.id}/resume`)}
                        className="text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        View Resume
                      </button>
                      <button
                        onClick={() => navigate(`/jobs/${id}/candidates/${candidate.id}/assessment`)}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        Why this rating?
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
  );
}
