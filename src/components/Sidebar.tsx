import { useState, useEffect, useRef, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "sidebar_collapsed";

// ── Icons ─────────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="5.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 5.5V4.5a2.5 2.5 0 0 1 5 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 4.5a2 2 0 0 1 0 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.5 10c1.38.5 2.5 1.74 2.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2" width="3.5" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6.25" y="2" width="3.5" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="2" width="3.5" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="8.5" width="3" height="5.5" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6.5" y="4.5" width="3" height="9.5" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.5" y="2" width="3" height="12" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.92.92M11.68 11.68l.92.92M3.4 12.6l.92-.92M11.68 4.32l.92-.92"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Tooltip wrapper ───────────────────────────────────────────────────────────

function NavTooltip({ label, show, children }: { label: string; show: boolean; children: ReactNode }) {
  if (!show) return <>{children}</>;
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-50">
        {label}
      </div>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────

type NavItemConfig = { label: string; to: string; icon: ReactNode; accent: string };

const MAIN_ITEMS: NavItemConfig[] = [
  { label: "Dashboard",  to: "/dashboard",  icon: <GridIcon />,      accent: "border-gray-800"    },
  { label: "Jobs",       to: "/jobs",        icon: <BriefcaseIcon />, accent: "border-blue-500"    },
  { label: "Candidates", to: "/candidates",  icon: <PeopleIcon />,    accent: "border-violet-500"  },
  { label: "Pipeline",   to: "/pipeline",    icon: <KanbanIcon />,    accent: "border-indigo-500"  },
  { label: "Analytics",  to: "/analytics",   icon: <BarChartIcon />,  accent: "border-emerald-500" },
];

const SETTINGS_ITEM: NavItemConfig = {
  label: "Settings", to: "/settings", icon: <GearIcon />, accent: "border-gray-500",
};

// ── Nav item renderer ─────────────────────────────────────────────────────────

function NavItem({ item, isExpanded }: { item: NavItemConfig; isExpanded: boolean }) {
  return (
    <NavTooltip label={item.label} show={!isExpanded}>
      <NavLink
        to={item.to}
        end={item.to === "/dashboard"}
        className={({ isActive }) =>
          `flex items-center gap-3 px-2 py-2.5 rounded-md text-sm transition-colors border-l-2 ${
            isActive
              ? `bg-gray-100 text-gray-900 font-medium ${item.accent}`
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`
        }
      >
        <span className="shrink-0">{item.icon}</span>
        {isExpanded && <span className="truncate">{item.label}</span>}
      </NavLink>
    </NavTooltip>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

type Props = { mobileOpen: boolean; onMobileClose: () => void };

export default function Sidebar({ mobileOpen, onMobileClose }: Props) {
  const { logout } = useAuth();

  const [desktopCollapsed, setDesktopCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );
  // Track whether we're on desktop (≥1024px) to compute isExpanded correctly
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(desktopCollapsed));
  }, [desktopCollapsed]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (logoutRef.current && !logoutRef.current.contains(e.target as Node)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Expanded = mobile drawer open OR desktop expanded
  const isExpanded = mobileOpen || (isDesktop && !desktopCollapsed);

  const toggleDesktop = () => setDesktopCollapsed((c) => !c);

  // Width: mobile overlay = 220px, tablet always 52px, desktop based on state
  const widthClass = isExpanded && !mobileOpen
    ? "w-[220px] md:w-[52px] lg:w-[220px]"   // desktop expanded
    : "w-[220px] md:w-[52px]";                // mobile drawer / tablet / desktop collapsed

  return (
    <aside
      className={[
        "flex flex-col bg-white border-r border-gray-200 shrink-0",
        "h-full md:h-screen",
        // Position: overlay on mobile, in-flow on tablet+
        "fixed md:relative",
        "inset-y-0 left-0 md:inset-auto",
        "z-50 md:z-auto",
        // Slide animation on mobile, width transition on desktop
        "transition-all duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        widthClass,
      ].join(" ")}
    >
      {/* ── Header ── */}
      <div className="flex items-center h-14 px-3 border-b border-gray-100 gap-2 shrink-0">
        <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold leading-none">A</span>
        </div>
        {isExpanded && (
          <span className="text-sm font-semibold text-gray-900 truncate flex-1">ApplyAI</span>
        )}
        {/* Toggle: desktop only */}
        <button
          onClick={isDesktop ? toggleDesktop : onMobileClose}
          className={`hidden lg:flex text-gray-400 hover:text-gray-600 transition-colors shrink-0 ${
            isExpanded ? "ml-auto" : "mx-auto"
          }`}
          aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="md:hidden ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex flex-col flex-1 px-2 py-3 overflow-y-auto">
        <div className="space-y-0.5">
          {MAIN_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} isExpanded={isExpanded} />
          ))}
        </div>
        <div className="mt-auto pt-3">
          <NavItem item={SETTINGS_ITEM} isExpanded={isExpanded} />
        </div>
      </nav>

      {/* ── User ── */}
      <div className="px-2 py-3 border-t border-gray-100 relative shrink-0" ref={logoutRef}>
        <NavTooltip label="Krishnakumar" show={!isExpanded}>
          <button
            onClick={() => setShowLogout((s) => !s)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-semibold shrink-0">
              KK
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate leading-tight">Krishnakumar</p>
                <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">Recruiter · ApplyAI</p>
              </div>
            )}
          </button>
        </NavTooltip>

        {showLogout && (
          <div
            className={`absolute bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 ${
              isExpanded ? "left-2 right-2" : "left-2 w-36"
            }`}
          >
            <button
              onClick={() => logout()}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
