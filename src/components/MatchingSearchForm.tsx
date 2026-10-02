"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MODELS, searchModels } from "@/lib/models";

const DURATION = 4000; // ms of "matching" before showing the results

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

// Search form that plays a short matching animation before navigating to /search.
export function MatchingSearchForm({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter();
  const [query, setQuery] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef(0);

  const go = (q: string) => {
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    // The overlay stays up while the results page loads, then goes away.
    setTimeout(() => setQuery(null), 400);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.prefetch("/search");
    setElapsed(0);
    setQuery(q);
  };

  useEffect(() => {
    if (query === null) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      setElapsed(Math.min(t, DURATION));
      if (t < DURATION) raf.current = requestAnimationFrame(tick);
      else go(query);
    };
    raf.current = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelAnimationFrame(raf.current);
        go(query);
      }
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
    <>
      <form action="/search" role="search" onSubmit={onSubmit} className={className}>
        {children}
      </form>
      {query !== null && createPortal(<MatchingOverlay query={query} elapsed={elapsed} onSkip={() => go(query)} />, document.body)}
    </>
  );
}

function MatchingOverlay({ query, elapsed, onSkip }: { query: string; elapsed: number; onSkip: () => void }) {
  const p = elapsed / DURATION; // 0..1
  const matches = new Set(searchModels({ q: query }).map((m) => m.id));
  const scanning = p < 0.65;
  const scanIndex = Math.floor(elapsed / 110) % MODELS.length;
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
          {MODELS.map((m, i) => {
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
