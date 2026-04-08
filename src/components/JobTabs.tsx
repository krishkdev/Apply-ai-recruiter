import { useNavigate } from "react-router-dom";

type Tab = "shortlist" | "pipeline";

type Props = {
  jobId: string;
  active: Tab;
};

export default function JobTabs({ jobId, active }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
      <button
        onClick={() => navigate(`/jobs/${jobId}`)}
        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
          active === "shortlist"
            ? "border-gray-900 text-gray-900"
            : "border-transparent text-gray-400 hover:text-gray-600"
        }`}
      >
        Shortlist
      </button>
      <button
        onClick={() => navigate(`/jobs/${jobId}/pipeline`)}
        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
          active === "pipeline"
            ? "border-gray-900 text-gray-900"
            : "border-transparent text-gray-400 hover:text-gray-600"
        }`}
      >
        Pipeline
      </button>
    </div>
  );
}
