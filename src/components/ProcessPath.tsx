"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MODELS } from "@/lib/models";

type Step = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  extra?: ReactNode;
  // Shown in the opposite column on desktop (below the text on mobile).
  side?: ReactNode;
};

// Two rows of model tiles drifting horizontally in opposite directions, fading out at the edges.
function FaceMarquee() {
  const ids = MODELS.map((m) => m.id);
  const rows = [ids, [...ids.slice(6), ...ids.slice(0, 6)]];
  return (
    <div className="group space-y-3 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]">
      {rows.map((row, r) => (
        <div key={r} className="overflow-hidden">
          <div
            className={`flex w-max gap-3 group-hover:[animation-play-state:paused] ${
              r === 0 ? "animate-[marquee_45s_linear_infinite]" : "animate-[marquee-reverse_45s_linear_infinite]"
            } motion-reduce:animate-none`}
          >
            {[...row, ...row].map((id, i) => {
              const model = MODELS.find((m) => m.id === id)!;
              return (
                <Link
                  key={`${id}-${i}`}
                  href={`/models/${id}`}
                  tabIndex={i >= row.length ? -1 : undefined}
                  className="relative h-36 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
                >
                  <Image src={`/models/${id}.jpg`} alt={`Ritratto di ${model.name}`} fill sizes="112px" className="object-cover" />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const STEPS: Step[] = [
  {
    id: "ricerca",
    kicker: "01",
    title: "Ricerca",
    text: "Trova il volto perfetto tra oltre 10.000 volti aggiornati ogni giorno. Filtra per look, età, città e categoria.",
    side: <FaceMarquee />,
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

// Winding path through the centre of the steps area, crossing it at each step's row.
function buildPath(w: number, h: number, ys: number[]) {
  const cx = (w / 2).toFixed(1);
  const parts = [`M${cx} 0 V${ys[0].toFixed(1)}`];
  for (let i = 1; i < ys.length; i++) {
    const [a, b] = [ys[i - 1], ys[i]];
    const bend = (w * (i % 2 ? 0.58 : 0.42)).toFixed(1);
    parts.push(`C ${bend} ${(a + (b - a) * 0.25).toFixed(1)}, ${bend} ${(a + (b - a) * 0.75).toFixed(1)}, ${cx} ${b.toFixed(1)}`);
  }
  parts.push(`V${h}`);
  return parts.join(" ");
}

const SAMPLE = 4; // px between samples of the y → length table

export function ProcessPath() {
  const areaRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [layout, setLayout] = useState({ w: 0, h: 0, ys: [] as number[] });
  const [tip, setTip] = useState(0); // y of the line's tip inside the steps area, px
  const [drawn, setDrawn] = useState(0); // drawn length of the path, px
  const lengthAtY = useRef<number[]>([]);
  const total = useRef(0);

  // Measure the steps area and the centre of each row, so the path passes through every node.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () =>
      setLayout({
        w: el.clientWidth,
        h: el.clientHeight,
        ys: rowRefs.current.map((r) => (r ? r.offsetTop + r.offsetHeight / 2 : 0)),
      });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (path && layout.h) {
      total.current = path.getTotalLength();
      const table: number[] = [];
      let len = 0;
      for (let y = 0; y <= layout.h + SAMPLE; y += SAMPLE) {
        while (len < total.current && path.getPointAtLength(len).y < y) len += 2;
        table.push(Math.min(len, total.current));
      }
      lengthAtY.current = table;
    }

    const update = () => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // The tip follows a point a little below the middle of the viewport; at the very
      // bottom of the page that point can't go further, so the path is completed.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && rect.top < window.innerHeight;
      const y = atBottom ? rect.height : Math.min(rect.height, Math.max(0, window.innerHeight * 0.6 - rect.top));
      setTip(y);
      setDrawn(lengthAtY.current[Math.round(y / SAMPLE)] ?? 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [layout]);

  const { w, h, ys } = layout;
  const reached = STEPS.map((_, i) => ys[i] !== undefined && h > 0 && tip >= ys[i] - 2);
  const done = h > 0 && tip >= h - 2;
  const d = w && ys.length === STEPS.length ? buildPath(w, h, ys) : "";
  const len = total.current || 1;

  return (
    <section id="come-funziona" className="scroll-mt-8 bg-white px-4 pt-12 pb-12">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-600 uppercase">Come funziona</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-neutral-900 sm:text-5xl">
          Dal volto al contenuto, in tre passi
        </h2>
      </div>

      <div ref={areaRef} className="relative mx-auto mt-6 max-w-5xl">
        {/* Desktop: winding line through the centre */}
        {d && (
          <svg aria-hidden width={w} height={h} className="pointer-events-none absolute inset-0 hidden md:block">
            <path d={d} fill="none" stroke="#e7e5e4" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            <path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ strokeDasharray: `${len} ${len}`, strokeDashoffset: len - drawn }}
            />
          </svg>
        )}

        {/* Mobile: straight line on the left */}
        <div aria-hidden className="absolute top-0 bottom-0 left-5 w-0.5 bg-neutral-200 md:hidden">
          <div className="w-full bg-rose-600" style={{ height: h ? `${(tip / h) * 100}%` : 0 }} />
        </div>

        {STEPS.map((step, i) => {
          const on = reached[i];
          const right = i % 2 === 1;
          const fade = `transition-all duration-700 ease-out ${on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-30"}`;
          return (
            <div
              key={step.id}
              id={step.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="relative flex scroll-mt-24 flex-col py-8 md:flex-row md:items-center md:py-10"
            >
              {/* Node on the path */}
              <span
                className={`absolute top-1/2 left-5 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 md:left-1/2 ${
                  on
                    ? "scale-110 border-rose-600 bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                    : "border-neutral-300 bg-white text-neutral-400"
                }`}
              >
                {step.kicker}
              </span>

              <div
                className={`w-full pl-14 md:w-1/2 md:pl-0 ${right ? "md:order-2 md:ml-auto md:pl-28" : "md:pr-28 md:text-right"} ${fade}`}
              >
                <h3 className="font-[family-name:var(--font-display)] text-3xl text-neutral-900 sm:text-4xl">{step.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-neutral-600">{step.text}</p>
                {step.extra && <div className="mt-6">{step.extra}</div>}
              </div>

              {step.side && (
                <div className={`mt-8 w-full pl-14 md:mt-0 md:w-1/2 ${right ? "md:pr-28 md:pl-0" : "md:pl-28"} ${fade}`}>
                  {step.side}
                </div>
              )}
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
          className={`mt-4 rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-wide text-white uppercase transition-all duration-700 hover:bg-rose-600 ${
            done ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Inizia la ricerca
        </Link>
      </div>
    </section>
  );
}
