"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Model } from "@/lib/models";
import poses from "@/lib/model-poses.json";

// Same order as the prompts used to generate public/models/poses/<id>-<n>.jpg
const POSE_LABELS = ["Figura intera", "Profilo", "Tre quarti", "Seduta", "Spontanea", "Beauty"];
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"];

const withPoses = new Set<string>(poses);
const pad = (n: number) => String(n).padStart(2, "0");

export function PolaroidGallery({ model }: { model: Model }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const count = POSE_LABELS.length;
  const src = (i: number) => `/models/poses/${model.id}-${i + 1}.jpg`;

  const step = useCallback((dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + count) % count)), [count]);

  // Keyboard navigation and scroll lock while the lightbox is open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, step]);

  if (!withPoses.has(model.id)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8">
      <div className="flex items-end justify-between border-t border-neutral-200 pt-8">
        <h2 className="text-xs tracking-wide text-neutral-500 uppercase">FIG. 03. — Pose / Polaroid</h2>
        <p className="text-[11px] tracking-wide text-neutral-400 uppercase">6 scatti · Immagini AI dimostrative</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {POSE_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Apri a tutto schermo: ${label}`}
            className={`cursor-zoom-in bg-white p-2.5 pb-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200 transition duration-300 hover:z-10 hover:-translate-y-1 hover:scale-105 hover:rotate-0 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] ${TILT[i]}`}
          >
            <span className="relative block aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={src(i)}
                alt={`${model.name} — ${label}`}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </span>
            <span className="mt-3 flex justify-between text-[10px] tracking-wide text-neutral-500 uppercase">
              <span>{pad(i + 1)}</span>
              <span>{label}</span>
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${model.name} — ${POSE_LABELS[open]}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <figure
            key={open}
            onClick={(e) => e.stopPropagation()}
            className="w-[min(90vw,calc(78vh*0.8))] animate-[pop-in_0.25s_ease-out] bg-white p-3 pb-4 motion-reduce:animate-none shadow-2xl"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image src={src(open)} alt={`${model.name} — ${POSE_LABELS[open]}`} fill sizes="90vw" className="object-cover" priority />
            </div>
            <figcaption className="mt-3 flex justify-between text-[11px] tracking-wide text-neutral-500 uppercase">
              <span>
                {pad(open + 1)} / {pad(count)} · {POSE_LABELS[open]}
              </span>
              <span>{model.name}</span>
            </figcaption>
          </figure>

          {[
            { dir: -1 as const, label: "Foto precedente", side: "left-3 sm:left-8", icon: "←" },
            { dir: 1 as const, label: "Foto successiva", side: "right-3 sm:right-8", icon: "→" },
          ].map((b) => (
            <button
              key={b.dir}
              type="button"
              aria-label={b.label}
              onClick={(e) => {
                e.stopPropagation();
                step(b.dir);
              }}
              className={`absolute top-1/2 ${b.side} flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/40 text-lg text-white transition hover:bg-white hover:text-neutral-900`}
            >
              {b.icon}
            </button>
          ))}

          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 border border-white/40 px-3 py-2 text-xs tracking-wide text-white uppercase transition hover:bg-white hover:text-neutral-900"
          >
            Chiudi ✕
          </button>
        </div>
      )}
    </section>
  );
}
