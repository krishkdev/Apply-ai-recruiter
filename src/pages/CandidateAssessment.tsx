import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import FitTag, { getFitLevel } from "../components/FitTag";
import { useJobs } from "../context/JobsContext";
import { mockCandidates } from "../mock/data";

type SkillStatus = "Matched" | "Partial" | "Missing";

function getSkillStatus(candidateId: string, skill: string, fitScore: number): SkillStatus {
  const seed = [...(candidateId + skill)].reduce((a, c) => a + c.charCodeAt(0), 0) % 100;
  if (fitScore >= 70) {
    if (seed < 55) return "Matched";
    if (seed < 80) return "Partial";
    return "Missing";
  }
  if (fitScore >= 40) {
    if (seed < 25) return "Matched";
    if (seed < 60) return "Partial";
    return "Missing";
  }
  if (seed < 10) return "Matched";
  if (seed < 35) return "Partial";
  return "Missing";
}

const skillStatusConfig: Record<SkillStatus, { dot: string; label: string; text: string }> = {
  Matched: { dot: "bg-green-500", label: "text-gray-900", text: "text-green-700" },
  Partial:  { dot: "bg-amber-400", label: "text-gray-900", text: "text-amber-700" },
  Missing:  { dot: "bg-red-400",   label: "text-gray-400", text: "text-red-600"   },
};

const recommendationConfig = {
  strong:   { text: "Recommend advancing to interview",   classes: "bg-green-50 text-green-800 border-green-200" },
  possible: { text: "Consider for further review",        classes: "bg-amber-50 text-amber-800 border-amber-200" },
  weak:     { text: "Does not meet minimum requirements", classes: "bg-red-50 text-red-800 border-red-200"       },
};

export default function CandidateAssessment() {
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

  const level = getFitLevel(candidate.fitScore);
  const recommendation = recommendationConfig[level];
  const requiredSkills = job?.requiredSkills ?? [];

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumb
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: job?.title ?? "Job", to: `/jobs/${jobId}` },
            { label: "Shortlist", to: `/jobs/${jobId}` },
            { label: "Assessment" },
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

        {/* Assessment card */}
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {/* Fit level + reason */}
          <section className="px-6 py-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              AI Assessment
            </h2>
            <div className="mb-4">
              <FitTag score={candidate.fitScore} size="lg" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{candidate.assessmentReason}</p>
          </section>

          {/* Skills breakdown */}
          {requiredSkills.length > 0 && (
            <section className="px-6 py-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Skills Breakdown
              </h2>
              <div className="space-y-3">
                {requiredSkills.map((skill) => {
                  const status = getSkillStatus(candidate.id, skill, candidate.fitScore);
                  const cfg = skillStatusConfig[status];
                  return (
                    <div key={skill} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        <span className={`text-sm ${cfg.label}`}>{skill}</span>
                      </div>
                      <span className={`text-xs font-medium ${cfg.text}`}>{status}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recommendation */}
          <section className="px-6 py-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Recommendation
            </h2>
            <div className={`border rounded-md px-4 py-3 text-sm font-medium ${recommendation.classes}`}>
              {recommendation.text}
            </div>
          </section>
        </div>
      </main>
  );
}
