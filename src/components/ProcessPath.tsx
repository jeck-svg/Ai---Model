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
                  className="relative h-36 w-28 shrink-0 overflow-hidden bg-neutral-100"
                >
                  <Image src={`/models/${id}.jpg`} alt={`Ritratto di ${model.name}`} fill sizes="112px" className="object-cover grayscale transition duration-500 hover:grayscale-0" />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

type Tile = { title: string; sub?: string; text: string };

// Tiles that take turns being "tapped": each one presses down, springs up and stays highlighted
// for a moment. Hovering or clicking a tile takes over from the automatic cycle.
function TapTiles({ tiles, icon }: { tiles: Tile[]; icon?: ReactNode }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % tiles.length), 1800);
    return () => clearInterval(t);
  }, [paused, tiles.length]);

  return (
    <div className="grid gap-3 sm:grid-cols-3" onMouseLeave={() => setPaused(false)}>
      {tiles.map((tile, i) => {
        const on = i === active;
        return (
          <button
            key={tile.title}
            type="button"
            aria-pressed={on}
            onMouseEnter={() => {
              setPaused(true);
              setActive(i);
            }}
            onFocus={() => {
              setPaused(true);
              setActive(i);
            }}
            onClick={() => setActive(i)}
            className={`border p-4 text-left transition-[background-color,border-color,box-shadow,scale] duration-300 active:scale-95 motion-reduce:animate-none ${
              on
                ? "scale-105 animate-[tap_0.55s_ease-out] border-neutral-900 bg-neutral-900 text-white shadow-xl shadow-neutral-900/20"
                : "scale-100 border-neutral-200 bg-white"
            }`}
          >
            <p className={`flex items-center gap-2 text-sm font-medium uppercase transition-colors duration-300 ${on ? "text-white" : "text-neutral-900"}`}>
              {icon && <span className={`transition-colors duration-300 ${on ? "text-white" : "text-neutral-400"}`}>{icon}</span>}
              {tile.title}
            </p>
            {tile.sub && <p className={`mt-1 text-[11px] uppercase transition-colors duration-300 ${on ? "text-white/60" : "text-neutral-500"}`}>{tile.sub}</p>}
            <p className={`mt-3 text-xs leading-relaxed transition-colors duration-300 ${on ? "text-white/80" : "text-neutral-600"}`}>{tile.text}</p>
          </button>
        );
      })}
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
    side: (
      <TapTiles
        tiles={[
          { title: "Base", sub: "6 mesi · Italia", text: "Social organici e web" },
          { title: "Standard", sub: "12 mesi · Europa", text: "Ads, e-commerce, newsletter" },
          { title: "Premium", sub: "24 mesi · Mondo", text: "ADV, TV, cinema, OOH" },
        ]}
      />
    ),
  },
  {
    id: "produci",
    kicker: "03",
    title: "Produci",
    text: "Usa il volto licenziato per produrre con l'AI: ricevi il pacchetto di training e il contratto firmato dal modello.",
    side: (
      <TapTiles
        icon="✦"
        tiles={[
          { title: "Immagini", text: "Campagne social e contenuti web" },
          { title: "Video", text: "Spot, reel e contenuti animati" },
          { title: "E-commerce", text: "Cataloghi e schede prodotto" },
        ]}
      />
    ),
  },
];

export function ProcessPath() {
  const areaRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState({ h: 0, ys: [] as number[] });
  const [tip, setTip] = useState(0); // y of the line's tip inside the steps area, px

  // Measure the steps area and the centre of each row, where the nodes sit on the line.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () =>
      setLayout({
        h: el.clientHeight,
        ys: rowRefs.current.map((r) => (r ? r.offsetTop + r.offsetHeight / 2 : 0)),
      });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // The tip follows a point a little below the middle of the viewport; at the very
      // bottom of the page that point can't go further, so the line is completed.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && rect.top < window.innerHeight;
      setTip(atBottom ? rect.height : Math.min(rect.height, Math.max(0, window.innerHeight * 0.6 - rect.top)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [layout]);

  const { h, ys } = layout;
  const reached = STEPS.map((_, i) => ys[i] !== undefined && h > 0 && tip >= ys[i] - 2);
  const done = h > 0 && tip >= h - 2;

  return (
    <section id="come-funziona" className="scroll-mt-8 bg-white px-4 pt-12 pb-12">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">Index.Process_03</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-neutral-900 sm:text-6xl">
          Dal volto al contenuto, in tre passi
        </h2>
      </div>

      <div ref={areaRef} className="relative mx-auto mt-6 max-w-5xl">
        {/* Straight progress line: on the left on mobile, through the centre on desktop */}
        <div aria-hidden className="absolute top-0 bottom-0 left-5 w-0.5 -translate-x-1/2 bg-neutral-200 md:left-1/2">
          <div className="w-full bg-neutral-900" style={{ height: h ? `${(tip / h) * 100}%` : 0 }} />
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
                className={`absolute top-1/2 left-5 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border text-xs font-semibold transition-all duration-500 md:left-1/2 ${
                  on
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-400"
                }`}
              >
                {step.kicker}
              </span>

              <div
                className={`w-full pl-14 md:w-1/2 md:pl-0 ${right ? "md:order-2 md:ml-auto md:pl-16" : "md:pr-16 md:text-right"} ${fade}`}
              >
                <p className="text-xs tracking-wide text-neutral-500 uppercase">FIG. {step.kicker}.</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{step.text}</p>
              </div>

              {step.side && (
                <div className={`mt-8 w-full pl-14 md:mt-0 md:w-1/2 ${right ? "md:pr-16 md:pl-0" : "md:pl-16"} ${fade}`}>
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
          className={`-mt-3 ml-2 h-7 w-7 text-neutral-900 transition-all duration-500 md:ml-0 ${
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
          className={`mt-4 bg-neutral-950 px-8 py-4 text-xs font-medium tracking-wide text-white uppercase transition-all duration-700 hover:bg-neutral-700 ${
            done ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Inizia la ricerca
        </Link>
      </div>
    </section>
  );
}
