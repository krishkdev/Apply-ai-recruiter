import { createContext, useContext, useState, ReactNode } from "react";
import { mockJobs, type Job } from "../mock/data";

type JobsContextType = {
  jobs: Job[];
  addJob: (data: Pick<Job, "title" | "requiredSkills"> & { description: string }) => void;
};

const JobsContext = createContext<JobsContextType>({ jobs: [], addJob: () => {} });

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs as Job[]);

  const addJob: JobsContextType["addJob"] = ({ title, requiredSkills }) => {
    const newJob: Job = {
      id: String(Date.now()),
      title,
      status: "ACTIVE",
      createdAt: new Date().toISOString().split("T")[0],
      applicantCount: 0,
      requiredSkills,
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  return <JobsContext.Provider value={{ jobs, addJob }}>{children}</JobsContext.Provider>;
}

export const useJobs = () => useContext(JobsContext);
