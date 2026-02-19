/**
 * Authentication Utilities
 *
 * Demonstrates to interns:
 * 1. JWT (JSON Web Tokens) — a signed, stateless token that proves identity
 * 2. Web Crypto API — built-in browser/Node.js/Edge cryptography
 * 3. HTTP-only cookies — the secure way to store auth tokens on the client
 *
 * JWT structure:  header.payload.signature
 *   - header:    algorithm used (HS256)
 *   - payload:   the user data we want to embed (userId, role, etc.)
 *   - signature: HMAC of header+payload using our secret — proves authenticity
 */

import { SignJWT, jwtVerify } from "jose";

// ─── Secret Key ────────────────────────────────────────────────────────────────
// In production: store this in an environment variable and make it long + random
// e.g. openssl rand -base64 32
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "demo-secret-key-for-interns-change-in-production"
);

// ─── Types ─────────────────────────────────────────────────────────────────────
/** The data we embed inside every JWT — this is readable by anyone who has the token! */
export interface AuthPayload {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

/** Name of the HTTP-only cookie that stores the token */
export const COOKIE_NAME = "auth-token";

// ─── Token Operations ──────────────────────────────────────────────────────────

/**
 * Signs a new JWT with the given payload.
 * The token expires after 24 hours.
 */
export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT and returns its payload.
 * Returns null if the token is invalid, tampered with, or expired.
 */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthPayload;
  } catch {
    // Token is expired or invalid
    return null;
  }
}

// ─── Password Hashing ──────────────────────────────────────────────────────────

/**
 * Hashes a password with SHA-256 + a fixed salt.
 *
 * ⚠️  NOTE FOR INTERNS (important security lesson):
 *     In production NEVER use SHA-256 for passwords!
 *     Use bcrypt, Argon2, or scrypt instead.
 *     Why? Those algorithms are intentionally slow, making brute-force attacks
 *     impractical. SHA-256 is too fast — an attacker can try billions per second.
 *     We use it here only because it works in Edge Runtime without extra packages.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = "demo-intern-salt"; // In production: generate a random per-user salt
  const data = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Checks a plain-text password against a stored hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
