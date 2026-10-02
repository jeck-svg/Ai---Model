import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900">
          Velvet<span className="text-rose-600"> Mode</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-neutral-600">
          <Link href="/search" className="hover:text-neutral-900">
            Esplora modelli
          </Link>
          <span className="hidden sm:inline">Diventa modello</span>
        </nav>
      </div>
    </header>
  );
}
