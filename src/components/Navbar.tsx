import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm font-semibold text-gray-900 tracking-tight hover:opacity-70 transition-opacity"
        >
          ApplyAI
        </button>
        <button
          onClick={() => navigate("/jobs/new")}
          className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-3.5 py-1.5 rounded-md transition-colors"
        >
          New Job
        </button>
      </div>
    </header>
  );
}
