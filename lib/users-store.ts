/**
 * In-Memory User Store
 *
 * Demonstrates to interns:
 * 1. How a user record is typically structured (id, email, passwordHash, role)
 * 2. Role-Based Access Control (RBAC) — different roles have different permissions
 * 3. Why we NEVER store plain-text passwords — only hashes
 *
 * ─── Demo Credentials ──────────────────────────────────────────────────────
 *   admin@example.com  /  password123   →  role: admin  (can create users)
 *   user@example.com   /  password123   →  role: user   (read-only)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * NOTE: This is an in-memory store — data resets on server restart.
 *       In production you would use a real database (PostgreSQL, MongoDB, etc.)
 *       and an ORM like Prisma or Drizzle.
 */

import { hashPassword } from "./auth";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "user";

export interface StoredUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string; // We NEVER store the plain-text password
  role: UserRole;
  createdAt: string;
}

// ─── Global Store ──────────────────────────────────────────────────────────────
// We attach the store to `globalThis` so it survives Next.js hot-reloads in dev.
// Without this, the server would forget all users every time you save a file!
declare global {
  // eslint-disable-next-line no-var
  var __usersStore: StoredUser[] | undefined;
  // eslint-disable-next-line no-var
  var __usersNextId: number | undefined;
  // eslint-disable-next-line no-var
  var __usersStoreReady: boolean | undefined;
}

async function initStore(): Promise<void> {
  if (globalThis.__usersStoreReady) return;

  globalThis.__usersStore = globalThis.__usersStore ?? [];
  globalThis.__usersNextId = globalThis.__usersNextId ?? 3;

  if (globalThis.__usersStore.length === 0) {
    // Seed two demo users so interns can log in immediately
    const hash = await hashPassword("password123");
    globalThis.__usersStore.push(
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: hash,
        role: "admin",
        createdAt: "2025-01-01",
      },
      {
        id: 2,
        name: "Regular User",
        email: "user@example.com",
        passwordHash: hash,
        role: "user",
        createdAt: "2025-01-01",
      }
    );
  }

  globalThis.__usersStoreReady = true;
}

// ─── CRUD Operations ───────────────────────────────────────────────────────────

export async function getUsers(): Promise<StoredUser[]> {
  await initStore();
  return globalThis.__usersStore!;
}

export async function findUserByEmail(
  email: string
): Promise<StoredUser | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(
  id: number
): Promise<StoredUser | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}): Promise<StoredUser> {
  await initStore();
  const user: StoredUser = {
    id: globalThis.__usersNextId!++,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role ?? "user",
    createdAt: new Date().toISOString().split("T")[0],
  };
  globalThis.__usersStore!.push(user);
  return user;
}
