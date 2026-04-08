import { useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { getFitLevel } from "../components/FitTag";
import JobTabs from "../components/JobTabs";
import CandidateCard from "../components/CandidateCard";
import { useJobs } from "../context/JobsContext";
import { useCandidates } from "../context/CandidateContext";
import { type Stage } from "../mock/data";

// ── Stage config ────────────────────────────────────────────────────────────

const STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

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

        {/* ── AI Summary Banner ── */}
        {candidates.length > 0 && (() => {
          const strongCount   = candidates.filter((c) => getFitLevel(c.fitScore) === "strong").length;
          const possibleCount = candidates.filter((c) => getFitLevel(c.fitScore) === "possible").length;
          const weakCount     = candidates.filter((c) => getFitLevel(c.fitScore) === "weak").length;
          return (
            <div
              className="mb-5 border rounded-lg px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ background: "var(--ai-accent-light)", borderColor: "var(--ai-accent-border)" }}
            >
              <div className="flex items-center gap-2 shrink-0">
                <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z" fill="#6366f1" />
                </svg>
                <span className="text-sm font-medium" style={{ color: "var(--ai-accent)" }}>
                  Claude analyzed {candidates.length} candidates for this role
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {strongCount} strong matches
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {possibleCount} need review
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">
                  {weakCount} don't qualify
                </span>
              </div>
              <span className="text-[11px] text-gray-400 sm:ml-auto shrink-0">Last scored 2 hours ago</span>
            </div>
          );
        })()}

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
              {displayed.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  stage={stages[candidate.id]}
                  jobId={id!}
                  requiredSkills={job?.requiredSkills ?? []}
                  rank={index + 1}
                  isReviewed={statuses[candidate.id] === "REVIEWED"}
                  onToggleReviewed={() => toggleReviewed(candidate.id)}
                  onMoveStage={(s) => moveStage(candidate.id, s)}
                  note={notes[candidate.id]}
                  notesDraft={notesDraft[candidate.id] ?? ""}
                  isNotesOpen={!!notesOpen[candidate.id]}
                  onOpenNotes={() => openNotes(candidate.id)}
                  onSaveNote={() => saveNote(candidate.id)}
                  onCancelNotes={() => setNotesOpen((prev) => ({ ...prev, [candidate.id]: false }))}
                  onChangeDraft={(text) => setNotesDraft((prev) => ({ ...prev, [candidate.id]: text }))}
                />
              ))}
            </div>
          </>
        )}
      </main>
  );
}
