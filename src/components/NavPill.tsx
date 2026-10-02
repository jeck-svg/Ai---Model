"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

type Item = { href: string; label: string };

// Pill navigation with a rose indicator that glides to the hovered/focused item
// and slides back to the active one when the pointer leaves.
export function NavPill({ items, activeIndex = 0 }: { items: Item[]; activeIndex?: number }) {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const current = hovered ?? activeIndex;

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[current];
      if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [current]);

  return (
    <nav
      onMouseLeave={() => setHovered(null)}
      className="relative hidden items-center rounded-full border border-neutral-200 bg-white p-1.5 text-sm font-medium shadow-sm md:flex"
    >
      {box && (
        <span
          aria-hidden
          className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-rose-600 shadow-md shadow-rose-600/30 transition-[transform,width] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none"
          style={{ width: box.width, transform: `translateX(${box.left}px)` }}
        />
      )}
      {items.map((item, i) => (
        <Link
          key={item.label}
          ref={(el) => {
            refs.current[i] = el;
          }}
          href={item.href}
          aria-current={i === activeIndex ? "page" : undefined}
          onMouseEnter={() => setHovered(i)}
          onFocus={() => setHovered(i)}
          onBlur={() => setHovered(null)}
          className={`relative z-10 rounded-full px-5 py-2 uppercase tracking-wide transition-colors duration-500 ${
            i === current ? "text-white" : "text-neutral-700"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
