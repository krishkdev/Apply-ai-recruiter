import { useNavigate } from "react-router-dom";
import AIConfidenceMeter from "./AIConfidenceMeter";
import SparkIcon from "./SparkIcon";
import { getFitLevel } from "./FitTag";
import { type Candidate, type Stage } from "../mock/data";

// ── Shared constants ───────────────────────────────────────────────────────────

const ALL_STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

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

const FIT_CONFIG = {
  strong:   { label: "Strong fit",   classes: "bg-green-50 text-green-700 border-green-200" },
  possible: { label: "Possible fit", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  weak:     { label: "Weak fit",     classes: "bg-red-50 text-red-600 border-red-200" },
};

// ── Icons ──────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5L4 7L8 3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3 3L7 7M7 3L3 7" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Props ─────────────────────────────────────────────────────────────────────

type CandidateCardProps = {
  candidate: Candidate;
  stage: Stage;
  jobId: string;
  requiredSkills: string[];
  rank?: number;
  variant?: "full" | "kanban";
  // Shortlist-only optional props
  isReviewed?: boolean;
  onToggleReviewed?: () => void;
  onMoveStage?: (s: Stage) => void;
  note?: string;
  notesDraft?: string;
  isNotesOpen?: boolean;
  onOpenNotes?: () => void;
  onSaveNote?: () => void;
  onCancelNotes?: () => void;
  onChangeDraft?: (text: string) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CandidateCard({
  candidate,
  stage,
  jobId,
  requiredSkills,
  rank,
  variant = "full",
  isReviewed,
  onToggleReviewed,
  onMoveStage,
  note,
  notesDraft = "",
  isNotesOpen,
  onOpenNotes,
  onSaveNote,
  onCancelNotes,
  onChangeDraft,
}: CandidateCardProps) {
  const navigate = useNavigate();

  const level = getFitLevel(candidate.fitScore);
  const fitConfig = FIT_CONFIG[level];

  const candidateSkillsLower = candidate.resumeData.skills.map((s) => s.toLowerCase());
  const matchedSkills = requiredSkills.filter((s) => candidateSkillsLower.includes(s.toLowerCase()));
  const missingSkills = requiredSkills.filter((s) => !candidateSkillsLower.includes(s.toLowerCase()));
  const isDirty = notesDraft !== (note ?? "");

  // ── Kanban variant ──────────────────────────────────────────────────────────
  if (variant === "kanban") {
    return (
      <div className="bg-white rounded-md border border-gray-200 px-3 py-2.5 select-none shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 leading-tight truncate">
              {candidate.name}
            </p>
            <p className="text-[11px] text-gray-400 truncate mt-0.5">{candidate.email}</p>
          </div>
          <AIConfidenceMeter score={candidate.fitScore} size={40} />
        </div>

        {/* Fit tag + Claude label */}
        <div className="flex items-center gap-1.5 mb-2">
          <SparkIcon size={10} />
          <span className={`inline-flex items-center border ${fitConfig.classes} px-1.5 py-px text-[10px] font-medium rounded-full`}>
            {fitConfig.label}
          </span>
        </div>

        {/* Brief (2 lines) */}
        <p
          className="text-[11px] text-gray-500 leading-relaxed"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {candidate.brief}
        </p>
      </div>
    );
  }

  // ── Full variant ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 sm:px-6 py-4 sm:py-5">

      {/* 1. Header row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[11px] font-semibold shrink-0">
            {getInitials(candidate.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {rank !== undefined && (
                <span className="text-xs font-mono text-gray-300 shrink-0">#{rank}</span>
              )}
              <p className="text-[15px] font-semibold text-gray-900 truncate leading-tight">
                {candidate.name}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{candidate.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Reviewed toggle (shortlist only) */}
          {onToggleReviewed !== undefined && (
            <button
              onClick={onToggleReviewed}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${
                isReviewed
                  ? "bg-gray-900 text-white border-gray-900"
                  : "text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isReviewed && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isReviewed ? "Reviewed" : "Mark reviewed"}
            </button>
          )}

          {/* AI Confidence Meter */}
          <AIConfidenceMeter score={candidate.fitScore} size={52} />
        </div>
      </div>

      {/* 2. Fit tag row */}
      <div className="flex items-center gap-2 mb-3">
        <SparkIcon size={12} />
        <span className="text-[11px] font-medium" style={{ color: "var(--ai-accent)" }}>
          Claude assessment
        </span>
        <span className={`inline-flex items-center border ${fitConfig.classes} px-2 py-0.5 text-xs font-medium rounded-full`}>
          {fitConfig.label}
        </span>
      </div>

      {/* 3. AI Brief box */}
      <div
        className="mb-3 rounded-md border border-indigo-100 px-3 py-2.5"
        style={{ background: "var(--ai-accent-light)", borderLeft: "3px solid var(--ai-accent)" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <SparkIcon size={11} />
          <span className="text-[11px] font-medium" style={{ color: "var(--ai-accent)" }}>
            Claude
          </span>
        </div>
        <p className="text-[13px] text-gray-600 leading-relaxed">{candidate.brief}</p>
      </div>

      {/* 4. Skill match row */}
      {requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {matchedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-indigo-200"
              style={{ background: "var(--ai-accent-light)", color: "var(--ai-accent)" }}
            >
              <CheckIcon />
              {skill}
            </span>
          ))}
          {missingSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200"
            >
              <XSmallIcon />
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* 5. Stage movement pills (shortlist only) */}
      {onMoveStage && (
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {ALL_STAGES.map((s) => {
            const isActive = stage === s;
            return (
              <button
                key={s}
                onClick={() => onMoveStage(s)}
                className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${
                  isActive ? STAGE_PILL[s].active : STAGE_PILL[s].inactive
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {/* 6. Notes (shortlist only) */}
      {onOpenNotes && (
        <div className="mb-3">
          {!isNotesOpen ? (
            note ? (
              <div>
                <p className="text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-md px-3.5 py-3 leading-relaxed whitespace-pre-wrap">
                  {note}
                </p>
                <button
                  onClick={onOpenNotes}
                  className="mt-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Edit note
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenNotes}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                + Add note
              </button>
            )
          ) : (
            <div>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => onChangeDraft?.(e.target.value)}
                placeholder="Add a private note about this candidate…"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                autoFocus
              />
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={onSaveNote}
                  className="text-xs font-medium bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md transition-colors"
                >
                  Save note
                </button>
                <button
                  onClick={onCancelNotes}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                {isDirty && <span className="text-xs text-gray-400 italic">Unsaved</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Footer: stage chip + action links */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_CHIP[stage]}`}>
          {stage}
        </span>

        <div className="flex items-center gap-0 text-xs text-gray-400">
          <button
            onClick={() => navigate(`/jobs/${jobId}/candidates/${candidate.id}/resume`)}
            className="hover:text-gray-700 transition-colors px-2 py-1"
          >
            View resume
          </button>
          <span className="w-px h-3 bg-gray-200" />
          <button
            onClick={() => navigate(`/jobs/${jobId}/candidates/${candidate.id}/assessment`)}
            className="hover:text-gray-700 transition-colors px-2 py-1"
          >
            Assessment
          </button>
          <span className="w-px h-3 bg-gray-200" />
          <button
            onClick={() => navigate(`/candidates`)}
            className="hover:text-gray-700 transition-colors px-2 py-1"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
