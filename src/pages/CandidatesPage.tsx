import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import FitTag, { getFitLevel } from "../components/FitTag";
import CandidateCard from "../components/CandidateCard";
import { useCandidates } from "../context/CandidateContext";
import { mockJobs } from "../mock/data";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Distribute 20 candidates across 3 jobs deterministically by ID
function getJobId(candidateId: string): string {
  const n = parseInt(candidateId);
  if (n <= 7) return "1";
  if (n <= 14) return "2";
  return "3";
}

function getLastUpdated(candidateId: string): string {
  const daysAgo = (parseInt(candidateId) * 3) % 28;
  const d = new Date("2026-04-07");
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const JOB_MAP = Object.fromEntries(mockJobs.map((j) => [j.id, j.title]));

const STAGE_CHIP: Record<string, string> = {
  Shortlisted:  "bg-gray-100 text-gray-600",
  Interviewing: "bg-blue-50 text-blue-600",
  Offer:        "bg-purple-50 text-purple-600",
  Hired:        "bg-green-50 text-green-700",
  Rejected:     "bg-red-50 text-red-500",
};

type SortKey = "name" | "fit";
type SortDir = "asc" | "desc";

// ── Component ─────────────────────────────────────────────────────────────────

export default function CandidatesPage() {
  const { candidates, stages } = useCandidates();

  const [search, setSearch]       = useState("");
  const [fitFilter, setFitFilter] = useState<"all" | "strong" | "possible" | "weak">("all");
  const [sortKey, setSortKey]     = useState<SortKey>("fit");
  const [sortDir, setSortDir]     = useState<SortDir>("desc");
  const [selected, setSelected]   = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir(key === "fit" ? "desc" : "asc"); }
  };

  const displayed = useMemo(() => {
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

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      if (sortKey === "fit")  cmp = a.fitScore - b.fitScore;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [candidates, search, fitFilter, sortKey, sortDir]);

  const SortIndicator = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 shrink-0">
          <path d="M2 4L6 2L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          <path d="M2 8L6 10L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        </svg>
      );
    }
    if (sortDir === "asc") {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 shrink-0">
          <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 shrink-0">
        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-8 py-6 sm:py-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Candidates</h1>
          <p className="mt-0.5 text-sm text-gray-400">{candidates.length} total across all jobs</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full sm:w-64 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* ── Filter pills ── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(["all", "strong", "possible", "weak"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFitFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              fitFilter === f
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? `All (${candidates.length})` : null}
            {f === "strong"   ? `Strong fit (${candidates.filter(c => getFitLevel(c.fitScore) === "strong").length})`   : null}
            {f === "possible" ? `Possible fit (${candidates.filter(c => getFitLevel(c.fitScore) === "possible").length})` : null}
            {f === "weak"     ? `Weak fit (${candidates.filter(c => getFitLevel(c.fitScore) === "weak").length})`     : null}
          </button>
        ))}
        {displayed.length !== candidates.length && (
          <span className="text-xs text-gray-400 ml-1">Showing {displayed.length}</span>
        )}
      </div>

      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden space-y-3">
        {displayed.map((c) => {
          const jobId = getJobId(c.id);
          const jobRequiredSkills = mockJobs.find((j) => j.id === jobId)?.requiredSkills ?? [];
          return (
            <CandidateCard
              key={c.id}
              candidate={c}
              stage={stages[c.id]}
              jobId={jobId}
              requiredSkills={jobRequiredSkills}
            />
          );
        })}
        {displayed.length === 0 && (
          <div className="py-16 text-center bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-400">No candidates match your filters.</p>
            <button
              onClick={() => { setSearch(""); setFitFilter("all"); }}
              className="mt-2 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop table (≥ md) ── */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                <button
                  onClick={() => handleSort("name")}
                  className="hover:text-gray-600 transition-colors flex items-center"
                >
                  Name <SortIndicator k="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide hidden lg:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Applied To</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                <button
                  onClick={() => handleSort("fit")}
                  className="hover:text-gray-600 transition-colors flex items-center"
                >
                  Fit <SortIndicator k="fit" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Stage</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide hidden lg:table-cell">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayed.map((c) => {
              const jobId = getJobId(c.id);
              const jobTitle = JOB_MAP[jobId] ?? "Unknown";
              const stage = stages[c.id];
              const isSelected = selected === c.id;

              return (
                <tr
                  key={c.id}
                  onClick={() => setSelected(isSelected ? null : c.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-gray-50" : "hover:bg-gray-50/60"
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-gray-900">{c.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{c.email}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-600 text-xs">{jobTitle}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <FitTag score={c.fitScore} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_CHIP[stage] ?? "bg-gray-100 text-gray-500"}`}>
                      {stage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400 hidden lg:table-cell">{getLastUpdated(c.id)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={`/jobs/${jobId}/candidates/${c.id}/resume`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        View
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {displayed.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400">No candidates match your filters.</p>
            <button
              onClick={() => { setSearch(""); setFitFilter("all"); }}
              className="mt-2 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
