// ── The Desk — one calm screen for the whole Plexus deal flow ──
// PLEXUS WIRED Phase 1 (2026-07-22). Read-only by design: it renders what the
// ledger (`documents`), the C Hub board (`chubOrders`) and the live portals
// (`projects`) already say — writing still happens through those systems.
// Unanswered offers are NORMAL pipeline (anahata's standing rule): they are
// listed quietly, never flagged. Only real promises (deadlines) get color.

export type DeskDoc = {
  number: string;
  type: string;
  status: "draft" | "sent" | "paid";
  clientName: string;
  date: string;
  what: string;
  total: number;
  linkedBuild?: string;
  warning?: string;
};

export type DeskJob = {
  id: string;
  clientName: string;
  jobCode: string;
  complexity: string;
  urgent: boolean;
  deadline: string | null;
  suggestedPriceJOD: number | null;
  priceJOD: number | null;
  offerNumber?: string;
  offerPrice?: number;
  marginPct?: number;
  invoiceNumber?: string;
  laythNotes?: string;
};

export type DeskPortal = {
  slug: string;
  title: string;
  clientName: string;
  pct: number;
  now: string;
};

export type DeskDeadline = {
  label: string;
  date: string;
  daysLeft: number;
  source: string;
};

export type DeskData = {
  collected: number;
  openOffers: number;
  drafts: number;
  deadlines: DeskDeadline[];
  paidDocs: DeskDoc[];
  sentDocs: DeskDoc[];
  draftDocs: DeskDoc[];
  jobs: DeskJob[];
  portals: DeskPortal[];
  generatedAt: string;
};

const jd = (n: number) =>
  "JD " + (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

function Tile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</div>
      <div className={`mt-1 font-serif text-xl ${accent ? "text-[#c97f45]" : "text-white/90"}`}>
        {value}
      </div>
    </div>
  );
}

function DocRow({ d }: { d: DeskDoc }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-white/[0.06] py-2 last:border-0">
      <span className="w-36 shrink-0 font-mono text-[11px] text-white/40">{d.number}</span>
      <span className="min-w-40 flex-1 text-sm text-white/85">
        {d.clientName || "—"}
        <span className="ml-2 text-[12px] text-white/40">{d.what}</span>
      </span>
      {d.linkedBuild ? (
        <a
          href={`/live/${d.linkedBuild}`}
          className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/50"
        >
          portal
        </a>
      ) : null}
      {d.warning ? (
        <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[11px] text-red-300">
          ⚠ {d.warning}
        </span>
      ) : null}
      <span className="font-mono text-[11px] text-white/35">{d.date}</span>
      <span className="w-24 shrink-0 text-right font-mono text-sm tabular-nums text-white/90">
        {jd(d.total)}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 font-serif text-[15px] tracking-wide text-[#c97f45]">{title}</h2>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">{children}</div>
    </section>
  );
}

