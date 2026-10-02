"use client";

import Link from "next/link";
import { useState } from "react";
import { euro, type License } from "@/lib/models";

// The highlighted (dark) option follows the pointer or keyboard focus;
// with nothing hovered the recommended Standard licence stays highlighted.
export function LicenseOptions({ modelId, licenses }: { modelId: string; licenses: License[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? "standard";

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-3" onMouseLeave={() => setHovered(null)}>
      {licenses.map((l) => {
        const dark = l.tier === active;
        return (
          <div
            key={l.tier}
            onMouseEnter={() => setHovered(l.tier)}
            onFocus={() => setHovered(l.tier)}
            className={`flex flex-col border p-5 transition-colors duration-300 ${
              dark ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-900"
            }`}
          >
            <div className="flex items-center justify-between text-xs tracking-wide uppercase">
              <h3 className="font-medium">{l.name}</h3>
              {l.tier === "standard" && (
                <span className={`transition-colors duration-300 ${dark ? "text-white/60" : "text-neutral-400"}`}>
                  Consigliata
                </span>
              )}
            </div>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
              {euro(l.price)}
            </p>
            <ul className={`mt-4 flex-1 space-y-1.5 text-xs transition-colors duration-300 ${dark ? "text-white/75" : "text-neutral-600"}`}>
              <li>
                {l.durationMonths} mesi · {l.territory}
              </li>
              <li>{l.generations}</li>
              {l.usages.map((u) => (
                <li key={u}>+ {u}</li>
              ))}
            </ul>
            <Link
              href={`/checkout?model=${modelId}&tier=${l.tier}`}
              className={`mt-5 py-2.5 text-center text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${
                dark ? "bg-white text-neutral-900 hover:bg-neutral-200" : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              Acquista diritti AI ↗
            </Link>
          </div>
        );
      })}
    </div>
  );
}
