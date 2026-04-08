import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type Props = { onHamburgerClick: () => void };

export default function MobileNavbar({ onHamburgerClick }: Props) {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-[52px] bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4">
      {/* Hamburger */}
      <button
        onClick={onHamburgerClick}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors -ml-1"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Wordmark */}
      <span className="text-sm font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">
        ApplyAI
      </span>

      {/* Avatar + dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold flex items-center justify-center"
          aria-label="Account menu"
        >
          KK
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={() => logout()}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
