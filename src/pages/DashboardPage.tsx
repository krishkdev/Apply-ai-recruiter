import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useJobs } from "../context/JobsContext";
import { useCandidates } from "../context/CandidateContext";
import Badge from "../components/Badge";
import SparkIcon from "../components/SparkIcon";
import { getFitLevel } from "../components/FitTag";
import { type Stage } from "../mock/data";

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

const FUNNEL_COLORS: Record<Stage, string> = {
  Shortlisted:  "#9ca3af",
  Interviewing: "#3b82f6",
  Offer:        "#a855f7",
  Hired:        "#22c55e",
  Rejected:     "#f87171",
};

const FUNNEL_LABEL_COLORS: Record<Stage, string> = {
  Shortlisted:  "#6b7280",
  Interviewing: "#2563eb",
  Offer:        "#9333ea",
  Hired:        "#16a34a",
  Rejected:     "#ef4444",
};

const CHART_DATA = [
  { week: "Wk 1", applications: 12 },
  { week: "Wk 2", applications: 19 },
  { week: "Wk 3", applications: 8  },
  { week: "Wk 4", applications: 24 },
  { week: "Wk 5", applications: 31 },
  { week: "Wk 6", applications: 18 },
  { week: "Wk 7", applications: 27 },
  { week: "Wk 8", applications: 47 },
];

