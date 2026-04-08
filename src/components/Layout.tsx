import { useState, useEffect, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when resizing to tablet+
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile top navbar */}
      <MobileNavbar onHamburgerClick={() => setMobileOpen(true)} />

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pt-[52px] md:pt-0">
        {children}
      </div>
    </div>
  );
}
