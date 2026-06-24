// ── /plexusadmin auth ──
// One secret passcode (env PLEXUS_ADMIN_PASSCODE) unlocks the admin. On success
// we set a signed, httpOnly session cookie (HMAC over an expiry) so the passcode
// itself is never stored in the browser and can't be replayed after it expires.

import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "plexus_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return (
    process.env.PLEXUS_ADMIN_SECRET ||
    process.env.PLEXUS_ADMIN_PASSCODE ||
    "plexus-dev-secret-change-me"
  );
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function makeToken(): string {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

function tokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (sign(exp) !== sig) return false;
  return Number(exp) > Date.now();
}

export function checkPasscode(input: string): boolean {
  const real = process.env.PLEXUS_ADMIN_PASSCODE || "";
  if (!real) return false;
  // constant-time compare
  const a = Buffer.from(input);
  const b = Buffer.from(real);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function startSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isLoggedIn(): Promise<boolean> {
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value);
}
