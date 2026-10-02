export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" className="flex w-full border border-neutral-900" role="search">
      <span aria-hidden className="flex items-center pl-4 text-xs tracking-wide text-neutral-400 uppercase">
        Query_
      </span>
      <input
        name="q"
        defaultValue={defaultValue}
        aria-label="Cerca un modello"
        placeholder="capelli rossi, fitness, Milano…"
        className="h-12 min-w-0 flex-1 bg-white px-3 text-sm text-neutral-900 outline-none"
      />
      <button
        type="submit"
        className="bg-neutral-900 px-6 text-xs font-medium tracking-wide text-white uppercase hover:bg-neutral-700"
      >
        Cerca ↗
      </button>
    </form>
  );
}
