import { useState } from "react";

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-5">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
      <div className="sm:w-40 shrink-0 sm:pt-1.5">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-8">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${on ? "bg-gray-900" : "bg-gray-200"}`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${on ? "translate-x-4" : ""}`}
        />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [name, setName]   = useState("Krishnakumar");
  const [email, setEmail] = useState("kk@applyai.co");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="max-w-[780px] mx-auto px-4 sm:px-8 py-6 sm:py-10">

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-0.5 text-sm text-gray-400">Manage your profile and workspace preferences</p>
      </div>

      {/* ── Profile ── */}
      <Section title="Profile" description="Your personal information">
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Full name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </Field>
          <Field label="Role" hint="Your role in the workspace">
            <input
              type="text"
              defaultValue="Recruiter"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </Field>
          <Field label="Company">
            <input
              type="text"
              defaultValue="ApplyAI"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="text-sm font-medium bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {saved ? "Saved!" : "Save changes"}
            </button>
          </div>
        </form>
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications" description="Control when and how you get notified">
        <Toggle label="New candidate scored"      description="When AI finishes scoring a new application"    defaultOn={true} />
        <Toggle label="Stage change"              description="When a candidate moves to a new pipeline stage" defaultOn={true} />
        <Toggle label="Weekly digest"             description="Summary of hiring activity every Monday"        defaultOn={false} />
        <Toggle label="Candidate notes"           description="When a teammate adds a note to a candidate"     defaultOn={false} />
      </Section>

      {/* ── Team ── */}
      <Section title="Team" description="Invite teammates to collaborate on hiring">
        <Field label="Invite by email">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="colleague@company.com"
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button className="text-sm font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors whitespace-nowrap">
              Send invite
            </button>
          </div>
        </Field>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Members</p>
          {[{ name: "Krishnakumar", email: "kk@applyai.co", role: "Admin" }].map((m) => (
            <div key={m.email} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-semibold">
                  KK
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5">{m.role}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Integrations ── */}
      <Section title="Integrations" description="Connect external tools">
        {[
          { name: "Greenhouse",  desc: "Sync candidates from your ATS",           connected: false },
          { name: "Slack",       desc: "Get notifications in your Slack workspace", connected: false },
          { name: "Google Meet", desc: "Auto-schedule interviews with candidates",  connected: false },
        ].map((int) => (
          <div key={int.name} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{int.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{int.desc}</p>
            </div>
            <button className="text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">
              Connect
            </button>
          </div>
        ))}
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white border border-red-100 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100">
          <h2 className="text-sm font-semibold text-red-600">Danger zone</h2>
        </div>
        <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Delete workspace</p>
            <p className="text-xs text-gray-400 mt-0.5">Permanently delete all jobs, candidates, and data</p>
          </div>
          <button className="self-start sm:self-auto text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors">
            Delete workspace
          </button>
        </div>
      </div>

    </main>
  );
}
