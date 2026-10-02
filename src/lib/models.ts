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

function licenses(base: number): License[] {
  return [
    {
      tier: "base",
      name: "Base",
      price: base,
      durationMonths: 6,
      territory: "Italia",
      usages: ["Social media organici", "Contenuti web"],
      generations: "Fino a 50 immagini AI",
    },
    {
      tier: "standard",
      name: "Standard",
      price: Math.round(base * 2.5),
      durationMonths: 12,
      territory: "Europa",
      usages: ["Social media e ads", "E-commerce", "Newsletter"],
      generations: "Fino a 500 immagini AI + 10 video",
    },
    {
      tier: "premium",
      name: "Premium",
      price: Math.round(base * 6),
      durationMonths: 24,
      territory: "Mondo",
      usages: ["Campagne ADV", "TV e cinema", "Out of home", "E-commerce"],
      generations: "Immagini e video illimitati",
    },
  ];
}

export const MODELS: Model[] = [
  { id: "giulia-r", name: "Giulia R.", age: 26, gender: "donna", city: "Milano", categories: ["Moda", "Beauty"], tags: ["capelli rossi", "lentiggini", "occhi verdi"], bio: "Modella moda e beauty con 6 anni di esperienza su campagne internazionali. Volto naturale, perfetto per skincare e campagne editoriali.", rating: 4.9, reviews: 128, sales: 312, palette: ["#f97316", "#be123c"], licenses: licenses(180) },
  { id: "marco-b", name: "Marco B.", age: 32, gender: "uomo", city: "Roma", categories: ["Fitness", "Commercial"], tags: ["atletico", "barba", "tatuaggi"], bio: "Personal trainer e modello fitness. Fisico atletico, ideale per sportswear, integratori e brand outdoor.", rating: 4.8, reviews: 94, sales: 201, palette: ["#0ea5e9", "#1e3a8a"], licenses: licenses(150) },
  { id: "aisha-k", name: "Aisha K.", age: 24, gender: "donna", city: "Torino", categories: ["Moda", "Editoriale"], tags: ["capelli ricci", "alta", "pelle scura"], bio: "Volto editoriale per riviste di moda. Grande versatilità espressiva, dal look minimal all'haute couture.", rating: 5.0, reviews: 76, sales: 188, palette: ["#a855f7", "#4c1d95"], licenses: licenses(220) },
  { id: "luca-m", name: "Luca M.", age: 45, gender: "uomo", city: "Napoli", categories: ["Commercial", "Cinema"], tags: ["brizzolato", "sorriso", "papà"], bio: "Attore e modello commercial. Il volto rassicurante per banche, assicurazioni e food.", rating: 4.7, reviews: 63, sales: 140, palette: ["#64748b", "#0f172a"], licenses: licenses(130) },
  { id: "sofia-l", name: "Sofia L.", age: 21, gender: "donna", city: "Firenze", categories: ["Lifestyle", "Beauty"], tags: ["bionda", "gen z", "sorriso"], bio: "Content creator e modella lifestyle. Perfetta per brand rivolti a un pubblico giovane.", rating: 4.9, reviews: 151, sales: 420, palette: ["#facc15", "#ea580c"], licenses: licenses(120) },
  { id: "kenji-t", name: "Kenji T.", age: 29, gender: "uomo", city: "Milano", categories: ["Moda", "Editoriale"], tags: ["capelli lunghi", "minimal", "streetwear"], bio: "Modello moda specializzato in streetwear e campagne concettuali.", rating: 4.8, reviews: 58, sales: 97, palette: ["#10b981", "#064e3b"], licenses: licenses(170) },
  { id: "elena-v", name: "Elena V.", age: 63, gender: "donna", city: "Bologna", categories: ["Senior", "Commercial"], tags: ["capelli bianchi", "elegante", "nonna"], bio: "Modella senior per campagne pharma, travel e lifestyle. Eleganza senza tempo.", rating: 5.0, reviews: 41, sales: 85, palette: ["#e11d48", "#881337"], licenses: licenses(140) },
  { id: "alex-p", name: "Alex P.", age: 27, gender: "non-binario", city: "Milano", categories: ["Moda", "Beauty", "Editoriale"], tags: ["androgino", "rasato", "piercing"], bio: "Volto androgino per moda, beauty e campagne inclusive.", rating: 4.9, reviews: 70, sales: 133, palette: ["#ec4899", "#6d28d9"], licenses: licenses(190) },
  { id: "davide-c", name: "Davide C.", age: 38, gender: "uomo", city: "Bari", categories: ["Lifestyle", "Commercial"], tags: ["mediterraneo", "barba", "business"], bio: "Modello lifestyle e corporate. Ideale per tech, automotive e finance.", rating: 4.6, reviews: 52, sales: 110, palette: ["#f59e0b", "#78350f"], licenses: licenses(110) },
  { id: "chiara-n", name: "Chiara N.", age: 30, gender: "donna", city: "Roma", categories: ["Fitness", "Lifestyle"], tags: ["yoga", "mora", "atletica"], bio: "Istruttrice di yoga e modella fitness per brand wellness e activewear.", rating: 4.8, reviews: 88, sales: 176, palette: ["#14b8a6", "#155e75"], licenses: licenses(140) },
  { id: "omar-s", name: "Omar S.", age: 23, gender: "uomo", city: "Genova", categories: ["Moda", "Lifestyle"], tags: ["capelli ricci", "gen z", "streetwear"], bio: "Giovane modello per brand urban, sneakers e musica.", rating: 4.7, reviews: 39, sales: 74, palette: ["#6366f1", "#1e1b4b"], licenses: licenses(100) },
  { id: "francesca-d", name: "Francesca D.", age: 35, gender: "donna", city: "Verona", categories: ["Cinema", "Commercial"], tags: ["mamma", "castana", "naturale"], bio: "Attrice e modella commercial, volto ideale per famiglia, casa e food.", rating: 4.9, reviews: 67, sales: 152, palette: ["#84cc16", "#365314"], licenses: licenses(130) },
];

export function getModel(id: string) {
  return MODELS.find((m) => m.id === id);
}

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

export function searchModels({ q, category, gender, maxPrice, sort }: SearchFilters) {
  const terms = (q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const results = MODELS.filter((m) => {
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
export const modelCode = (m: Model) => `PA_${String(MODELS.indexOf(m) + 1).padStart(4, "0")}`;
