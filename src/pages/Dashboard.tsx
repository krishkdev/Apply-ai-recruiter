import { useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import SkillTag from "../components/SkillTag";
import { useJobs } from "../context/JobsContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Job Postings</h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeCount} active {activeCount === 1 ? "role" : "roles"}
          </p>
        </div>

        {/* Empty state */}
        {jobs.length === 0 && (
          <div className="border border-dashed border-gray-200 rounded-lg py-20 text-center">
            <p className="text-sm text-gray-400">No job postings yet.</p>
            <button
              onClick={() => navigate("/jobs/new")}
              className="mt-3 text-sm font-medium text-gray-900 underline underline-offset-2 hover:opacity-70"
            >
              Create your first role
            </button>
          </div>
        )}

        {/* Job list */}
        {jobs.length > 0 && (
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6 hover:bg-gray-50 transition-colors"
              >
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {job.title}
                    </span>
                    <Badge status={job.status} />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {job.requiredSkills.map((skill) => (
                      <SkillTag key={skill} label={skill} />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>
                      {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                    </span>
                    <span>
                      Posted{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="shrink-0 self-start sm:self-auto text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 px-3.5 py-1.5 rounded-md transition-colors"
                >
                  View Shortlist
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
  );
}
