"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();

  return (
    <>
      {/* ── Auth top-bar ─────────────────────────────────────────────────── */}
      <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">TrainingHub</span>

        {loading ? (
          <span className="text-gray-500">Loading…</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            {/* Role badge — green for admin, gray for user */}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === "admin"
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-gray-600/40 text-gray-300 border border-gray-500/30"
                }`}
            >
              {user.role.toUpperCase()}
            </span>
            <span className="text-gray-300">{user.name}</span>
            <span className="text-gray-500 hidden sm:inline">{user.email}</span>

            {/* ── LOGOUT BUTTON ────────────────────────────────────────── */}
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>

      {children}
    </>
  );
}
