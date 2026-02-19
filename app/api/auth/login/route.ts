/**
 * Login API Route
 * POST /api/auth/login
 *
 * Steps:
 *  1. Validate the request body with Zod
 *  2. Look up the user by email
 *  3. Verify the password against the stored hash
 *  4. Sign a JWT and set it in an HTTP-only cookie
 *
 * HTTP-only cookies are the recommended way to store auth tokens:
 *  - JavaScript cannot read them (XSS-safe)
 *  - The browser sends them automatically on every request (CSRF needs SameSite)
 */

import { z } from "zod";
import { findUserByEmail } from "@/lib/users-store";
import { verifyPassword, signToken, COOKIE_NAME, type AuthPayload } from "@/lib/auth";

// Zod schema for the request body
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request): Promise<Response> {
  try {
    // Step 1 — Validate input
    const body = await req.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Step 2 — Find user
    const user = await findUserByEmail(email);

    // Step 3 — Verify password
    // SECURITY NOTE: We return the SAME error whether the email doesn't exist
    // or the password is wrong. This prevents "email enumeration" attacks where
    // an attacker could discover which emails are registered.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Step 4 — Issue JWT
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = await signToken(payload);

    // Set the token in an HTTP-only cookie (24 hours)
    const cookieValue = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`;

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieValue,
        },
      }
    );
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