export function DeskView({ data }: { data: DeskData }) {
  return (
    <main className="min-h-screen bg-[#0d0b08] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl tracking-wide">
              The Desk <span className="text-[#c97f45]">· Plexus</span>
            </h1>
            <p className="mt-1 text-[12px] text-white/40">
              The whole deal flow on one screen — ledger · C Hub · portals. Read-only.
            </p>
          </div>
          <a href="/plexusadmin" className="text-[12px] text-white/45 underline-offset-2 hover:underline">
            ← admin
          </a>
        </header>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Collected" value={jd(data.collected)} accent />
          <Tile label="Open offers" value={jd(data.openOffers)} />
          <Tile label="Drafts" value={jd(data.drafts)} />
          <Tile label="Deadlines" value={String(data.deadlines.length)} />
        </div>

        {data.deadlines.length > 0 && (
          <Section title="Promises — the dates that matter">
            {data.deadlines.map((dl) => (
              <div
                key={dl.label + dl.date}
                className="flex flex-wrap items-baseline gap-x-3 border-b border-white/[0.06] py-2 last:border-0"
              >
                <span
                  className={`w-20 shrink-0 font-mono text-[12px] tabular-nums ${
                    dl.daysLeft <= 7 ? "text-red-300" : "text-white/60"
                  }`}
                >
                  {dl.daysLeft <= 0 ? "DUE" : `${dl.daysLeft}d left`}
                </span>
                <span className="flex-1 text-sm text-white/85">{dl.label}</span>
                <span className="text-[11px] text-white/40">{dl.source}</span>
                <span className="font-mono text-[12px] text-white/50">{dl.date}</span>
              </div>
            ))}
          </Section>
        )}

        <Section title={`C Hub — jobs with Layth (${data.jobs.length})`}>
          {data.jobs.map((j) => (
            <div
              key={j.id}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/[0.06] py-2 last:border-0"
            >
              <span className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                {j.jobCode}
              </span>
              <span className="min-w-40 flex-1 text-sm text-white/85">
                {j.clientName || "—"}
                {j.urgent ? (
                  <span className="ml-2 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] uppercase text-red-300">
                    urgent
                  </span>
                ) : null}
                {j.laythNotes ? (
                  <span className="ml-2 text-[11px] italic text-white/35">“{j.laythNotes}”</span>
                ) : null}
              </span>
              {j.deadline ? (
                <span className="font-mono text-[11px] text-amber-200/70">→ {j.deadline}</span>
              ) : null}
              <span className="font-mono text-[12px] tabular-nums text-white/60">
                {j.priceJOD != null ? `Layth ${jd(j.priceJOD)}` : "awaiting quote"}
              </span>
              {j.offerNumber ? (
                <span className="rounded bg-[#9c5b2c]/25 px-1.5 py-0.5 font-mono text-[11px] text-[#e0a877]">
                  {j.offerNumber} · {j.offerPrice != null ? jd(j.offerPrice) : ""}
                  {j.marginPct != null ? ` (+${j.marginPct}%)` : ""}
                </span>
              ) : null}
              {j.invoiceNumber ? (
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[11px] text-emerald-300">
                  {j.invoiceNumber}
                </span>
              ) : null}
            </div>
          ))}
        </Section>

        <Section title={`Builds in motion (${data.portals.length})`}>
          {data.portals.map((p) => (
            <div
              key={p.slug}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-white/[0.06] py-2 last:border-0"
            >
              <a
                href={`/live/${p.slug}`}
                className="min-w-40 flex-1 text-sm text-white/85 underline-offset-2 hover:underline"
              >
                {p.title}
              </a>
              <span className="text-[12px] text-white/45">{p.clientName}</span>
              <div className="h-1.5 w-28 overflow-hidden rounded bg-white/10">
                <div className="h-full bg-[#9c5b2c]" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="w-10 text-right font-mono text-[12px] tabular-nums text-white/60">
                {p.pct}%
              </span>
              {p.now ? <span className="w-full pl-0 text-[11px] text-white/35 sm:w-auto">{p.now}</span> : null}
            </div>
          ))}
        </Section>

        <Section title={`Paid — collected (${data.paidDocs.length})`}>
          {data.paidDocs.map((d) => (
            <DocRow key={d.number + d.clientName} d={d} />
          ))}
        </Section>

        <Section title={`Open offers — normal pipeline, no chasing (${data.sentDocs.length})`}>
          {data.sentDocs.map((d) => (
            <DocRow key={d.number + d.clientName} d={d} />
          ))}
        </Section>

        <Section title={`Drafts — not sent yet (${data.draftDocs.length})`}>
          {data.draftDocs.map((d) => (
            <DocRow key={d.number + d.clientName} d={d} />
          ))}
        </Section>

        <p className="mt-8 text-center text-[11px] text-white/25">
          Generated {data.generatedAt} · PLEXUS WIRED · offers register via scripts/register-doc.mjs
        </p>
      </div>
    </main>
  );
}
