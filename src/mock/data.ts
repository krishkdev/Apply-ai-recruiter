export type Job = {
  id: string;
  title: string;
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
  applicantCount: number;
  requiredSkills: string[];
};

export type Stage = "Shortlisted" | "Interviewing" | "Offer" | "Hired" | "Rejected";

export type ResumeRole = {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  fitScore: number;
  status: string;
  stage: Stage;
  notes: string;
  brief: string;
  resumeUrl: string;
  assessmentReason: string;
  resumeData: {
    summary: string;
    experience: ResumeRole[];
    skills: string[];
    education: string;
  };
};

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    status: "ACTIVE",
    createdAt: "2026-03-01",
    applicantCount: 47,
    requiredSkills: ["Python", "Distributed Systems", "AWS"],
  },
  {
    id: "2",
    title: "ML Engineer",
    status: "ACTIVE",
    createdAt: "2026-03-10",
    applicantCount: 31,
    requiredSkills: ["PyTorch", "MLOps", "Python"],
  },
  {
    id: "3",
    title: "Product Manager",
    status: "CLOSED",
    createdAt: "2026-02-15",
    applicantCount: 89,
    requiredSkills: ["Roadmapping", "Stakeholder Management", "SQL"],
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@email.com",
    fitScore: 91,
    status: "SCORED",
    stage: "Interviewing",
    notes: "",
    brief:
      "Strong match for distributed systems role with 6 years at Stripe building high-throughput payment pipelines. Top strength is her hands-on experience with Kafka and Kubernetes at scale. Gap is limited AWS exposure — primarily a GCP practitioner.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate meets 7 of 8 required skills with direct production experience at a relevant scale. Stripe background is a strong signal for high-throughput distributed work. Minor gap in AWS is manageable given her cloud fundamentals.",
    resumeData: {
      summary:
        "Senior software engineer with 6 years of experience building distributed payment infrastructure. Specialised in high-throughput event streaming and microservices, with a track record of owning systems processing millions of transactions per day.",
      experience: [
        {
          role: "Senior Software Engineer",
          company: "Stripe",
          duration: "2020 – Present",
          bullets: [
            "Designed Kafka-based payment event pipeline processing 2M+ transactions per day with sub-5ms p99 latency",
            "Led migration of monolithic checkout service to microservices, reducing p99 latency by 40%",
            "Mentored 4 junior engineers and drove org-wide adoption of distributed tracing",
          ],
        },
        {
          role: "Software Engineer",
          company: "Square",
          duration: "2018 – 2020",
          bullets: [
            "Built real-time fraud detection service using Flink and Redis, blocking $3M in annual fraudulent charges",
            "Owned card-present checkout APIs used by 500K merchants across North America",
          ],
        },
      ],
      skills: ["Python", "Go", "Kafka", "Kubernetes", "PostgreSQL", "GCP", "Distributed Systems"],
      education: "B.S. Computer Science, Stanford University, 2018",
    },
  },
  {
    id: "6",
    name: "Elena Rodriguez",
    email: "elena.r@email.com",
    fitScore: 88,
    status: "SCORED",
    stage: "Offer",
    notes: "",
    brief:
      "Exceptional ML engineer with 5 years building and shipping NLP models at Cohere. Top strength is end-to-end ownership from training to production serving infrastructure. Gap is limited experience with classical MLOps tooling — she operates primarily in custom internal systems.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate has direct production ML experience at a leading AI company with a proven track record shipping models at scale. Her PyTorch depth and model serving experience are exactly what the role requires. Tooling gap is minor and easily bridgeable.",
    resumeData: {
      summary:
        "ML engineer with 5 years of experience training and deploying large language models in production. Deep expertise in PyTorch, model quantisation, and low-latency inference infrastructure.",
      experience: [
        {
          role: "Senior ML Engineer",
          company: "Cohere",
          duration: "2021 – Present",
          bullets: [
            "Fine-tuned and deployed transformer models for text classification serving 50M+ requests per month",
            "Built model quantisation pipeline reducing inference cost by 60% with <1% accuracy degradation",
            "Designed A/B testing framework for model rollouts used across the entire ML org",
          ],
        },
        {
          role: "ML Engineer",
          company: "Hugging Face",
          duration: "2019 – 2021",
          bullets: [
            "Contributed 12 model architectures to the Transformers library with 2K+ combined GitHub stars",
            "Maintained training infrastructure for BLOOM multilingual model fine-tuning experiments",
          ],
        },
      ],
      skills: ["PyTorch", "Python", "CUDA", "Transformers", "Model Serving", "Triton", "ONNX"],
      education: "M.S. Machine Learning, Carnegie Mellon University, 2019",
    },
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@email.com",
    fitScore: 84,
    status: "SCORED",
    stage: "Interviewing",
    notes: "",
    brief:
      "Solid backend engineer with strong Python expertise from 4 years at a fintech startup. Strong open-source contributor with 3 popular GitHub repos. Gap is no prior experience with systems handling more than 10K RPS.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate demonstrates strong Python proficiency and production backend experience in a regulated industry. Open-source contributions show depth beyond day job. Scale gap is a consideration but not a dealbreaker at this stage.",
    resumeData: {
      summary:
        "Backend engineer with 4 years of experience in fintech, specialising in Python microservices and API design. Active open-source contributor focused on developer tooling and async frameworks.",
      experience: [
        {
          role: "Backend Engineer",
          company: "Brex",
          duration: "2021 – Present",
          bullets: [
            "Built core transactions API handling 8K RPS with 99.95% uptime SLA",
            "Designed internal task queue system using Celery and SQS, replacing legacy cron jobs across 6 services",
            "Maintained PCI-DSS compliance posture for all payment data handling services",
          ],
        },
        {
          role: "Software Engineer",
          company: "Mercury",
          duration: "2019 – 2021",
          bullets: [
            "Developed ACH and wire transfer workflows using Python and FastAPI",
            "Reduced account onboarding latency by 35% through database query optimisation",
          ],
        },
      ],
      skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Celery", "Docker", "AWS"],
      education: "B.S. Computer Science, University of Michigan, 2019",
    },
  },
  {
    id: "7",
    name: "David Kim",
    email: "david.kim@email.com",
    fitScore: 82,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Strong DevOps/SRE profile with 6 years managing Kubernetes clusters and CI/CD at scale. Top strength is his track record reducing operational toil and driving reliability improvements at high-growth companies. Gap is less exposure to the application-level distributed systems work the role also requires.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate's infrastructure and reliability background directly maps to the platform requirements of the role. AWS and Kubernetes experience at scale are exactly what's needed. Some gap on application-layer distributed systems knowledge but solid foundation to build from.",
    resumeData: {
      summary:
        "Site reliability and platform engineer with 6 years designing cloud infrastructure for high-growth companies. Specialised in Kubernetes, observability, and zero-downtime deployment pipelines.",
      experience: [
        {
          role: "Senior SRE",
          company: "Datadog",
          duration: "2020 – Present",
          bullets: [
            "Managed 200-node Kubernetes cluster across 3 AWS regions serving internal tooling for 3K engineers",
            "Built GitOps pipeline using ArgoCD reducing deployment cycle time from 45 minutes to 8 minutes",
            "Established SLO framework and burn-rate alerting adopted across 40 product services",
          ],
        },
        {
          role: "DevOps Engineer",
          company: "PagerDuty",
          duration: "2018 – 2020",
          bullets: [
            "Migrated CI/CD from Jenkins to GitHub Actions, saving 12 hours of engineering time per week",
            "Reduced AWS infrastructure costs by 28% through spot instance strategy and right-sizing",
          ],
        },
      ],
      skills: ["Kubernetes", "AWS", "Terraform", "ArgoCD", "Prometheus", "Python", "Go"],
      education: "B.S. Computer Engineering, Georgia Tech, 2018",
    },
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya@email.com",
    fitScore: 78,
    status: "REVIEWED",
    stage: "Interviewing",
    notes: "",
    brief:
      "Full stack engineer pivoting to backend with strong fundamentals. Built and scaled a SaaS product to 50K users solo. Gap is limited team experience in large engineering orgs.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate demonstrates strong backend fundamentals and a proven ability to ship end-to-end products independently. Solo scaling experience shows resourcefulness. Team experience in larger orgs is a gap but not uncommon at this stage.",
    resumeData: {
      summary:
        "Full stack engineer with 4 years of experience, recently focused on backend systems. Founded and scaled a SaaS product to 50K users as sole technical founder.",
      experience: [
        {
          role: "Founder & CTO",
          company: "Formly (YC S23)",
          duration: "2022 – Present",
          bullets: [
            "Architected multi-tenant SaaS on AWS using Node.js, PostgreSQL, and React, scaling to 50K active users",
            "Implemented real-time collaboration using WebSockets and CRDTs with <100ms sync latency",
            "Managed infrastructure costs to <$800/month while serving 2M+ API requests per day",
          ],
        },
        {
          role: "Software Engineer",
          company: "Shopify",
          duration: "2020 – 2022",
          bullets: [
            "Built merchant analytics dashboard serving 1M+ daily active merchants using Ruby on Rails and React",
            "Contributed to internal GraphQL federation layer reducing API round-trips by 30%",
          ],
        },
      ],
      skills: ["Node.js", "TypeScript", "React", "PostgreSQL", "AWS", "Redis", "Python"],
      education: "B.S. Computer Science, University of Waterloo, 2020",
    },
  },
  {
    id: "8",
    name: "Yuki Tanaka",
    email: "yuki.t@email.com",
    fitScore: 76,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Experienced data scientist with a strong ML and experimentation background. Top strength is her rigorous approach to A/B testing and statistical modelling at scale. Gap is that she lacks the engineering depth for production system design that this role demands.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate has strong Python and ML fundamentals with a track record of production model deployment. Her experimentation framework work shows systems-level thinking. Engineering depth gap is real but her trajectory is clearly toward applied ML engineering.",
    resumeData: {
      summary:
        "Data scientist with 5 years of experience in recommendation systems and applied ML. Strong background in experimental design, statistical analysis, and deploying models to production.",
      experience: [
        {
          role: "Senior Data Scientist",
          company: "Spotify",
          duration: "2021 – Present",
          bullets: [
            "Built collaborative filtering recommendation model serving 400M users, improving session length by 9%",
            "Designed and ran 80+ A/B experiments on playlist ranking, contributing $40M in estimated annual revenue uplift",
            "Deployed real-time user interest model on Kafka Streams updating recommendations within 2 seconds of user actions",
          ],
        },
        {
          role: "Data Scientist",
          company: "Netflix",
          duration: "2019 – 2021",
          bullets: [
            "Developed content affinity models improving thumbnail personalisation click-through by 12%",
            "Built automated experiment analysis pipeline reducing reporting time from 2 weeks to 2 days",
          ],
        },
      ],
      skills: ["Python", "PyTorch", "Spark", "SQL", "Scala", "Kafka", "Airflow"],
      education: "M.S. Statistics, University of Tokyo, 2019",
    },
  },
  {
    id: "9",
    name: "Omar Hassan",
    email: "omar.h@email.com",
    fitScore: 72,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Strong technical PM with engineering background who bridges product and platform well. Top strength is his experience shipping developer-facing products and API platforms. Gap is that this is a hands-on engineering role — his coding is 2 years removed from daily practice.",
    resumeUrl: "#",
    assessmentReason:
      "Rated green because candidate's technical background and API platform experience are genuinely relevant. He codes and can contribute, but primarily in a product capacity. Borderline case — strong fit if the role tolerates a product-adjacent hire, weaker fit if daily coding depth is required.",
    resumeData: {
      summary:
        "Technical product manager with a software engineering background, specialising in developer tools and API platforms. 3 years as PM after 3 years as a software engineer.",
      experience: [
        {
          role: "Senior Product Manager, Platform",
          company: "Twilio",
          duration: "2021 – Present",
          bullets: [
            "Owned the Programmable Voice API product used by 180K developers, growing MAU by 35%",
            "Defined and shipped SDK redesign reducing time-to-first-call from 40 minutes to under 8 minutes",
            "Collaborated with engineering to build usage analytics dashboard reducing support ticket volume by 22%",
          ],
        },
        {
          role: "Software Engineer",
          company: "Twilio",
          duration: "2018 – 2021",
          bullets: [
            "Built core WebRTC signalling layer for browser-based voice calls handling 10M minutes per month",
            "Led API versioning strategy across 6 product APIs with zero breaking change incidents",
          ],
        },
      ],
      skills: ["Python", "JavaScript", "REST APIs", "SQL", "Product Strategy", "Roadmapping"],
      education: "B.S. Computer Science, MIT, 2018",
    },
  },
  {
    id: "10",
    name: "Sam Okafor",
    email: "sam.o@email.com",
    fitScore: 68,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Capable backend engineer with solid Python skills and 3 years of production experience. Top strength is rapid shipping velocity in early-stage environments. Gap is limited exposure to distributed systems at scale — his current stack is a monolithic Rails app.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate has the language proficiency and backend fundamentals required, but his production systems experience is at a significantly smaller scale than the role demands. Strong potential but would need ramp-up time on distributed systems patterns.",
    resumeData: {
      summary:
        "Backend engineer with 3 years of experience at early-stage startups. Strong Python and API development background with a track record of shipping fast in ambiguous environments.",
      experience: [
        {
          role: "Backend Engineer",
          company: "Duffel",
          duration: "2022 – Present",
          bullets: [
            "Built flight search aggregation API handling 500K requests per day using Python and PostgreSQL",
            "Designed booking state machine processing 2K transactions per day with full idempotency guarantees",
            "Reduced API response time by 45% through query optimisation and Redis caching layer",
          ],
        },
        {
          role: "Junior Software Engineer",
          company: "Monzo",
          duration: "2021 – 2022",
          bullets: [
            "Contributed to internal tooling for fraud analyst workflows using Python and Django",
            "Wrote integration tests that caught 3 production-impacting bugs before release",
          ],
        },
      ],
      skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker", "REST APIs"],
      education: "B.Sc. Software Engineering, University of Lagos, 2021",
    },
  },
  {
    id: "11",
    name: "Lisa Zhang",
    email: "lisa.z@email.com",
    fitScore: 65,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "ML engineer with 3 years of experience primarily in research and experimentation. Top strength is PyTorch fluency and experience with model evaluation pipelines. Gap is thin production engineering experience — her models have not yet run at meaningful scale.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate has the right ML skills but is earlier in her career than the role likely needs. Research-to-production gap is a real concern. Would be a stronger fit in 18 months with one more production deployment under her belt.",
    resumeData: {
      summary:
        "ML engineer with a research background, transitioning to applied production ML. Strong foundation in deep learning, NLP, and model evaluation methodology.",
      experience: [
        {
          role: "ML Engineer",
          company: "Wayve",
          duration: "2023 – Present",
          bullets: [
            "Trained and evaluated transformer-based driving policy models using PyTorch on internal simulation data",
            "Built model evaluation harness running 200+ automated behavioural tests per training run",
            "Contributed to data pipeline processing 50TB of camera footage for training dataset curation",
          ],
        },
        {
          role: "Research Engineer Intern",
          company: "DeepMind",
          duration: "2022 (6 months)",
          bullets: [
            "Implemented and benchmarked 3 novel attention mechanisms for a graph neural network paper",
            "Reproduced 4 baseline models from literature to validate experimental setup",
          ],
        },
      ],
      skills: ["PyTorch", "Python", "JAX", "CUDA", "MLflow", "SQL"],
      education: "M.Eng. Machine Learning, University of Cambridge, 2023",
    },
  },
  {
    id: "4",
    name: "James Wu",
    email: "james@email.com",
    fitScore: 61,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Recent bootcamp grad with strong Python fundamentals and two solid internships. Enthusiastic learner but lacks production systems experience required for a senior role.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate shows genuine technical aptitude and internship experience validates his skills beyond bootcamp. However, the breadth and depth of production experience is well below the senior bar. Better suited to a mid-level pipeline.",
    resumeData: {
      summary:
        "Software engineer with 2 years of experience including 2 internships and a bootcamp. Strong Python foundations and a fast learner with a passion for backend development.",
      experience: [
        {
          role: "Software Engineering Intern",
          company: "Plaid",
          duration: "Summer 2025",
          bullets: [
            "Built internal data validation tool in Python that caught 200+ malformed bank records per week",
            "Wrote unit and integration tests for 3 new API endpoints, achieving 90% coverage",
          ],
        },
        {
          role: "Software Engineering Intern",
          company: "Robinhood",
          duration: "Summer 2024",
          bullets: [
            "Implemented feature flag system prototype using Redis for A/B testing infrastructure team",
            "Contributed bug fixes to internal portfolio analytics microservice",
          ],
        },
      ],
      skills: ["Python", "JavaScript", "PostgreSQL", "Docker", "Flask", "Git"],
      education: "Fullstack Academy (2023), B.A. Economics, NYU, 2022",
    },
  },
  {
    id: "12",
    name: "Alex Novak",
    email: "alex.n@email.com",
    fitScore: 58,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "DevOps engineer with 4 years in infrastructure and CI/CD. Top strength is cloud cost optimisation and Terraform expertise. Gap is that his skills skew infrastructure rather than application-layer engineering, which this role requires.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate brings infrastructure skills that partially overlap with the role's requirements, but the application-layer software engineering depth needed is not evident from his background. Could be a strong fit for a pure platform role.",
    resumeData: {
      summary:
        "DevOps and cloud infrastructure engineer with 4 years of experience automating deployments and managing cloud cost at SaaS companies.",
      experience: [
        {
          role: "DevOps Engineer",
          company: "Contentful",
          duration: "2022 – Present",
          bullets: [
            "Managed Terraform-based AWS infrastructure across 12 environments for 80-person engineering org",
            "Reduced cloud spend by €400K annually through reserved instance optimisation and auto-scaling tuning",
            "Implemented secrets management migration from AWS SSM to Vault with zero downtime",
          ],
        },
        {
          role: "Junior DevOps Engineer",
          company: "SoundCloud",
          duration: "2020 – 2022",
          bullets: [
            "Maintained Kubernetes deployments for 25 microservices on GKE",
            "Built Slack-based deployment bot reducing deployment friction for 30 engineers",
          ],
        },
      ],
      skills: ["Terraform", "AWS", "Kubernetes", "Ansible", "Python (scripting)", "Bash", "Datadog"],
      education: "B.Eng. Systems Engineering, Czech Technical University, 2020",
    },
  },
  {
    id: "13",
    name: "Jordan Williams",
    email: "jordan.w@email.com",
    fitScore: 55,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Mid-level SWE with 3 years of experience in frontend-heavy full stack roles. Top strength is TypeScript and React depth. Gap is minimal backend systems experience — she has not worked with distributed systems or high-throughput infrastructure.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate has solid engineering fundamentals and genuine full stack experience, but her work is predominantly frontend with light backend involvement. The backend distributed systems requirements of this role would require significant upskilling.",
    resumeData: {
      summary:
        "Full stack engineer with 3 years of experience, primarily frontend-focused. Strong TypeScript and React skills with growing interest in backend systems and infrastructure.",
      experience: [
        {
          role: "Software Engineer",
          company: "Figma",
          duration: "2022 – Present",
          bullets: [
            "Built plugin marketplace frontend in React and TypeScript, serving 300K plugin installs per month",
            "Optimised bundle size by 52% using code splitting and dynamic imports, improving LCP by 1.8s",
            "Contributed Node.js API endpoints for plugin metadata storage using PostgreSQL",
          ],
        },
        {
          role: "Junior Software Engineer",
          company: "Webflow",
          duration: "2021 – 2022",
          bullets: [
            "Implemented drag-and-drop canvas interactions with React and custom event handling",
            "Fixed 40+ accessibility issues bringing the editor to WCAG 2.1 AA compliance",
          ],
        },
      ],
      skills: ["TypeScript", "React", "Node.js", "GraphQL", "PostgreSQL", "CSS", "Figma"],
      education: "B.S. Computer Science, Brown University, 2021",
    },
  },
  {
    id: "14",
    name: "Fatoumata Diallo",
    email: "fdiallo@email.com",
    fitScore: 49,
    status: "SCORED",
    stage: "Rejected",
    notes: "",
    brief:
      "Product manager with 4 years in mobile consumer apps. Top strength is her user research methodology and track record improving retention metrics. Gap is that this is an engineering role — she has no hands-on coding background.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate applied to a software engineering role despite a pure product management background. Her experience is strong within PM but does not translate to the technical requirements of this position. Possible match for a product-facing role at this company.",
    resumeData: {
      summary:
        "Product manager with 4 years of experience in consumer mobile apps, specialising in retention and engagement metrics. Strong background in qualitative research and cross-functional collaboration.",
      experience: [
        {
          role: "Product Manager",
          company: "Calm",
          duration: "2022 – Present",
          bullets: [
            "Owned the onboarding experience for 4M MAU, improving D7 retention from 28% to 41% through 60+ experiments",
            "Launched sleep stories personalisation feature driving 18% increase in premium subscription conversion",
            "Partnered with data science team to build user segmentation model for targeted push notifications",
          ],
        },
        {
          role: "Associate Product Manager",
          company: "Headspace",
          duration: "2020 – 2022",
          bullets: [
            "Managed roadmap for meditation library with 1,500+ pieces of content across 7 languages",
            "Ran 20+ A/B experiments improving session completion rate by 12%",
          ],
        },
      ],
      skills: ["Product Strategy", "User Research", "SQL (basic)", "Amplitude", "Figma", "JIRA"],
      education: "B.A. Psychology, Sciences Po Paris, 2020",
    },
  },
  {
    id: "15",
    name: "Raj Patel",
    email: "raj.p@email.com",
    fitScore: 45,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Data engineer with 3 years of experience building ETL pipelines and data warehouses. Top strength is SQL and dbt expertise. Gap is limited software engineering depth — he has not shipped production application services and his Python is scripting-level.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate's data engineering skills partially overlap with the role's requirements but the application development and systems design experience is thin. He would be a stronger fit for a data engineering or analytics engineering role.",
    resumeData: {
      summary:
        "Data engineer with 3 years of experience designing ETL pipelines and data warehouse infrastructure. Proficient in SQL, dbt, and Airflow with a focus on data quality and pipeline reliability.",
      experience: [
        {
          role: "Data Engineer",
          company: "Revolut",
          duration: "2022 – Present",
          bullets: [
            "Built and maintained 120+ dbt models powering core business metrics for 500+ internal stakeholders",
            "Designed Airflow DAGs for real-time transaction enrichment pipeline processing 10M rows per day",
            "Reduced data freshness SLA for key financial metrics from 6 hours to 45 minutes",
          ],
        },
        {
          role: "Analytics Engineer",
          company: "Monzo",
          duration: "2021 – 2022",
          bullets: [
            "Migrated 80 legacy SQL scripts to dbt, adding documentation and automated data quality tests",
            "Built Looker dashboard for fraud team reducing manual reporting by 8 hours per week",
          ],
        },
      ],
      skills: ["SQL", "dbt", "Python (scripting)", "Airflow", "Snowflake", "BigQuery", "Looker"],
      education: "B.S. Information Systems, University of Manchester, 2021",
    },
  },
  {
    id: "5",
    name: "Aisha Williams",
    email: "aisha@email.com",
    fitScore: 43,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Marketing background with some technical exposure. Career pivot in progress with self-taught Python skills. Does not yet meet the technical bar for this role but shows strong communication skills.",
    resumeUrl: "#",
    assessmentReason:
      "Rated amber because candidate is mid-career pivot with demonstrated initiative in self-teaching. Current technical depth is below the minimum bar, but trajectory is positive. Not ready for this role today but worth tracking in 12 months.",
    resumeData: {
      summary:
        "Marketing professional pivoting to software engineering with 2 years of self-directed technical learning. Background in growth marketing with emerging Python and SQL skills.",
      experience: [
        {
          role: "Growth Marketing Manager",
          company: "Klaviyo",
          duration: "2021 – Present",
          bullets: [
            "Managed $2M annual digital ad budget across Google, Meta, and LinkedIn with 3.2x blended ROAS",
            "Built automated reporting dashboards in Looker and Python scripts for campaign performance analysis",
            "Completed 3 technical side projects: a web scraper, a Flask REST API, and a PostgreSQL analytics database",
          ],
        },
        {
          role: "Marketing Analyst",
          company: "HubSpot",
          duration: "2019 – 2021",
          bullets: [
            "Ran attribution modelling using SQL and Python to inform $5M annual channel allocation",
            "Automated weekly executive report reducing prep time from 6 hours to 30 minutes",
          ],
        },
      ],
      skills: ["Python (beginner)", "SQL", "Excel", "Looker", "Google Analytics", "Figma"],
      education: "B.A. Communications, Boston University, 2019",
    },
  },
  {
    id: "16",
    name: "Chris Thompson",
    email: "chris.t@email.com",
    fitScore: 38,
    status: "SCORED",
    stage: "Rejected",
    notes: "",
    brief:
      "Junior developer with 1 year of professional experience after a bootcamp. Solid fundamentals and enthusiasm, but significantly below the experience level required for this role. Would need 3-4 years before becoming a candidate for a senior position.",
    resumeUrl: "#",
    assessmentReason:
      "Rated red because candidate's experience level is significantly below the minimum bar for this role. One year of professional experience versus the 5+ years typically required makes this a clear mismatch in seniority. Not recommended for advancement.",
    resumeData: {
      summary:
        "Junior software developer with 1 year of professional experience following a coding bootcamp. Focused on Python web development with a strong growth mindset.",
      experience: [
        {
          role: "Junior Software Developer",
          company: "Makers Academy (alumni project)",
          duration: "2025 – Present",
          bullets: [
            "Built a Django-based task management app with user authentication and PostgreSQL persistence",
            "Contributed bug fixes to an open-source Python linting library with 500 GitHub stars",
          ],
        },
        {
          role: "Bootcamp Project",
          company: "General Assembly",
          duration: "2024 (12 weeks)",
          bullets: [
            "Completed 3 capstone projects: a REST API in Flask, a React frontend, and a simple SQL analytics dashboard",
          ],
        },
      ],
      skills: ["Python", "Django", "JavaScript", "React", "PostgreSQL", "Git"],
      education: "General Assembly Software Engineering Immersive, 2024; B.A. History, Leeds University, 2022",
    },
  },
  {
    id: "17",
    name: "Maria Santos",
    email: "maria.s@email.com",
    fitScore: 32,
    status: "SCORED",
    stage: "Rejected",
    notes: "",
    brief:
      "Operations manager attempting a transition into software engineering. Current technical skills are at hobbyist level — she has completed online courses but has no professional coding experience. Does not meet the minimum bar for this role.",
    resumeUrl: "#",
    assessmentReason:
      "Rated red because candidate has no professional software engineering experience and the technical skills listed are self-assessed from online courses. The gap between her current capabilities and the role requirements is too large to bridge without significant additional preparation.",
    resumeData: {
      summary:
        "Operations manager with 5 years of experience pursuing a career transition into software development. Completed Python, SQL, and web development courses online while working full-time.",
      experience: [
        {
          role: "Senior Operations Manager",
          company: "DHL",
          duration: "2020 – Present",
          bullets: [
            "Managed logistics operations for a regional hub processing 50K parcels per day across a team of 80",
            "Built Excel VBA automation reducing daily reporting time by 4 hours across the operations team",
            "Completed Python for Data Science and Full Stack Web Development courses on Coursera",
          ],
        },
        {
          role: "Operations Analyst",
          company: "Amazon Logistics",
          duration: "2018 – 2020",
          bullets: [
            "Used SQL to query operational databases and generate weekly performance dashboards",
            "Identified process improvement reducing mis-sort rate by 18%",
          ],
        },
      ],
      skills: ["SQL (basic)", "Python (beginner)", "Excel/VBA", "Operations Management", "Lean Six Sigma"],
      education: "B.B.A. Operations Management, University of São Paulo, 2018",
    },
  },
  {
    id: "18",
    name: "Ben Harrington",
    email: "ben.h@email.com",
    fitScore: 27,
    status: "SCORED",
    stage: "Shortlisted",
    notes: "",
    brief:
      "Recent CS graduate with no professional experience beyond a single short internship. Academic knowledge is present but the role requires production-grade engineering experience. Strong candidate for an entry-level or graduate scheme, but not this role.",
    resumeUrl: "#",
    assessmentReason:
      "Rated red because candidate is a fresh graduate with minimal industry exposure. The role requires at least 3-5 years of professional experience with distributed systems. Would be worth re-evaluating once he has 2+ years of full-time engineering experience.",
    resumeData: {
      summary:
        "Recent computer science graduate with strong academic foundations in algorithms, systems programming, and web development. Seeking first full-time software engineering role.",
      experience: [
        {
          role: "Software Engineering Intern",
          company: "Accenture",
          duration: "Summer 2025 (3 months)",
          bullets: [
            "Contributed to internal CRUD application in Java Spring Boot as part of a 12-person intern cohort",
            "Wrote unit tests achieving 75% code coverage for assigned modules",
          ],
        },
        {
          role: "CS Final Year Project",
          company: "University of Bristol",
          duration: "2024 – 2025",
          bullets: [
            "Built a distributed key-value store in Python as a university dissertation project",
            "Implemented Raft consensus algorithm from scratch with 1,200 lines of Python",
          ],
        },
      ],
      skills: ["Python", "Java", "C++", "SQL", "Git", "Linux"],
      education: "B.Sc. Computer Science (First Class Honours), University of Bristol, 2025",
    },
  },
  {
    id: "19",
    name: "Chloe Martin",
    email: "chloe.m@email.com",
    fitScore: 19,
    status: "SCORED",
    stage: "Rejected",
    notes: "",
    brief:
      "HR professional with no software engineering background. It is unclear why this application was submitted for a technical role. Does not meet any of the core requirements.",
    resumeUrl: "#",
    assessmentReason:
      "Rated red because candidate has no technical background relevant to this role. Her entire professional experience is in HR and people operations. This appears to be a misdirected application — she would not be able to perform the core functions of this position.",
    resumeData: {
      summary:
        "People operations professional with 6 years of experience in HR, talent acquisition, and employee experience at technology companies.",
      experience: [
        {
          role: "HR Business Partner",
          company: "Zalando",
          duration: "2022 – Present",
          bullets: [
            "Supported 200-person engineering division on performance management, compensation, and talent planning",
            "Reduced time-to-hire for engineering roles from 62 days to 38 days through process improvements",
            "Implemented new HRIS system (Workday) for 3,000 European employees",
          ],
        },
        {
          role: "Talent Acquisition Specialist",
          company: "Delivery Hero",
          duration: "2019 – 2022",
          bullets: [
            "Recruited 80+ software engineers and data scientists across Berlin and Amsterdam offices",
            "Built technical screening rubric for engineering roles in partnership with CTO office",
          ],
        },
      ],
      skills: ["Workday", "Greenhouse", "Excel", "Google Workspace", "Stakeholder Management"],
      education: "B.A. Human Resources Management, Freie Universität Berlin, 2019",
    },
  },
  {
    id: "20",
    name: "Tom Baker",
    email: "tom.b@email.com",
    fitScore: 12,
    status: "SCORED",
    stage: "Rejected",
    notes: "",
    brief:
      "Dental surgeon with no technology industry background. Application appears to be a test submission or system error. No relevant skills or experience for a software engineering role.",
    resumeUrl: "#",
    assessmentReason:
      "Rated red because candidate is a practising dentist with zero overlap with the technical requirements of this role. There are no transferable skills present that would be applicable to software engineering. Recommend no further review.",
    resumeData: {
      summary:
        "Experienced dental surgeon with 8 years of clinical practice. Exploring a career change into technology, motivated by interest in digital health and medical software.",
      experience: [
        {
          role: "Principal Dentist",
          company: "Baker Dental Practice",
          duration: "2017 – Present",
          bullets: [
            "Operated an independent dental practice serving 1,200 registered patients",
            "Implemented digital X-ray and patient management software, reducing admin time by 3 hours per day",
            "Completed an online JavaScript course (20 hours) out of personal interest in tech",
          ],
        },
        {
          role: "Associate Dentist",
          company: "NHS Dental Service",
          duration: "2015 – 2017",
          bullets: ["Provided primary dental care to a panel of 900 NHS patients"],
        },
      ],
      skills: ["Patient Management Software", "Digital X-Ray Systems", "Microsoft Office", "Basic JavaScript (self-taught)"],
      education: "BDS (Bachelor of Dental Surgery), King's College London, 2015",
    },
  },
];
