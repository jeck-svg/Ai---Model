import Link from "next/link";
import { MODELS } from "@/lib/models";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 text-xs tracking-wide uppercase sm:px-8">
        <Link href="/" className="font-medium text-neutral-900">
          Pola_AI.S01
        </Link>
        <nav className="flex items-center gap-6 text-neutral-700">
          <Link href="/search" className="hover:text-neutral-950">
            Esplora <sup className="text-[10px]">({MODELS.length})</sup>
          </Link>
          <Link href="/candidati" className="link-u hover:text-neutral-950">
            Candidati ↗
          </Link>
        </nav>
        <span className="hidden text-neutral-500 sm:inline">ID. {String(MODELS.length).padStart(4, "0")}.X</span>
      </div>
    </header>
  );
}
