export function SearchBar({ defaultValue = "", large = false }: { defaultValue?: string; large?: boolean }) {
  return (
    <form action="/search" className="flex w-full gap-2" role="search">
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="Cerca un modello: es. capelli rossi, fitness, Milano…"
        className={`flex-1 rounded-full border border-neutral-300 bg-white px-5 text-neutral-900 outline-none focus:border-neutral-900 ${
          large ? "h-14 text-lg" : "h-11"
        }`}
      />
      <button
        type="submit"
        className={`rounded-full bg-neutral-900 px-6 font-medium text-white hover:bg-neutral-700 ${large ? "h-14" : "h-11"}`}
      >
        Cerca
      </button>
    </form>
  );
}
