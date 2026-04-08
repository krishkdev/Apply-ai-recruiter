import { useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import Breadcrumb from "../components/Breadcrumb";
import JobTabs from "../components/JobTabs";
import CandidateCard from "../components/CandidateCard";
import { useJobs } from "../context/JobsContext";
import { useCandidates } from "../context/CandidateContext";
import { type Stage } from "../mock/data";

// ── Column config ─────────────────────────────────────────────────────────────

const COLUMNS: { stage: Stage; label: string; headerClass: string }[] = [
  { stage: "Shortlisted",  label: "Shortlisted",  headerClass: "text-gray-600" },
  { stage: "Interviewing", label: "Interviewing", headerClass: "text-blue-600" },
  { stage: "Offer",        label: "Offer",        headerClass: "text-purple-600" },
  { stage: "Hired",        label: "Hired",        headerClass: "text-green-600" },
  { stage: "Rejected",     label: "Rejected",     headerClass: "text-red-500" },
];

const COLUMN_BG: Record<Stage, string> = {
  Shortlisted:  "bg-gray-50",
  Interviewing: "bg-blue-50/40",
  Offer:        "bg-purple-50/40",
  Hired:        "bg-green-50/40",
  Rejected:     "bg-red-50/30",
};

const COLUMN_BORDER: Record<Stage, string> = {
  Shortlisted:  "border-gray-200",
  Interviewing: "border-blue-100",
  Offer:        "border-purple-100",
  Hired:        "border-green-100",
  Rejected:     "border-red-100",
};

// ── Toast ─────────────────────────────────────────────────────────────────────

type Toast = {
  id: number;
  message: string;
  variant: "default" | "hired" | "rejected";
  undo?: () => void;
};

let toastCounter = 0;

// ── Component ─────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs } = useJobs();
  const { candidates, stages, moveStage } = useCandidates();
  const job = jobs.find((j) => j.id === jobId);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, variant: Toast["variant"], undo?: () => void) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, variant, undo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const toStage = destination.droppableId as Stage;
    const fromStage = stages[draggableId];
    if (toStage === fromStage) return;

    moveStage(draggableId, toStage);

    const candidate = candidates.find((c) => c.id === draggableId);
    const name = candidate?.name ?? "Candidate";

    if (toStage === "Hired") {
      addToast(`${name} moved to Hired`, "hired");
    } else if (toStage === "Rejected") {
      const previousStage = fromStage;
      addToast(`${name} rejected`, "rejected", () => {
        moveStage(draggableId, previousStage);
      });
    }
  };

  // Group candidates by stage
  const byStage = Object.fromEntries(
    COLUMNS.map(({ stage }) => [
      stage,
      candidates.filter((c) => stages[c.id] === stage),
    ])
  ) as Record<Stage, typeof candidates>;

  return (
    <>
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumb
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: job?.title ?? "Job", to: `/jobs/${jobId}` },
            { label: "Pipeline" },
          ]}
        />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{job?.title ?? "Job not found"}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {candidates.length} candidates · drag to move between stages
            </p>
          </div>
        </div>

        <JobTabs jobId={jobId!} active="pipeline" />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4">
          <div className="grid grid-cols-5 gap-3 items-start min-w-[700px]">
            {COLUMNS.map(({ stage, label, headerClass }) => (
              <div key={stage} className="flex flex-col min-w-0">
                {/* Column header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className={`text-xs font-semibold ${headerClass}`}>{label}</span>
                  <span className="text-xs text-gray-400 font-mono">
                    {byStage[stage].length}
                  </span>
                </div>

                {/* Drop zone */}
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg border min-h-[120px] p-2 transition-colors ${
                        COLUMN_BG[stage]
                      } ${COLUMN_BORDER[stage]} ${
                        snapshot.isDraggingOver ? "ring-2 ring-gray-300" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        {byStage[stage].map((candidate, index) => (
                          <Draggable
                            key={candidate.id}
                            draggableId={candidate.id}
                            index={index}
                          >
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
                                  jobId={jobId!}
                                  requiredSkills={job?.requiredSkills ?? []}
                                  variant="kanban"
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
          </div>
        </DragDropContext>
      </main>

      {/* Toast stack */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border animate-fade-in ${
              toast.variant === "hired"
                ? "bg-green-50 text-green-800 border-green-200"
                : toast.variant === "rejected"
                ? "bg-white text-gray-700 border-gray-200"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            <span>{toast.message}</span>
            {toast.undo && (
              <button
                onClick={() => {
                  toast.undo!();
                  dismissToast(toast.id);
                }}
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
