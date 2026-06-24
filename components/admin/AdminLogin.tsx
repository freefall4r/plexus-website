"use client";

import { useState } from "react";

export function AdminLogin() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErr(
        data.error === "too_many_attempts"
          ? "Too many tries — wait a bit."
          : "Wrong passcode."
      );
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{ minHeight: "100dvh" }}
      className="flex flex-col items-center justify-center bg-neutral-950 px-6 text-neutral-100"
    >
      <div className="w-full max-w-xs text-center">
        <div className="mb-1 text-2xl font-semibold tracking-tight">Plexus Admin</div>
        <p className="mb-8 text-sm text-neutral-400">Enter your passcode</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={busy || !code}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-medium text-neutral-950 transition active:scale-[0.98] disabled:opacity-50"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
          {err && <p className="text-sm text-red-400">{err}</p>}
        </form>
      </div>
    </div>
  );
}
