"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Winding path drawn in real pixels of the steps area; the three steps sit where it
// crosses the centre (at 1/6, 3/6 and 5/6 of the height).
const NODE_AT = [1 / 6, 3 / 6, 5 / 6];

function buildPath(w: number, h: number) {
  const x = (f: number) => (w * f).toFixed(1);
  const y = (f: number) => (h * f).toFixed(1);
  return [
    `M${x(0.5)} 0 V${y(1 / 6)}`,
    `C ${x(0.64)} ${y(0.25)}, ${x(0.64)} ${y(5 / 12)}, ${x(0.5)} ${y(0.5)}`,
    `C ${x(0.36)} ${y(7 / 12)}, ${x(0.36)} ${y(0.75)}, ${x(0.5)} ${y(5 / 6)}`,
    `V${y(1)}`,
  ].join(" ");
}

type Step = { id: string; kicker: string; title: string; text: string; extra: ReactNode };

const STEPS: Step[] = [
  {
    id: "ricerca",
    kicker: "01",
    title: "Ricerca",
    text: "Trova il volto perfetto tra oltre 10.000 volti aggiornati ogni giorno. Filtra per look, età, città e categoria.",
    extra: (
      <div className="flex flex-wrap gap-2">
        {["capelli rossi", "fitness", "senior", "Milano", "editoriale"].map((t) => (
          <span key={t} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600">
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "licenze",
    kicker: "02",
    title: "Seleziona",
    text: "Scegli il tipo di diritto sul volto in base a come lo userai: utilizzi consentiti, durata e territorio sono scritti nel contratto.",
    extra: (
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ["Base", "6 mesi · Italia", "Social organici e web"],
          ["Standard", "12 mesi · Europa", "Ads, e-commerce, newsletter"],
          ["Premium", "24 mesi · Mondo", "ADV, TV, cinema, OOH"],
        ].map(([name, scope, use]) => (
          <div key={name} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="font-semibold text-neutral-900">{name}</p>
            <p className="mt-0.5 text-xs font-medium text-rose-600">{scope}</p>
            <p className="mt-2 text-sm text-neutral-600">{use}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "produci",
    kicker: "03",
    title: "Produci",
    text: "Usa il volto licenziato per produrre con l'AI: ricevi il pacchetto di training e il contratto firmato dal modello.",
    extra: (
      <ul className="grid gap-2 text-sm text-neutral-700 sm:grid-cols-3">
        {["Immagini e campagne social", "Video e spot", "Cataloghi e-commerce"].map((t) => (
          <li key={t} className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <span className="text-rose-600">✦</span>
            {t}
          </li>
        ))}
      </ul>
    ),
  },
];

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function ProcessPath() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [progress, setProgress] = useState(0); // 0..1 down the steps area
  const [drawn, setDrawn] = useState(0); // drawn length of the path, in px
  // Path length at which the line reaches each 1/300 of the height.
  const lengthAtY = useRef<number[]>([]);
  const total = useRef(0);

  // Track the real size of the steps area so the path is drawn without stretching.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (path && size.h) {
      total.current = path.getTotalLength();
      const table: number[] = [];
      let len = 0;
      for (let i = 0; i <= 300; i++) {
        const target = (i / 300) * size.h;
        while (len < total.current && path.getPointAtLength(len).y < target) len += 2;
        table[i] = Math.min(len, total.current);
      }
      lengthAtY.current = table;
    }

    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // The tip of the line follows a point a little below the middle of the viewport.
      // At the very bottom of the page the trigger point can't go further, so finish the path.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && rect.top < window.innerHeight;
      const p = atBottom ? 1 : clamp((window.innerHeight * 0.6 - rect.top) / rect.height);
      setProgress(p);
      setDrawn(lengthAtY.current[Math.round(p * 300)] ?? 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [size]);

  const reached = NODE_AT.map((f) => progress >= f - 0.005);
  const done = progress >= 0.995;
  const d = size.w ? buildPath(size.w, size.h) : "";

  return (
    <section id="come-funziona" className="scroll-mt-8 bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-600 uppercase">Come funziona</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-neutral-900 sm:text-5xl">
          Dal volto al contenuto, in tre passi
        </h2>
      </div>

      <div ref={sectionRef} className="relative mx-auto mt-16 max-w-5xl">
        {/* Desktop: winding line through the centre */}
        {d && (
          <svg
            aria-hidden
            width={size.w}
            height={size.h}
            className="pointer-events-none absolute inset-0 hidden md:block"
          >
            <path d={d} fill="none" stroke="#e7e5e4" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            <path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ strokeDasharray: `${total.current || 1} ${total.current || 1}`, strokeDashoffset: (total.current || 1) - drawn }}
            />
          </svg>
        )}

        {/* Mobile: straight line on the left */}
        <div aria-hidden className="absolute top-0 bottom-0 left-5 w-0.5 bg-neutral-200 md:hidden">
          <div className="w-full bg-rose-600" style={{ height: `${progress * 100}%` }} />
        </div>

        {STEPS.map((step, i) => {
          const on = reached[i];
          const right = i % 2 === 1;
          return (
            <div key={step.id} id={step.id} className="relative flex min-h-[60vh] scroll-mt-24 items-center md:min-h-[70vh]">
              {/* Node on the path */}
              <span
                className={`absolute left-5 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 md:left-1/2 ${
                  on
                    ? "scale-110 border-rose-600 bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                    : "border-neutral-300 bg-white text-neutral-400"
                }`}
              >
                {step.kicker}
              </span>

              <div
                className={`w-full pl-14 transition-all duration-700 ease-out md:w-1/2 md:pl-0 ${
                  right ? "md:ml-auto md:pl-28" : "md:pr-28 md:text-right"
                } ${on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-30"}`}
              >
                <h3 className="font-[family-name:var(--font-display)] text-3xl text-neutral-900 sm:text-4xl">{step.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-neutral-600">{step.text}</p>
                <div className={`mt-6 ${right ? "" : "md:flex md:justify-end"}`}>{step.extra}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrow head that completes the path */}
      <div className="mx-auto flex max-w-5xl flex-col items-start md:items-center">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`-mt-3 ml-2 h-7 w-7 text-rose-600 transition-all duration-500 md:ml-0 ${
              done ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link
            href="/search"
            className={`mt-6 rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-700 hover:bg-rose-600 ${
              done ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Inizia la ricerca
          </Link>
      </div>
    </section>
  );
}
