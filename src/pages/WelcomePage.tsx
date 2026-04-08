import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Feature icons ─────────────────────────────────────────────────────────────

function ScoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 10.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PipelineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="3" width="4.5" height="14" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7.75" y="3" width="4.5" height="10" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
      <rect x="14" y="3" width="4.5" height="12" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 15L7.5 9.5L11.5 12L17 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" />
      <circle cx="11.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="17" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <ScoreIcon />,
    title: "AI Scoring",
    desc: "Rank candidates instantly with Voyage + Claude",
  },
  {
    icon: <PipelineIcon />,
    title: "Pipeline",
    desc: "Drag candidates through your hiring stages",
  },
  {
    icon: <AnalyticsIcon />,
    title: "Analytics",
    desc: "Track your hiring funnel in real time",
  },
];

export default function WelcomePage() {
  const { clearFirstLogin } = useAuth();

  // Clear the flag on mount so ProtectedRoute won't redirect here again
  useEffect(() => {
    clearFirstLogin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-[580px] w-full text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-14">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold leading-none">A</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">ApplyAI</span>
        </div>

        {/* Heading */}
        <h1 className="text-[28px] font-semibold text-gray-900 leading-tight mb-3">
          Welcome to ApplyAI, Krishnakumar
        </h1>
        <p className="text-base text-gray-500 mb-12">
          Your AI-powered recruiting workspace is ready.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl px-4 py-5 text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 mb-3">
                {icon}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
        >
          Go to dashboard
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="mt-4">
          <Link
            to="/dashboard"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip for now
          </Link>
        </div>

      </div>
    </div>
  );
}
