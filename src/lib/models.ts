export type LicenseTier = "base" | "standard" | "premium";

export type License = {
  tier: LicenseTier;
  name: string;
  price: number;
  durationMonths: number;
  territory: string;
  usages: string[];
  generations: string;
};

export type Model = {
  id: string;
  // Catalogue position in the database, used for the code shown in the UI (PA_0001).
  position: number;
  name: string;
  age: number;
  gender: "donna" | "uomo" | "non-binario";
  city: string;
  categories: string[];
  tags: string[];
  bio: string;
  rating: number;
  reviews: number;
  sales: number;
  palette: [string, string];
  licenses: License[];
};

export const CATEGORIES = [
  "Moda",
  "Beauty",
  "Fitness",
  "Lifestyle",
  "Commercial",
  "Editoriale",
  "Cinema",
  "Senior",
];

export function minPrice(m: Model) {
  return Math.min(...m.licenses.map((l) => l.price));
}

export type SearchFilters = {
  q?: string;
  category?: string;
  gender?: string;
  maxPrice?: number;
  sort?: string;
};

// Pure filtering over an already loaded catalogue, so it works on the server and in the browser.
export function searchModels(models: Model[], { q, category, gender, maxPrice, sort }: SearchFilters) {
  const terms = (q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const results = models.filter((m) => {
    const haystack = [m.name, m.city, m.gender, m.bio, ...m.categories, ...m.tags]
      .join(" ")
      .toLowerCase();
    if (terms.some((t) => !haystack.includes(t))) return false;
    if (category && !m.categories.includes(category)) return false;
    if (gender && m.gender !== gender) return false;
    if (maxPrice && minPrice(m) > maxPrice) return false;
    return true;
  });
  if (sort === "prezzo") results.sort((a, b) => minPrice(a) - minPrice(b));
  else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else results.sort((a, b) => b.sales - a.sales);
  return results;
}

export const euro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

// Catalogue code shown in the editorial UI, e.g. "PA_0001".
export const modelCode = (m: Model) => `PA_${String(m.position).padStart(4, "0")}`;
