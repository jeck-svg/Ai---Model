import Image from "next/image";
import Link from "next/link";
import { getModel, type Model } from "@/lib/models";
import { NavPill } from "./NavPill";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Esplora" },
  { href: "#come-funziona", label: "Come funziona" },
  { href: "#licenze", label: "Licenze" },
];

// Side cards fan out around the featured face, tilted towards the centre like the reference.
const SIDE_CARDS = [
  { id: "sofia-l", className: "hidden xl:block w-44 h-60 [transform:rotateY(28deg)]" },
  { id: "aisha-k", className: "hidden md:block w-52 h-72 [transform:rotateY(22deg)]" },
  { id: "luca-m", className: "hidden md:block w-52 h-72 [transform:rotateY(-22deg)]" },
  { id: "alex-p", className: "hidden xl:block w-44 h-60 [transform:rotateY(-28deg)]" },
];

function SideCard({ model, className }: { model: Model; className: string }) {
  return (
    <Link
      href={`/models/${model.id}`}
      className={`group relative shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-xl shadow-neutral-900/10 transition duration-500 hover:[transform:rotateY(0deg)_scale(1.04)] ${className}`}
    >
      <Image src={`/models/${model.id}.jpg`} alt={`Ritratto di ${model.name}`} fill sizes="220px" className="object-cover" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
        {model.name}
      </span>
    </Link>
  );
}

export function Hero() {
  const featured = getModel("giulia-r")!;
  const side = SIDE_CARDS.map((c) => ({ ...c, model: getModel(c.id)! }));

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_top,#ffffff_0%,#fafaf9_55%,#f1f0ee_100%)] text-neutral-900">
      {/* Giant faded wordmark behind the cards */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 -z-10 select-none text-center font-[family-name:var(--font-display)] text-[22vw] leading-none tracking-tight text-neutral-900/[0.05]"
      >
        VELVET
      </p>

      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-6 sm:px-8">
        <Link href="/" className="whitespace-nowrap text-2xl font-bold tracking-tight">
          Velvet<span className="text-rose-600"> Mode</span>
        </Link>
        <NavPill items={NAV} activeIndex={0} />
        <Link
          href="/search"
          className="flex items-center gap-3 whitespace-nowrap rounded-full border border-neutral-200 bg-white py-1.5 pr-1.5 pl-5 text-sm font-medium uppercase tracking-wide text-neutral-800 shadow-sm"
        >
          Cerca<span className="hidden sm:inline"> un volto</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white">
            <ArrowIcon />
          </span>
        </Link>
      </header>

      <div className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-5 px-4 [perspective:1200px] sm:mt-16">
        {side.slice(0, 2).map((c) => (
          <SideCard key={c.id} model={c.model} className={c.className} />
        ))}

        <Link
          href={`/models/${featured.id}`}
          className="relative h-[460px] w-[300px] shrink-0 overflow-hidden rounded-[2rem] border-4 border-white text-white shadow-2xl shadow-neutral-900/20 sm:h-[520px] sm:w-[340px]"
        >
          <Image
            src={`/models/${featured.id}.jpg`}
            alt={`Ritratto di ${featured.name}`}
            fill
            priority
            sizes="340px"
            className="object-cover"
          />
          {/* Story-style progress bars */}
          <div className="absolute inset-x-5 top-5 flex gap-1.5">
            <span className="h-0.5 flex-1 rounded bg-white" />
            <span className="h-0.5 flex-1 rounded bg-white/50" />
            <span className="h-0.5 flex-1 rounded bg-white/50" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 pt-24 pb-6">
            <div className="mb-4 flex items-center gap-2 text-white/90">
              <span className="h-px flex-1 bg-white/80" />
              <span className="text-xs">✦</span>
              <span className="h-px flex-1 bg-white/80" />
            </div>
            <p className="text-2xl leading-tight font-medium uppercase sm:text-3xl">
              Il volto giusto
              <br />
              per la tua AI
            </p>
            <p className="mt-2 text-sm text-white/80">
              {featured.name} · {featured.city} · Immagine AI dimostrativa
            </p>
          </div>
        </Link>

        {side.slice(2).map((c) => (
          <SideCard key={c.id} model={c.model} className={c.className} />
        ))}
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-12 pb-16 text-center">
        <p className="max-w-xl text-lg leading-relaxed text-neutral-600">
          Volti reali, licenziati per l&apos;intelligenza artificiale. Scegli il modello, acquista i diritti AI e
          genera contenuti legali, tracciati e approvati.
        </p>

        {/* Search bar with a white LED light running around its border */}
        <div className="relative mt-8 w-full rounded-full bg-neutral-800 p-[2px] shadow-2xl shadow-neutral-900/25">
          <span aria-hidden className="led-ring absolute inset-0 rounded-full" />
          <span aria-hidden className="led-ring absolute -inset-1 rounded-full opacity-60 blur-md" />
          <form
            action="/search"
            role="search"
            className="relative flex h-16 items-center rounded-full bg-neutral-950 p-2 pl-7 sm:h-[72px]"
          >
            <svg viewBox="0 0 24 24" className="mr-3 h-5 w-5 shrink-0 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              name="q"
              aria-label="Cerca un modello"
              placeholder="Capelli rossi, fitness, Milano…"
              className="min-w-0 flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              className="flex h-full items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition hover:bg-rose-600 hover:text-white"
            >
              Cerca
              <ArrowIcon />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
