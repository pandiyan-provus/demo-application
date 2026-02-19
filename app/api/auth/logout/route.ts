/**
 * Logout API Route
 * POST /api/auth/logout
 *
 * Clears the authentication cookie.
 *
 * IMPORTANT NOTE FOR INTERNS (stateless JWTs):
 * JWTs are stateless — the server doesn't keep a list of "active" tokens.
 * So we can't truly "invalidate" a JWT on the server side without extra work
 * (e.g. a token blacklist stored in Redis).
 *
 * For this demo, we simply delete the cookie on the client.
 * The old token would technically still be valid until it expires (24h),
 * but since the browser no longer sends it, the user is effectively logged out.
 *
 * Production solution: short-lived tokens (15 min) + refresh tokens, or a
 * server-side session store.
 */

import { COOKIE_NAME } from "@/lib/auth";

export async function POST(): Promise<Response> {
  // Overwrite the cookie with an empty value and Max-Age=0 to delete it
  const clearCookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearCookie,
    },
  });
}
