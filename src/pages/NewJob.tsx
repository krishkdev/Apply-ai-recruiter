import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import SkillTag from "../components/SkillTag";
import { useJobs } from "../context/JobsContext";

export default function NewJob() {
  const navigate = useNavigate();
  const { addJob } = useJobs();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills((prev) => [...prev, val]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addJob({ title: title.trim(), description: description.trim(), requiredSkills: skills });
    navigate("/dashboard");
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to jobs
        </button>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Post a New Role</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details and we'll rank matching candidates automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Job description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              required
              rows={7}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>

          {/* Required skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Required Skills
            </label>

            {/* Tag chips */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((skill) => (
                  <SkillTag key={skill} label={skill} onRemove={() => removeSkill(skill)} />
                ))}
              </div>
            )}

            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="mt-1.5 text-xs text-gray-400">Press Enter to add each skill</p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
            >
              Post &amp; Score Candidates
            </button>
          </div>
        </form>
      </main>
  );
}
