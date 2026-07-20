import { NextResponse, type NextRequest } from "next/server";

// Narrowly scoped: chub.plexusworkshop.com is a separate DNS host pointed at
// this same Vercel deployment (see lib/chub/** / app/chub/**), but Next.js
// still resolves "/" to the normal marketing homepage unless we rewrite it.
// This only touches requests to that one host's root path — everything else
// (the main site, /api/**, static assets, other hosts) is untouched.
const CHUB_HOST = "chub.plexusworkshop.com";

export default function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host === CHUB_HOST && req.nextUrl.pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/chub";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
