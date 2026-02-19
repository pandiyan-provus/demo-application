/**
 * Next.js Middleware — Route Protection
 *
 * Demonstrates to interns:
 * 1. Middleware in Next.js runs BEFORE every matched request — great for auth guards
 * 2. Edge Runtime: middleware runs in a lightweight V8 isolate (no Node.js APIs)
 *    That's why we use `jose` (Edge-compatible) rather than `jsonwebtoken` (Node-only)
 * 3. Authentication  vs  Authorization:
 *    - Authentication: "Who are you?"  → verified by the JWT
 *    - Authorization:  "What can you do?" → checked per-route / per-action
 *
 * Flow:
 *   Request comes in
 *     ↓
 *   Is this a protected route? (/home/...)
 *     ↓ yes                       ↓ no
 *   Valid JWT cookie?          Is this a auth route? (/login, /signup)
 *     ↓ yes      ↓ no            ↓ yes              ↓ no
 *   Allow      Redirect to    Already logged in?    Allow
 *              /login         ↓ yes      ↓ no
 *                           Redirect   Allow
 *                           to /home
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

/** Pages that require a valid session to access */
const PROTECTED_ROUTES = ["/home"];

/**
 * Pages that should redirect to /home when ALREADY authenticated.
 * (No point showing a login form if you're already logged in.)
 */
const AUTH_ONLY_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read and verify the JWT stored in the auth cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;
  const isAuthenticated = !!user;

  // ── Guard: protected routes ─────────────────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Pass the original destination so we can redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Guard: logged-in user should not see login/signup pages ─────────────────
  const isAuthRoute = AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// ── Matcher ─────────────────────────────────────────────────────────────────────
// Tell Next.js which paths this middleware should run on.
// Using specific patterns avoids running middleware on every static asset.
export const config = {
  matcher: ["/home/:path*", "/login", "/signup"],
};
