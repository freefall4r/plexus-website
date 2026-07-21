// ── C Hub "owner mode" — anahata only, never Layth ──
// C Hub itself is one shared passcode (lib/chub/auth.ts) — the same trust
// level as a whiteboard between two people. Turning Layth's cost price into a
// client-facing quotation is NOT that: it's Plexus's margin, and it must stay
// on anahata's side of the wall.
//
// So owner mode reuses the /plexusadmin passcode — no second secret invented,
// and it's the same key that already guards the documents system this feature
// writes into. It can't just read the admin session cookie because C Hub is
// served from chub.plexusworkshop.com while the admin sits on www., and
// cookies don't cross subdomains; the passcode is therefore re-checked here
// and a separate, host-scoped, signed cookie is set for C Hub.

import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "chub_owner";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, same as the admin session

function secret(): string {
  return (
    process.env.PLEXUS_ADMIN_SECRET ||
    process.env.PLEXUS_ADMIN_PASSCODE ||
    "plexus-dev-secret-change-me"
  );
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(`chub:${value}`).digest("hex");
}

function makeToken(): string {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

function tokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = sign(exp);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(exp) > Date.now();
}

/** Constant-time check of the /plexusadmin passcode. */
export function checkOwnerPasscode(input: string): boolean {
  const real = process.env.PLEXUS_ADMIN_PASSCODE || "";
  if (!real || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(real);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function startOwnerSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endOwnerSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isOwner(): Promise<boolean> {
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value);
}
