import Image from "next/image";
import Link from "next/link";

const FIGS = [
  ["/#ricerca", "Ricerca dei volti"],
  ["/#licenze", "Licenze AI su misura"],
  ["/#produci", "Produzione con l'AI"],
  ["/candidati", "Candidature modelli"],
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-8">
        <ol className="mx-auto w-fit space-y-1.5 text-xs tracking-wide uppercase sm:text-sm">
          {FIGS.map(([href, label], i) => (
            <li key={href} className={i === 0 ? "text-neutral-900" : "pl-6 text-neutral-500 sm:pl-9"}>
              <Link href={href} className="hover:text-neutral-950">
                <span className="mr-6 sm:mr-10">FIG. {String(i + 1).padStart(2, "0")}.</span>
                {label} / {year}
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex items-end justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-display)] text-5xl leading-none font-medium tracking-tight text-neutral-500 sm:text-6xl">
              Velvet Mode
            </p>
            <p className="mt-3 text-[11px] tracking-wide text-neutral-400 uppercase">
              © {year} · Ogni licenza è approvata dal modello
            </p>
          </div>
          <div className="flex items-end gap-6">
            <nav className="hidden gap-3 text-xs uppercase sm:flex">
              <Link href="/search" className="link-u">
                Esplora
              </Link>
              <Link href="/candidati" className="link-u">
                Candidati
              </Link>
            </nav>
            <Link href="/search" className="relative hidden h-24 w-24 overflow-hidden bg-neutral-100 sm:block">
              <Image src="/models/alex-p.jpg" alt="" fill sizes="96px" className="object-cover grayscale" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