const ACTIVITY_ITEMS = [
  { ai: true,  text: "Scored 47 candidates for Senior SWE · 8 strong matches found",   time: "2 hours ago"  },
  { ai: false, text: "Sarah Chen moved to Interviewing",                                time: "5 hours ago"  },
  { ai: true,  text: "New role posted: ML Engineer · AI analysis ready",               time: "Yesterday"    },
  { ai: false, text: "James Wu marked as reviewed",                                     time: "Yesterday"    },
  { ai: true,  text: "Weekly digest generated · 3 roles, 47 candidates",               time: "2 days ago"   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${day}, ${date}`;
}

function arcColor(score: number): string {
  if (score >= 70) return "#6366f1";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-[10px] ${className}`}
      style={{ border: "0.5px solid #e5e5e5" }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold text-gray-800 mb-3">{children}</p>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { jobs } = useJobs();
  const { candidates, stages } = useCandidates();

  // ── Derived stats ──────────────────────────────────────────────────────────
  const activeJobs        = jobs.filter((j) => j.status === "ACTIVE").length;
  const totalCandidates   = candidates.length;
  const interviewingCount = candidates.filter((c) => stages[c.id] === "Interviewing").length;
  const avgFitScore       = totalCandidates > 0
    ? Math.round(candidates.reduce((s, c) => s + c.fitScore, 0) / totalCandidates)
    : 0;

  const stageCounts = Object.fromEntries(
    STAGES.map((s) => [s, candidates.filter((c) => stages[c.id] === s).length])
  ) as Record<Stage, number>;

  const strongCount   = candidates.filter((c) => getFitLevel(c.fitScore) === "strong").length;
  const possibleCount = candidates.filter((c) => getFitLevel(c.fitScore) === "possible").length;
  const weakCount     = candidates.filter((c) => getFitLevel(c.fitScore) === "weak").length;

  const topCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.fitScore - a.fitScore).slice(0, 5),
    [candidates]
  );

  // Job id → title map  (deterministic: IDs 1-7→"1", 8-14→"2", 15-20→"3")
  const jobTitleForCandidate = (candidateId: string) => {
    const n = parseInt(candidateId);
    const jobId = n <= 7 ? "1" : n <= 14 ? "2" : "3";
    return jobs.find((j) => j.id === jobId)?.title ?? "Unknown";
  };

  const recentJobs = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3),
    [jobs]
  );

  const topJobTitle = jobs.find((j) => j.status === "ACTIVE")?.title ?? "";

  return (
    <main
      className="min-h-full"
      style={{ background: "#f8f8f7" }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 space-y-6">

        {/* ── Section 1: Header ── */}
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 leading-tight">
            {getGreeting()}, Krishnakumar
          </h1>
          <p className="mt-1 text-[13px] text-gray-400">
            {getTodayLabel()} · {activeJobs} role{activeJobs !== 1 ? "s" : ""} active · AI scoring up to date
          </p>
        </div>

        {/* ── Section 2: AI Banner ── */}
        <div
          className="rounded-[10px] px-4 sm:px-[18px] py-[14px] flex flex-col sm:flex-row sm:items-center gap-3"
          style={{ background: "var(--ai-accent-light)", border: "1px solid var(--ai-accent-border)" }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <SparkIcon size={14} />
            <span className="text-[13px] font-medium" style={{ color: "#3730a3" }}>
              Claude analyzed {totalCandidates} candidates across {activeJobs} roles
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#dcfce7", color: "#166534" }}>
              {strongCount} strong matches
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#fef9c3", color: "#854d0e" }}>
              {possibleCount} need review
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "#f1f5f9", color: "#475569" }}>
              {weakCount} not qualified
            </span>
          </div>
          <span className="text-[11px] sm:ml-auto shrink-0" style={{ color: "var(--ai-accent)" }}>
            Last scored 2h ago
          </span>
        </div>

        {/* ── Section 3: Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Active Jobs",
              value: activeJobs,
              trend: `${jobs.length} total roles`,
            },
            {
              label: "Total Candidates",
              value: totalCandidates,
              trend: `${strongCount} strong fits`,
            },
            {
              label: "Interviews This Week",
              value: interviewingCount,
              trend: `${stageCounts["Offer"]} in offer stage`,
            },
            {
              label: "Avg AI Match Score",
              value: `${avgFitScore}%`,
              trend: topJobTitle ? `Top role: ${topJobTitle.split(" ").slice(0, 3).join(" ")}` : "Across all roles",
            },
          ].map(({ label, value, trend }) => (
            <Card key={label} className="px-[18px] py-4">
              <p className="text-[12px] text-[#888] mb-1.5">{label}</p>
              <p className="text-[26px] font-semibold text-gray-900 leading-none tabular-nums">{value}</p>
              <p className="mt-2 text-[11px]" style={{ color: "var(--ai-accent)" }}>{trend}</p>
            </Card>
          ))}
        </div>

        {/* ── Section 4: Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">

          {/* LEFT — Top AI matches */}
          <Card className="p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <SparkIcon size={13} />
              <SectionHeading>Top AI matches right now</SectionHeading>
            </div>
            <div className="divide-y" style={{ borderColor: "#f0f0f0" }}>
              {topCandidates.map((c) => {
                const color = arcColor(c.fitScore);
                const level = getFitLevel(c.fitScore);
                const fitLabel = level === "strong" ? "Strong" : level === "possible" ? "Possible" : "Weak";
                const fitClasses = {
                  strong:   { bg: "#dcfce7", text: "#166534" },
                  possible: { bg: "#fef9c3", text: "#854d0e" },
                  weak:     { bg: "#fee2e2", text: "#991b1b" },
                }[level];

                return (
                  <div key={c.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">{c.name}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{jobTitleForCandidate(c.id)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Confidence bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${c.fitScore}%`, background: color }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold tabular-nums w-8" style={{ color }}>
                          {c.fitScore}%
                        </span>
                      </div>
                      {/* Fit pill */}
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: fitClasses.bg, color: fitClasses.text }}
                      >
                        {fitLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* RIGHT — Funnel + Activity stacked */}
          <div className="flex flex-col gap-4">

            {/* Card A — Hiring funnel */}
            <Card className="p-5">
              <SectionHeading>Hiring funnel</SectionHeading>
              <div className="space-y-2.5">
                {STAGES.map((stage) => {
                  const count = stageCounts[stage];
                  const pct   = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <span
                        className="text-[11px] font-medium shrink-0 w-[88px]"
                        style={{ color: FUNNEL_LABEL_COLORS[stage] }}
                      >
                        {stage}
                      </span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: count > 0 ? `${Math.max(pct, 5)}%` : "0%",
                            background: FUNNEL_COLORS[stage],
                          }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-mono tabular-nums w-5 text-right"
                        style={{ color: FUNNEL_LABEL_COLORS[stage] }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Card B — AI Activity */}
            <Card className="p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <SparkIcon size={13} />
                <SectionHeading>AI activity</SectionHeading>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div
                  className="absolute left-[3px] top-1.5 bottom-1.5 w-px"
                  style={{ background: "#e5e7eb" }}
                />
                <div className="space-y-4">
                  {ACTIVITY_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pl-0.5">
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-1"
                        style={{ background: item.ai ? "var(--ai-accent)" : "#d1d5db" }}
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#444] leading-snug">{item.text}</p>
                        <p className="text-[11px] text-[#aaa] mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* ── Section 5: Applications over time ── */}
        <Card className="p-5">
          <SectionHeading>Applications over time (last 8 weeks)</SectionHeading>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CHART_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#aaa" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "0.5px solid #e5e5e5",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#444",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                itemStyle={{ color: "#6366f1" }}
                labelStyle={{ color: "#888", marginBottom: "2px" }}
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* ── Section 6: Recent jobs ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionHeading>Recent jobs</SectionHeading>
            <Link
              to="/jobs"
              className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              View all <ChevronRight />
            </Link>
          </div>
          <Card>
            <div className="divide-y" style={{ borderColor: "#f5f5f5" }}>
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between px-4 sm:px-5 py-3 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[13px] font-medium text-gray-800 truncate">{job.title}</span>
                    <Badge status={job.status} />
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <span className="hidden sm:block text-[12px] text-gray-400">
                      {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="flex items-center gap-1 text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      View shortlist <ChevronRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </main>
  );
}
