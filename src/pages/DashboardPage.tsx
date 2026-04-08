import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import { useCandidates } from "../context/CandidateContext";
import Badge from "../components/Badge";
import { type Stage } from "../mock/data";

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

const STAGE_BAR: Record<Stage, string> = {
  Shortlisted:  "bg-gray-400",
  Interviewing: "bg-blue-500",
  Offer:        "bg-purple-500",
  Hired:        "bg-green-500",
  Rejected:     "bg-red-400",
};

const STAGE_COUNT_TEXT: Record<Stage, string> = {
  Shortlisted:  "text-gray-500",
  Interviewing: "text-blue-600",
  Offer:        "text-purple-600",
  Hired:        "text-green-600",
  Rejected:     "text-red-500",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
      <p className="text-[28px] font-medium text-gray-900 leading-none tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-gray-400">{label}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { jobs } = useJobs();
  const { candidates, stages } = useCandidates();

  // Stat counts
  const activeJobs = jobs.filter((j) => j.status === "ACTIVE").length;
  const totalCandidates = candidates.length;
  const interviewingCount = candidates.filter((c) => stages[c.id] === "Interviewing").length;
  const hiredCount = candidates.filter((c) => stages[c.id] === "Hired").length;

  // Recent jobs — 3 most recent by createdAt
  const recentJobs = useMemo(
    () =>
      [...jobs]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3),
    [jobs]
  );

  // Pipeline stage counts
  const stageCounts = Object.fromEntries(
    STAGES.map((s) => [s, candidates.filter((c) => stages[c.id] === s).length])
  ) as Record<Stage, number>;
  const maxCount = Math.max(...Object.values(stageCounts), 1);

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-8 py-6 sm:py-10">

      {/* ── Greeting ── */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {getGreeting()}, Krishnakumar
        </h1>
        <p className="mt-1 text-sm text-gray-400">{getTodayLabel()}</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <StatCard label="Active Jobs"            value={activeJobs} />
        <StatCard label="Total Candidates"       value={totalCandidates} />
        <StatCard label="Interviews This Week"   value={interviewingCount} />
        <StatCard label="Hires This Month"       value={hiredCount} />
      </div>

      {/* ── Recent jobs ── */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Recent jobs</h2>
          <Link
            to="/jobs"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="flex items-center gap-1">
              View all
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-start sm:items-center justify-between px-4 sm:px-5 py-3.5 gap-3 sm:gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">{job.title}</span>
                <Badge status={job.status} />
                <span className="text-xs text-gray-400 sm:hidden">
                  {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <span className="hidden sm:block text-xs text-gray-400">
                  {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                </span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    View shortlist
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pipeline snapshot ── */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Pipeline snapshot</h2>
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 space-y-3.5">
          {STAGES.map((stage) => {
            const count = stageCounts[stage];
            const pct = (count / maxCount) * 100;
            return (
              <div key={stage} className="flex items-center gap-4">
                <span className="text-xs text-gray-500 w-24 shrink-0">{stage}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${STAGE_BAR[stage]}`}
                    style={{ width: count > 0 ? `${Math.max(pct, 6)}%` : "0%" }}
                  />
                </div>
                <span className={`text-xs font-mono w-5 text-right tabular-nums ${STAGE_COUNT_TEXT[stage]}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick actions</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Link
            to="/jobs/new"
            className="text-sm font-medium bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors text-center"
          >
            Post a new job
          </Link>
          <Link
            to="/jobs/1/pipeline"
            className="text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors text-center"
          >
            View full pipeline
          </Link>
        </div>
      </div>

    </main>
  );
}
