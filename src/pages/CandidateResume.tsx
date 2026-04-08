import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import FitTag from "../components/FitTag";
import { useJobs } from "../context/JobsContext";
import { mockCandidates } from "../mock/data";

export default function CandidateResume() {
  const { jobId, candidateId } = useParams<{ jobId: string; candidateId: string }>();
  const { jobs } = useJobs();

  const job = jobs.find((j) => j.id === jobId);
  const candidate = mockCandidates.find((c) => c.id === candidateId);

  if (!candidate) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <p className="text-sm text-gray-500">Candidate not found.</p>
      </main>
    );
  }

  const { resumeData } = candidate;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumb
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: job?.title ?? "Job", to: `/jobs/${jobId}` },
            { label: "Shortlist", to: `/jobs/${jobId}` },
            { label: "Resume" },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{candidate.name}</h1>
            <FitTag score={candidate.fitScore} />
          </div>
          <p className="text-sm text-gray-500">{candidate.email}</p>
        </div>

        {/* Resume card */}
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {/* Summary */}
          <section className="px-6 py-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </section>

          {/* Experience */}
          <section className="px-6 py-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((role, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4 mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{role.role}</span>
                      <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor" className="mx-2 text-gray-300 self-center shrink-0">
                        <circle cx="2" cy="2" r="2" />
                      </svg>
                      <span className="text-sm text-gray-600">{role.company}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{role.duration}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {role.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="px-6 py-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="px-6 py-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Education
            </h2>
            <p className="text-sm text-gray-700">{resumeData.education}</p>
          </section>
        </div>
      </main>
  );
}
