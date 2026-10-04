"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { euro, minPrice, modelCode, searchModels, type Model } from "@/lib/models";

const DURATION = 4000; // ms of "matching"
const READOUT = 2000; // ms spent on the best match before opening its page

const STEPS = [
  "Analisi della query",
  "Scansione di oltre 10.000 volti",
  "Confronto dei tratti del viso",
  "Verifica delle licenze disponibili",
  "Calcolo dell'affinità",
  "Match perfetto",
];

// Stable pseudo-random score per model and query, so the numbers don't jump around.
function score(id: string, q: string, matched: boolean) {
  let h = 0;
  for (const c of id + q) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return matched ? 90 + (h % 10) : 12 + (h % 40);
}

const pad = (n: number) => String(Math.round(n)).padStart(2, "0");

// Best match for a query, or null when the query is empty or nothing matches.
function bestMatch(models: Model[], q: string): Model | null {
  if (!q) return null;
  const found = searchModels(models, { q });
  if (!found.length) return null;
  return found.reduce((a, b) => (score(b.id, q, true) > score(a.id, q, true) ? b : a));
}

const resultsUrl = (q: string) => (q ? `/search?q=${encodeURIComponent(q)}` : "/search");

type StartMatching = (q: string) => void;
const MatchingContext = createContext<StartMatching | null>(null);

