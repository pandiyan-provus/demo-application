/**
 * Current User API Route
 * GET /api/auth/me
 *
 * Reads the JWT from the cookie and returns the current user's info.
 * The client calls this on page load to find out WHO is currently logged in.
 *
 * This is a Server Component-compatible API — it uses next/headers to read
 * cookies from the incoming request.
 */

import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return Response.json({ error: "Token is invalid or expired" }, { status: 401 });
  }

  // Return only non-sensitive fields (never return the passwordHash!)
  return Response.json({
    id: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}
