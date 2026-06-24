"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n/context";
import { copy, pick } from "@/lib/fabrication/copy";
import { waLink, site } from "@/lib/config";
import {
  MATERIALS,
  THICKNESS,
  FINISHES,
  ACCEPTED_ATTR,
  MAX_FILE_BYTES,
  isAcceptedFile,
} from "@/lib/fabrication/options";
import type { FabricationService } from "@/lib/fabrication/types";
import type { FabricationTemplate } from "@/lib/fabrication/sanity";

const STEPS = 4;

export function OrderWizard({ templates }: { templates: FabricationTemplate[] }) {
  const { lang } = useLang();
  const p = (b: { en: string; ar: string }) => pick(lang, b);
  const params = useSearchParams();

  // ----- form state (prefilled from ?service= & ?template=) -----
  const initialTemplate = templates.find(
    (t) => t.slug === (params.get("template") || "")
  );
  const initialService = (params.get("service") as FabricationService) || initialTemplate?.service || "";

  const [step, setStep] = useState(0);
  const [service, setService] = useState<FabricationService | "">(initialService);
  const [source, setSource] = useState<"custom" | "template">(
    initialTemplate ? "template" : "custom"
  );
  const [templateId, setTemplateId] = useState<string>(initialTemplate?.slug || "");

  const [material, setMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [finish, setFinish] = useState("");
  const [notes, setNotes] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [waFallback, setWaFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const materials = service ? MATERIALS[service] : [];
  const thicknesses = service ? THICKNESS[service] : [];
  const templatesForService = useMemo(
    () => (service ? templates.filter((t) => t.service === service) : templates),
    [templates, service]
  );

  // ----- validation per step -----
  function validate(): boolean {
    setError("");
    if (step === 0) {
      if (!service) return fail(copy.wizard.needService);
      if (source === "template" && !templateId) return fail(copy.wizard.needTemplate);
    }
    if (step === 1 && !material) return fail(copy.wizard.needMaterial);
    if (step === 3 && (!name.trim() || (!whatsapp.trim() && !email.trim())))
      return fail(copy.wizard.needContact);
    return true;
  }
  function fail(b: { en: string; ar: string }) {
    setError(p(b));
    return false;
  }

  function next() {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, STEPS - 1));
  }
  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  // ----- files -----
  function addFiles(list: FileList | null) {
    if (!list) return;
    const ok: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size <= MAX_FILE_BYTES && isAcceptedFile(f.name)) ok.push(f);
    }
    setFiles((prev) => [...prev, ...ok].slice(0, 10));
  }

  // ----- WhatsApp fallback message -----
  function waMessage(): string {
    const lines = [
      "Plexus — On-demand fabrication order",
      `Service: ${service?.toUpperCase()}`,
      source === "template" ? `Design: ${templateId}` : "Custom design (files to send)",
      `Material: ${material}${thickness ? ` · ${thickness}` : ""}`,
      dimensions ? `Size: ${dimensions}` : "",
      `Quantity: ${quantity}`,
      finish ? `Finish: ${finish}` : "",
      notes ? `Notes: ${notes}` : "",
      `Name: ${name}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  // ----- submit -----
  async function submit() {
    if (!validate()) return;
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("service", service);
      fd.set("source", source);
      fd.set("templateId", templateId);
      fd.set("material", material);
      fd.set("thickness", thickness);
      fd.set("dimensions", dimensions);
      fd.set("quantity", String(quantity));
      fd.set("finish", finish);
      fd.set("notes", notes);
      fd.set("name", name);
      fd.set("whatsapp", whatsapp);
      fd.set("email", email);
      fd.set("lang", lang);
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/fabrication/order", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
      } else if (res.status === 503) {
        // Firebase not connected yet — fall back to WhatsApp hand-off.
        setWaFallback(true);
      } else {
        setError(p(copy.wizard.error));
      }
    } catch {
      setError(p(copy.wizard.error));
    } finally {
      setSubmitting(false);
    }
  }

  // ===== confirmation =====
  if (token) {
    const url = `${site.url}/fabrication/track/${token}`;
    return (
      <Shell lang={lang}>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-copper/15 text-copper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-4xl tracking-tight">{p(copy.wizard.doneTitle)}</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">{p(copy.wizard.doneBody)}</p>
          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-ink/15 bg-sand/40 px-4 py-2">
            <span className="truncate font-mono text-xs text-ink-soft">{url}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(url);
                setCopied(true);
              }}
              className="ml-auto shrink-0 rounded-full bg-ink px-3 py-1.5 text-xs text-bone"
            >
              {copied ? p(copy.wizard.copied) : p(copy.wizard.copy)}
            </button>
          </div>
          <Link
            href={`/fabrication/track/${token}`}
            className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-sm text-bone transition-colors hover:bg-copper"
          >
            {p(copy.wizard.doneTrack)}
          </Link>
        </div>
      </Shell>
    );
  }

  // ===== WhatsApp fallback =====
  if (waFallback) {
    return (
      <Shell lang={lang}>
        <div className="text-center">
          <h1 className="font-display text-4xl tracking-tight">{p(copy.wizard.waFallbackTitle)}</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">{p(copy.wizard.waFallbackBody)}</p>
          <a
            href={waLink(waMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-medium text-[#0b3d22] transition-opacity hover:opacity-90"
          >
            {p(copy.wizard.waSend)}
          </a>
        </div>
      </Shell>
    );
  }

  // ===== wizard =====
  return (
    <Shell lang={lang}>
      <div className="mb-8">
        <p className="overline text-copper">
          {p(copy.wizard.step)} {step + 1} {p(copy.wizard.of)} {STEPS}
        </p>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-copper" : "bg-ink/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1 — service + start point */}
      {step === 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight">{p(copy.wizard.s1title)}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(
                [
                  { id: "cnc", title: copy.wizard.cnc, hint: copy.wizard.cncHint },
                  { id: "laser", title: copy.wizard.laser, hint: copy.wizard.laserHint },
                  { id: "milling", title: copy.wizard.milling, hint: copy.wizard.millingHint },
                ] as const
              ).map((s) => (
                <Choice
                  key={s.id}
                  active={service === s.id}
                  title={p(s.title)}
                  hint={p(s.hint)}
                  onClick={() => {
                    setService(s.id);
                    setMaterial("");
                    setThickness("");
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl tracking-tight">{p(copy.wizard.start)}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Choice
                active={source === "custom"}
                title={p(copy.wizard.custom)}
                hint={p(copy.wizard.customHint)}
                onClick={() => {
                  setSource("custom");
                  setTemplateId("");
                }}
              />
              <Choice
                active={source === "template"}
                title={p(copy.wizard.template)}
                hint={p(copy.wizard.templateHint)}
                onClick={() => setSource("template")}
                disabled={templates.length === 0}
              />
            </div>

            {source === "template" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {templatesForService.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTemplateId(t.slug);
                      if (!service) setService(t.service);
                    }}
                    className={`overflow-hidden rounded-xl border text-start transition-colors ${
                      templateId === t.slug
                        ? "border-copper ring-1 ring-copper"
                        : "border-ink/15 hover:border-ink/40"
                    }`}
                  >
                    <div className="aspect-[4/3] bg-stone/20">
                      {t.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.imageUrl} alt={p({ en: t.title, ar: t.title_ar })} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="block p-3 text-sm">{p({ en: t.title, ar: t.title_ar })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2 — specs */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="font-display text-3xl tracking-tight">{p(copy.wizard.s2title)}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={p(copy.wizard.material)}>
              <select className={selectCls} value={material} onChange={(e) => setMaterial(e.target.value)}>
                <option value="">{p(copy.wizard.choose)}</option>
                {materials.map((m) => (
                  <option key={m.value} value={m.value}>
                    {p({ en: m.en, ar: m.ar })}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={p(service === "milling" ? copy.wizard.stock : copy.wizard.thickness)}>
              <select className={selectCls} value={thickness} onChange={(e) => setThickness(e.target.value)}>
                <option value="">{p(copy.wizard.choose)}</option>
                {thicknesses.map((t) => (
                  <option key={t.value} value={t.value}>
                    {p({ en: t.en, ar: t.ar })}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={p(copy.wizard.dimensions)}>
              <input className={inputCls} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder={p(copy.wizard.dimsPh)} />
            </Field>
            <Field label={p(copy.wizard.quantity)}>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </Field>
            <Field label={p(copy.wizard.finish)}>
              <select className={selectCls} value={finish} onChange={(e) => setFinish(e.target.value)}>
                <option value="">{p(copy.wizard.choose)}</option>
                {FINISHES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {p({ en: f.en, ar: f.ar })}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label={p(copy.wizard.notes)}>
            <textarea rows={3} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={p(copy.wizard.notesPh)} />
          </Field>
        </div>
      )}

      {/* STEP 3 — files */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-display text-3xl tracking-tight">{p(copy.wizard.s3title)}</h2>
          <div
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-ink/20 bg-sand/30 px-6 py-12 text-center transition-colors hover:border-copper hover:bg-sand/60"
          >
            <p className="font-display text-xl tracking-tight">{p(copy.wizard.drop)}</p>
            <p className="mt-2 text-sm text-ink-soft">{p(copy.wizard.fileHint)}</p>
            {source === "template" && (
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-copper">
                {p(copy.wizard.optionalFiles)}
              </p>
            )}
            <input
              ref={fileInput}
              type="file"
              multiple
              accept={ACCEPTED_ATTR}
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>
          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-bone px-4 py-3">
                  <span className="truncate text-sm">{f.name}</span>
                  <span className="ml-auto shrink-0 font-mono text-xs text-ink-soft">
                    {Math.round(f.size / 1024)} KB
                  </span>
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="shrink-0 text-xs text-copper hover:underline"
                  >
                    {p(copy.wizard.remove)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* STEP 4 — contact + review */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-display text-3xl tracking-tight">{p(copy.wizard.s4title)}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={p(copy.wizard.name)}>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label={p(copy.wizard.whatsapp)}>
              <input className={inputCls} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel" placeholder="+962…" />
            </Field>
            <Field label={p(copy.wizard.email)}>
              <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" type="email" />
            </Field>
          </div>
          <p className="text-sm text-ink-soft">{p(copy.wizard.contactNote)}</p>

          {/* review */}
          <div className="mt-2 rounded-2xl border border-ink/10 bg-sand/40 p-5 text-sm">
            <p className="overline text-copper">{p(copy.wizard.review)}</p>
            <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              <Row
                k={p(copy.wizard.s1title)}
                v={
                  service
                    ? p(service === "cnc" ? copy.wizard.cnc : service === "laser" ? copy.wizard.laser : copy.wizard.milling)
                    : "—"
                }
              />
              <Row k={p(copy.wizard.material)} v={[material, thickness].filter(Boolean).join(" · ") || "—"} />
              <Row k={p(copy.wizard.quantity)} v={String(quantity)} />
              <Row k={p(copy.wizard.s3title)} v={String(files.length)} />
            </dl>
          </div>
        </div>
      )}

      {error && <p className="mt-5 text-sm text-red-700">{error}</p>}

      {/* nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="rounded-full border border-ink/20 px-6 py-3 text-sm transition-colors enabled:hover:border-ink enabled:hover:bg-ink/5 disabled:opacity-0"
        >
          {p(copy.wizard.back)}
        </button>
        {step < STEPS - 1 ? (
          <button onClick={next} className="rounded-full bg-ink px-7 py-3 text-sm text-bone transition-colors hover:bg-copper">
            {p(copy.wizard.next)}
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-ink px-7 py-3 text-sm text-bone transition-colors hover:bg-copper disabled:opacity-60"
          >
            {submitting ? p(copy.wizard.submitting) : p(copy.wizard.submit)}
          </button>
        )}
      </div>
    </Shell>
  );
}

// ---------- little presentational helpers ----------
const inputCls =
  "w-full rounded-xl border border-ink/15 bg-bone px-4 py-3 text-ink outline-none transition-colors focus:border-copper";
const selectCls = inputCls;

function Shell({ children, lang }: { children: React.ReactNode; lang: string }) {
  return (
    <main className="grain min-h-screen bg-bone text-ink" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 md:pt-40">{children}</div>
    </main>
  );
}

function Choice({
  active,
  title,
  hint,
  onClick,
  disabled,
}: {
  active: boolean;
  title: string;
  hint: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border p-5 text-start transition-colors disabled:opacity-40 ${
        active ? "border-copper bg-copper/5 ring-1 ring-copper" : "border-ink/15 hover:border-ink/40"
      }`}
    >
      <span className="block font-display text-xl tracking-tight">{title}</span>
      <span className="mt-1 block text-sm text-ink-soft">{hint}</span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-ink/5 py-1">
      <dt className="text-ink-soft">{k}</dt>
      <dd className="text-end font-medium">{v}</dd>
    </div>
  );
}
