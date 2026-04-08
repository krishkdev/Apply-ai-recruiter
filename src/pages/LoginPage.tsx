import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold leading-none">A</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">ApplyAI</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl px-8 py-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-7">Sign in to your recruiter dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="········"
                className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ApplyAI is currently in private beta.
        </p>
      </div>
    </div>
  );
}
