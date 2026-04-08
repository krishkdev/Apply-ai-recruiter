import { Link } from "react-router-dom";

export type Crumb = {
  label: string;
  to?: string;
};

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-400 mb-8">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-gray-300">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="hover:text-gray-700 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
