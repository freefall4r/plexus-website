// ── C Hub job sheet — shared passcode ──
// One passcode for the whole tool (anahata + Layth), not per-client. Deliberately
// not a "server-only" secret-env-var pattern like /live — it's the same trust
// level as a shared whiteboard between two people. Used by both the client gate
// (components/chub/ChubApp.tsx) and the API routes (app/api/chub/**) so the API
// isn't wide open even though the UI gate is simple.

export const CHUB_PASSCODE = "layth";

export function isValidChubPasscode(input: string | null | undefined): boolean {
  return (input || "").toString().trim().toLowerCase() === CHUB_PASSCODE;
}

export const CHUB_PASSCODE_HEADER = "x-chub-passcode";
