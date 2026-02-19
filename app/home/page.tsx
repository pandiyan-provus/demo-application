"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/composition/Card";
import { Layout } from "@/components/composition/Layout";
import { Header } from "@/components/composition/Header";
import { Sidebar } from "@/components/composition/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import type {
  UserResponse,
  CreateUserRequest,
  ErrorResponse
} from "@/app/api/users/models";

function DashboardContent() {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    email: "",
  });

  const [error, setError] = useState<ErrorResponse | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data: UserResponse[] = await res.json();
      setUsers(data);

    } catch {
      setError({ error: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data as ErrorResponse);
        return;
      }

      setSuccess(`User "${(data as UserResponse).name}" created successfully!`);
      setFormData({ name: "", email: "" });
      fetchUsers();
    } catch {
      setError({ error: "Network error" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Intern Training: Full-Stack TypeScript Concepts
        </h2>
        <p className="text-gray-700 mt-1">
          Component Composition + Typed API Routes + Zod Validation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── RBAC: Create User form — admins only ──────────────────────────── */}
        {isAdmin ? (
          <Card title="Create User (POST /api/users) — Admin Only">
            <p className="text-sm text-gray-600 mb-4">
              This form sends a <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">CreateUserRequest</code> to the API.
              Zod validates on the server!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (min 2 chars)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (must be valid)
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Enter email..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create User
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{error.error}</p>
                {error.details && (
                  <ul className="mt-2 text-sm text-red-600">
                    {error.details.map((d, i) => (
                      <li key={i}>
                        • {d.field}: {d.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">{success}</p>
              </div>
            )}
          </Card>
        ) : (
          <Card title="Create User (POST /api/users)">
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <span className="text-4xl">🔒</span>
              <p className="font-semibold text-gray-700">Admin access required</p>
              <p className="text-sm text-gray-500 text-center">
                Only <span className="font-mono bg-gray-100 px-1 rounded">admin</span> role users can create new users.
                You are logged in as <span className="font-mono bg-gray-100 px-1 rounded">user</span>.
              </p>
            </div>
          </Card>
        )}

        <Card title="Users List (GET /api/users)">
          <p className="text-sm text-gray-600 mb-4">
            Fetched from API with type <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">UserResponse[]</code>
          </p>

          {loading ? (
            <div className="text-center py-4 text-gray-600">Loading...</div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-3 bg-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Created: {user.createdAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-800">Composition</h4>
          <p className="text-sm text-blue-600 mt-1">
            Card, Layout, Header, Sidebar - reusable components
          </p>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <h4 className="font-semibold text-green-800">Typed APIs</h4>
          <p className="text-sm text-green-600 mt-1">
            GET/POST routes with typed Request & Response
          </p>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <h4 className="font-semibold text-purple-800">Models</h4>
          <p className="text-sm text-purple-600 mt-1">
            CreateUserRequest, UserResponse - clear contracts
          </p>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <h4 className="font-semibold text-orange-800">Zod</h4>
          <p className="text-sm text-orange-600 mt-1">
            Runtime validation + inferred types = safety
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout Header={Header} Sidebar={Sidebar}>
      <DashboardContent />
    </Layout>
  );
} 