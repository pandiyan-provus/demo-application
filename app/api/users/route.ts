/**
 * /api/users route — with Authentication & Authorization
 *
 * GET  /api/users  → any authenticated user (role: user or admin)
 * POST /api/users  → admin role ONLY
 *
 * Auth check flow:
 *   1. Read the JWT from the HTTP-only cookie using next/headers
 *   2. Verify the token with verifyToken()
 *   3. For POST: also check that role === "admin"
 */

import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import {
  CreateUserSchema,
  type CreateUserRequest,
  type UserResponse,
  type ErrorResponse,
} from "./models";

const users: UserResponse[] = [
  { id: 1, name: "Ravi Kumar", email: "ravi@example.com", createdAt: "2024-01-15" },
  { id: 2, name: "Priya Singh", email: "priya@example.com", createdAt: "2024-02-20" },
];

// ── Helper: read and verify auth from cookie ────────────────────────────────
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── GET /api/users ─────────────────────────────────────────────────────────
// Requires: authenticated (any role)
export async function GET(): Promise<Response> {
  const auth = await getAuthUser();
  if (!auth) {
    return Response.json({ error: "Unauthorized — please log in" }, { status: 401 });
  }

  return Response.json(users);
}

// ── POST /api/users ────────────────────────────────────────────────────────
// Requires: authenticated + role === "admin"
export async function POST(req: Request): Promise<Response> {
  const auth = await getAuthUser();

  // Authentication check
  if (!auth) {
    return Response.json({ error: "Unauthorized — please log in" }, { status: 401 });
  }

  // Authorization check (RBAC)
  if (auth.role !== "admin") {
    return Response.json(
      { error: "Forbidden — admin role required to create users" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const result = CreateUserSchema.safeParse(body);

    if (!result.success) {
      const errorResponse: ErrorResponse = {
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      };

      return Response.json(errorResponse, { status: 400 });
    }

    const validData: CreateUserRequest = result.data;

    const newUser: UserResponse = {
      id: users.length + 1,
      name: validData.name,
      email: validData.email,
      createdAt: new Date().toISOString().split("T")[0],
    };

    users.push(newUser);

    return Response.json(newUser, { status: 201 });
  } catch {
    const errorResponse: ErrorResponse = {
      error: "Invalid JSON body",
    };
    return Response.json(errorResponse, { status: 400 });
  }
}
