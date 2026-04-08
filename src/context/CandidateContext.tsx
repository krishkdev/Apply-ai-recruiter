import { createContext, useContext, useReducer, type ReactNode } from "react";
import { mockCandidates, type Stage, type Candidate } from "../mock/data";

// ── State ─────────────────────────────────────────────────────────────────────

type CandidateState = {
  candidates: Candidate[];
  statuses: Record<string, string>;
  stages: Record<string, Stage>;
  notes: Record<string, string>;
};

const initialState: CandidateState = {
  candidates: mockCandidates,
  statuses: Object.fromEntries(mockCandidates.map((c) => [c.id, c.status])),
  stages: Object.fromEntries(mockCandidates.map((c) => [c.id, c.stage])),
  notes: Object.fromEntries(mockCandidates.map((c) => [c.id, c.notes])),
};

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: "MOVE_STAGE"; candidateId: string; stage: Stage }
  | { type: "UPDATE_NOTE"; candidateId: string; note: string }
  | { type: "TOGGLE_REVIEWED"; candidateId: string };

function reducer(state: CandidateState, action: Action): CandidateState {
  switch (action.type) {
    case "MOVE_STAGE":
      return {
        ...state,
        stages: { ...state.stages, [action.candidateId]: action.stage },
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: { ...state.notes, [action.candidateId]: action.note },
      };
    case "TOGGLE_REVIEWED":
      return {
        ...state,
        statuses: {
          ...state.statuses,
          [action.candidateId]:
            state.statuses[action.candidateId] === "REVIEWED" ? "SCORED" : "REVIEWED",
        },
      };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

type CandidateContextValue = {
  candidates: Candidate[];
  statuses: Record<string, string>;
  stages: Record<string, Stage>;
  notes: Record<string, string>;
  moveStage: (candidateId: string, stage: Stage) => void;
  updateNote: (candidateId: string, note: string) => void;
  toggleReviewed: (candidateId: string) => void;
};

const CandidateContext = createContext<CandidateContextValue | null>(null);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CandidateContext.Provider
      value={{
        candidates: state.candidates,
        statuses: state.statuses,
        stages: state.stages,
        notes: state.notes,
        moveStage: (candidateId, stage) =>
          dispatch({ type: "MOVE_STAGE", candidateId, stage }),
        updateNote: (candidateId, note) =>
          dispatch({ type: "UPDATE_NOTE", candidateId, note }),
        toggleReviewed: (candidateId) =>
          dispatch({ type: "TOGGLE_REVIEWED", candidateId }),
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidates() {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error("useCandidates must be used within CandidateProvider");
  return ctx;
}