// Lives in the root layout so the overlay survives the navigation to /search and can
// cross-fade into the results page. Plays the matching animation, then a read-out of
// the best match, then opens the results.
export function MatchingProvider({ models, children }: { models: Model[]; children: ReactNode }) {
  const router = useRouter();
  const [query, setQuery] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const raf = useRef(0);
  const going = useRef(false);

  const go = (q: string) => {
    if (going.current) return;
    going.current = true;
    cancelAnimationFrame(raf.current);
    const url = resultsUrl(q);
    router.push(url);
    // Keep the overlay up until the results page is in place, then fade it out.
    const startedAt = performance.now();
    const waitForPage = () => {
      const arrived = location.pathname + location.search === url;
      if (!arrived && performance.now() - startedAt < 3000) return void setTimeout(waitForPage, 50);
      setLeaving(true);
      setTimeout(() => {
        setQuery(null);
        setLeaving(false);
        going.current = false;
      }, 700);
    };
    waitForPage();
  };

  const start: StartMatching = (q) => {
    if (query !== null) return;
    router.prefetch(resultsUrl(q));
    setElapsed(0);
    setQuery(q);
  };

  useEffect(() => {
    if (query === null) return;
    const begin = performance.now();
    const total = bestMatch(models, query) ? DURATION + READOUT : DURATION;
    const tick = (now: number) => {
      const t = now - begin;
      setElapsed(Math.min(t, total));
      if (t < total) raf.current = requestAnimationFrame(tick);
      else go(query);
    };
    raf.current = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") go(query);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <MatchingContext.Provider value={start}>
      {children}
      {query !== null && (
        <div className={`transition-opacity duration-700 ease-out ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <MatchingOverlay models={models} query={query} elapsed={elapsed} onSkip={() => go(query)} />
        </div>
      )}
    </MatchingContext.Provider>
  );
}

// Search form that hands the query to the matching animation instead of navigating
// directly (falls back to a normal GET to /search without JavaScript).
export function MatchingSearchForm({ className, children }: { className?: string; children: ReactNode }) {
  const start = useContext(MatchingContext);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!start) return;
    e.preventDefault();
    start(String(new FormData(e.currentTarget).get("q") ?? "").trim());
  };
  return (
    <form action="/search" role="search" onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}

function MatchingOverlay({
  models,
  query,
  elapsed,
  onSkip,
}: {
  models: Model[];
  query: string;
  elapsed: number;
  onSkip: () => void;
}) {
  const best = bestMatch(models, query);
  if (best && elapsed > DURATION) {
    return <Readout model={best} query={query} t={(elapsed - DURATION) / READOUT} onSkip={onSkip} />;
  }
  const p = Math.min(1, elapsed / DURATION); // 0..1
  const matches = new Set(searchModels(models, { q: query }).map((m) => m.id));
  const scanning = p < 0.65;
  const scanIndex = Math.floor(elapsed / 110) % Math.max(1, models.length);
  const reveal = Math.min(1, Math.max(0, (p - 0.6) / 0.3)); // matches emerge in the last part
  const step = STEPS[Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))];

  return (
    <div
      role="status"
      aria-live="polite"
      className="corner-marks fixed inset-0 z-[60] flex animate-[pop-in_0.25s_ease-out] flex-col bg-white text-neutral-900 motion-reduce:animate-none"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-14 text-xs tracking-wide uppercase sm:px-8">
        <span className="font-medium">Matching_Engine.v1</span>
        <span className="hidden truncate text-neutral-500 sm:inline">Query: &ldquo;{query || "tutti i volti"}&rdquo;</span>
        <button type="button" onClick={onSkip} className="link-u">
          Salta ↗
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-wide text-neutral-500 uppercase">{step}…</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-7xl leading-none font-medium tracking-tighter tabular-nums sm:text-9xl">
              {pad(p * 100)}%
            </p>
          </div>
          <p className="text-right text-xs tracking-wide text-neutral-500 uppercase">
            Match trovati
            <span className="mt-1 block font-[family-name:var(--font-display)] text-4xl text-neutral-900 tabular-nums">
              {pad(reveal * matches.size)}
            </span>
          </p>
        </div>

        <div className="mt-6 h-px w-full bg-neutral-200">
          <div className="h-px bg-neutral-900" style={{ width: `${p * 100}%` }} />
        </div>

        <div className="mt-8 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {models.map((m, i) => {
            const isMatch = matches.has(m.id);
            const active = scanning && i === scanIndex;
            const dim = !isMatch && reveal > 0;
            return (
              <div
                key={m.id}
                className={`relative aspect-[4/5] overflow-hidden bg-neutral-100 transition duration-300 ${
                  isMatch && reveal > 0 ? "ring-2 ring-neutral-900 ring-offset-2" : ""
                } ${active ? "scale-105" : ""}`}
                style={{ opacity: dim ? 1 - reveal * 0.8 : 1 }}
              >
                <Image
                  src={`/models/${m.id}.jpg`}
                  alt=""
                  fill
                  sizes="160px"
                  className={`object-cover transition duration-300 ${scanning && !active ? "grayscale" : ""}`}
                />
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 h-1/3 animate-[scan_0.45s_linear_infinite] bg-gradient-to-b from-transparent via-white/70 to-transparent motion-reduce:animate-none"
                  />
                )}
                <span
                  className={`absolute inset-x-0 bottom-0 flex justify-between bg-black/60 px-1.5 py-1 text-[9px] tracking-wide text-white uppercase transition-opacity ${
                    active || reveal > 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span>{m.name}</span>
                  <span className="tabular-nums">
                    {pad(score(m.id, query, isMatch) * (reveal > 0 ? reveal : Math.min(1, p * 1.5)))}%
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 h-4 text-xs tracking-wide text-neutral-500 uppercase">
          {reveal >= 1 &&
            (matches.size > 0
              ? `${matches.size} ${matches.size === 1 ? "volto perfetto" : "volti perfetti"} per la tua query`
              : "Nessun match perfetto — prova con meno parole")}
        </p>
      </div>
    </div>
  );
}

// Two-second focus on the selected model: photo in a polaroid frame and data rows appearing
// one after the other, before the results page fades in.
function Readout({ model, query, t, onSkip }: { model: Model; query: string; t: number; onSkip: () => void }) {
  const rows: [string, string][] = [
    ["Codice", modelCode(model)],
    ["Età", `${model.age} anni`],
    ["Città", model.city],
    ["Categorie", model.categories.join(" / ")],
    ["Tratti", model.tags.join(" / ")],
    ["Licenza AI da", euro(minPrice(model))],
  ];
  return (
    <div
      role="status"
      aria-live="polite"
      className="corner-marks fixed inset-0 z-[60] flex flex-col bg-white text-neutral-900"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-14 text-xs tracking-wide uppercase sm:px-8">
        <span className="font-medium">Matching_Engine.v1</span>
        <span className="hidden truncate text-neutral-500 sm:inline">Query: &ldquo;{query}&rdquo;</span>
        <button type="button" onClick={onSkip} className="link-u">
          Vai ai risultati ↗
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-8 px-4 sm:px-8 md:grid-cols-[auto_1fr] md:gap-14">
        <div className="mx-auto w-[min(48vw,220px)] animate-[pop-in_0.35s_ease-out] bg-white p-3 pb-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-neutral-200 motion-reduce:animate-none md:w-[min(32vw,340px)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
            <Image src={`/models/${model.id}.jpg`} alt={`Ritratto di ${model.name}`} fill sizes="340px" className="object-cover" priority />
          </div>
          <p className="flex h-10 items-center justify-between text-[10px] tracking-wide text-neutral-500 uppercase">
            <span>{model.name}</span>
            <span>Immagine AI demo</span>
          </p>
        </div>

        <div>
          <p className="text-xs tracking-wide text-neutral-500 uppercase">Match perfetto · {score(model.id, query, true)}%</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-6xl leading-none font-medium tracking-tighter sm:text-8xl">
            {model.name}
          </h2>
          <dl className="mt-6 border-t border-neutral-200 text-xs uppercase">
            {rows.map(([k, v], i) => {
              const shown = t > 0.08 + i * 0.09;
              return (
                <div
                  key={k}
                  className={`flex justify-between gap-6 border-b border-neutral-200 py-2.5 transition duration-300 ${
                    shown ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                  }`}
                >
                  <dt className="text-neutral-500">{k}</dt>
                  <dd className="text-right text-neutral-900">{v}</dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-6 text-xs tracking-wide text-neutral-500 uppercase">Apertura risultati…</p>
          <div className="mt-2 h-px w-full bg-neutral-200">
            <div className="h-px bg-neutral-900" style={{ width: `${Math.min(1, t) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
