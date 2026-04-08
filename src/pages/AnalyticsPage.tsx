import { useMemo } from "react";
import { useCandidates } from "../context/CandidateContext";
import { useJobs } from "../context/JobsContext";
import { getFitLevel } from "../components/FitTag";
import { type Stage } from "../mock/data";

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

const FUNNEL_COLORS: Record<Stage, string> = {
  Shortlisted:  "bg-gray-400",
  Interviewing: "bg-blue-500",
  Offer:        "bg-purple-500",
  Hired:        "bg-green-500",
  Rejected:     "bg-red-400",
};

const FUNNEL_TEXT: Record<Stage, string> = {
  Shortlisted:  "text-gray-600",
  Interviewing: "text-blue-600",
  Offer:        "text-purple-600",
  Hired:        "text-green-600",
  Rejected:     "text-red-500",
};

function getJobId(candidateId: string): string {
  const n = parseInt(candidateId);
  if (n <= 7) return "1";
  if (n <= 14) return "2";
  return "3";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
      <p className="text-[28px] font-medium text-gray-900 leading-none tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-gray-400">{label}</p>
      {sub && <p className="mt-1 text-xs text-gray-300">{sub}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { candidates, stages } = useCandidates();
  const { jobs } = useJobs();

  const stageCounts = useMemo(
    () => Object.fromEntries(STAGES.map((s) => [s, candidates.filter((c) => stages[c.id] === s).length])) as Record<Stage, number>,
    [candidates, stages]
  );

  const avgFitScore = useMemo(() => {
    if (!candidates.length) return 0;
    return Math.round(candidates.reduce((s, c) => s + c.fitScore, 0) / candidates.length);
  }, [candidates]);

  const strongFitPct = useMemo(() => {
    const strong = candidates.filter((c) => getFitLevel(c.fitScore) === "strong").length;
    return Math.round((strong / candidates.length) * 100);
  }, [candidates]);

  // Per-job avg fit score
  const jobStats = useMemo(
    () =>
      jobs.map((job) => {
        const jobCandidates = candidates.filter((c) => getJobId(c.id) === job.id);
        const avg = jobCandidates.length
          ? Math.round(jobCandidates.reduce((s, c) => s + c.fitScore, 0) / jobCandidates.length)
          : 0;
        return { job, avg, count: jobCandidates.length };
      }),
    [candidates, jobs]
  );

  // Top 5 candidates by fit score
  const topCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.fitScore - a.fitScore).slice(0, 5),
    [candidates]
  );

  // Funnel conversion (non-rejected, ordered)
  const funnelStages: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired"];
  const maxFunnelCount = Math.max(...funnelStages.map((s) => stageCounts[s]), 1);

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-8 py-6 sm:py-10">

      {/* ── Header ── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-0.5 text-sm text-gray-400">Hiring performance across all active jobs</p>
      </div>

      {/* ── Top stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <StatCard label="Total Candidates"     value={candidates.length} />
        <StatCard label="Avg Fit Score"        value={`${avgFitScore}%`} />
        <StatCard label="Strong Fit Rate"      value={`${strongFitPct}%`} sub="candidates scoring 70+" />
        <StatCard label="Hired This Month"     value={stageCounts["Hired"]} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">

        {/* ── Hiring funnel ── */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Hiring funnel</h2>
          <p className="text-xs text-gray-400 mb-5">Candidate progression through pipeline stages</p>
          <div className="space-y-4">
            {funnelStages.map((stage, i) => {
              const count = stageCounts[stage];
              const prev = i > 0 ? stageCounts[funnelStages[i - 1]] : count;
              const convRate = prev > 0 ? Math.round((count / prev) * 100) : 0;
              const barPct = (count / maxFunnelCount) * 100;

              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-medium ${FUNNEL_TEXT[stage]}`}>{stage}</span>
                    <div className="flex items-center gap-2">
                      {i > 0 && (
                        <span className="text-[11px] text-gray-300">{convRate}% from prev</span>
                      )}
                      <span className={`text-xs font-mono font-medium ${FUNNEL_TEXT[stage]}`}>{count}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${FUNNEL_COLORS[stage]}`}
                      style={{ width: count > 0 ? `${Math.max(barPct, 6)}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Rejected separately */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Rejected</span>
              <span className="text-xs font-mono text-red-400">{stageCounts["Rejected"]}</span>
            </div>
          </div>
        </div>

        {/* ── Fit score by job ── */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Fit scores by job</h2>
          <p className="text-xs text-gray-400 mb-5">Average AI fit score per open role</p>
          <div className="space-y-5">
            {jobStats.map(({ job, avg, count }) => (
              <div key={job.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[180px]">{job.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-400">{count} candidates</span>
                    <span className="text-xs font-mono font-medium text-gray-700">{avg}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-700 transition-all duration-500"
                    style={{ width: `${avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top candidates ── */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Top candidates by fit score</h2>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="text-left px-6 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Rank</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Fit Score</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topCandidates.map((c, i) => (
              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-3.5 text-xs font-mono text-gray-400">#{i + 1}</td>
                <td className="px-4 py-3.5 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3.5 text-gray-500 text-xs">{c.email}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${c.fitScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-700">{c.fitScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-gray-500">{stages[c.id]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </main>
  );
}
