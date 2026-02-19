/**
 * Signup API Route
 * POST /api/auth/signup
 *
 * Creates a new user account and immediately logs them in by setting the
 * auth cookie — so they don't need to go back to the login page.
 *
 * New users always receive the "user" role (read-only).
 * Only an admin could promote someone to the "admin" role.
 */

import { z } from "zod";
import { findUserByEmail, createUser } from "@/lib/users-store";
import { hashPassword, signToken, COOKIE_NAME, type AuthPayload } from "@/lib/auth";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request): Promise<Response> {
  try {
    // Validate input
    const body = await req.json();
    const result = SignupSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check for duplicate email
    const existing = await findUserByEmail(email);
    if (existing) {
      return Response.json({ error: "Email is already in use" }, { status: 409 });
    }

    // Hash the password before storing
    const passwordHash = await hashPassword(password);

    // Create the user (always "user" role on self-registration)
    const user = await createUser({ name, email, passwordHash, role: "user" });

    // Auto-login: sign a token and set the cookie
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = await signToken(payload);
    const cookieValue = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`;

    return new Response(
      JSON.stringify({
        message: "Account created successfully",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      }),
      {
        status: 201,
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
