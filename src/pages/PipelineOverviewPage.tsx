import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import CandidateCard from "../components/CandidateCard";
import { useCandidates } from "../context/CandidateContext";
import { useJobs } from "../context/JobsContext";
import { type Stage } from "../mock/data";

// ── Constants ─────────────────────────────────────────────────────────────────

const STAGES: Stage[] = ["Shortlisted", "Interviewing", "Offer", "Hired", "Rejected"];

const COLUMN_STYLE: Record<Stage, { bg: string; border: string; header: string }> = {
  Shortlisted:  { bg: "bg-gray-50",        border: "border-gray-200",   header: "text-gray-600"   },
  Interviewing: { bg: "bg-blue-50/40",     border: "border-blue-100",   header: "text-blue-600"   },
  Offer:        { bg: "bg-purple-50/40",   border: "border-purple-100", header: "text-purple-600" },
  Hired:        { bg: "bg-green-50/40",    border: "border-green-100",  header: "text-green-600"  },
  Rejected:     { bg: "bg-red-50/30",      border: "border-red-100",    header: "text-red-500"    },
};

// Distribute 20 candidates across 3 jobs by ID
function getJobId(candidateId: string): string {
  const n = parseInt(candidateId);
  if (n <= 7) return "1";
  if (n <= 14) return "2";
  return "3";
}

// ── Toast ─────────────────────────────────────────────────────────────────────

type Toast = { id: number; message: string; variant: "hired" | "rejected" | "default"; undo?: () => void };
let toastCounter = 0;

// ── Component ─────────────────────────────────────────────────────────────────

export default function PipelineOverviewPage() {
  const { candidates, stages, moveStage } = useCandidates();
  const { jobs } = useJobs();

  const [jobFilter, setJobFilter] = useState<string>("all");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, variant: Toast["variant"], undo?: () => void) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, variant, undo }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const visibleCandidates = jobFilter === "all"
    ? candidates
    : candidates.filter((c) => getJobId(c.id) === jobFilter);

  const byStage = Object.fromEntries(
    STAGES.map((s) => [s, visibleCandidates.filter((c) => stages[c.id] === s)])
  ) as Record<Stage, typeof candidates>;

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const toStage = destination.droppableId as Stage;
    const fromStage = stages[draggableId];
    if (toStage === fromStage) return;

    moveStage(draggableId, toStage);
    const name = candidates.find((c) => c.id === draggableId)?.name ?? "Candidate";

    if (toStage === "Hired") {
      addToast(`${name} moved to Hired`, "hired");
    } else if (toStage === "Rejected") {
      addToast(`${name} rejected`, "rejected", () => moveStage(draggableId, fromStage));
    }
  };

  return (
    <>
      <main className="max-w-[1300px] mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Pipeline</h1>
            <p className="mt-0.5 text-sm text-gray-400">
              {visibleCandidates.length} candidate{visibleCandidates.length !== 1 ? "s" : ""} across all stages
            </p>
          </div>

          {/* Job filter */}
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
          >
            <option value="all">All jobs ({candidates.length})</option>
            {jobs.map((job) => {
              const count = candidates.filter((c) => getJobId(c.id) === job.id).length;
              return (
                <option key={job.id} value={job.id}>
                  {job.title} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* ── Kanban board ── */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4">
          <div className="grid grid-cols-5 gap-3 items-start min-w-[700px]">
            {STAGES.map((stage) => {
              const style = COLUMN_STYLE[stage];
              const col = byStage[stage];

              return (
                <div key={stage} className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className={`text-xs font-semibold ${style.header}`}>{stage}</span>
                    <span className="text-xs text-gray-400 font-mono">{col.length}</span>
                  </div>

                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`rounded-lg border min-h-[120px] p-2 transition-colors ${style.bg} ${style.border} ${
                          snapshot.isDraggingOver ? "ring-2 ring-gray-300" : ""
                        }`}
                      >
                        <div className="space-y-2">
                          {col.map((candidate, index) => {
                            const cJobId = getJobId(candidate.id);
                            const cJob = jobs.find((j) => j.id === cJobId);

                            return (
                              <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={snapshot.isDragging ? "shadow-lg ring-1 ring-indigo-200 rounded-md" : ""}
                                  >
                                    <CandidateCard
                                      candidate={candidate}
                                      stage={stage}
                                      jobId={cJobId}
                                      requiredSkills={cJob?.requiredSkills ?? []}
                                      variant="kanban"
                                    />
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
          </div>
        </DragDropContext>
      </main>

      {/* ── Toast stack ── */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border ${
              toast.variant === "hired"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            <span>{toast.message}</span>
            {toast.undo && (
              <button
                onClick={() => { toast.undo!(); dismissToast(toast.id); }}
                className="text-xs underline underline-offset-2 text-gray-500 hover:text-gray-800 transition-colors"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-300 hover:text-gray-500 transition-colors ml-1"
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
