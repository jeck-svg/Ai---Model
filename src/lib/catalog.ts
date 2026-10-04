import { cache } from "react";
import { supabase } from "./supabase";
import type { License, LicenseTier, Model } from "./models";

type LicenseRow = {
  tier: LicenseTier;
  name: string;
  price: number;
  duration_months: number;
  territory: string;
  usages: string[];
  generations: string;
};

type ModelRow = Omit<Model, "licenses" | "palette" | "rating"> & {
  rating: number | string;
  palette: string[];
  licenses: LicenseRow[];
};

const TIER_ORDER: LicenseTier[] = ["base", "standard", "premium"];

const toLicense = (l: LicenseRow): License => ({
  tier: l.tier,
  name: l.name,
  price: l.price,
  durationMonths: l.duration_months,
  territory: l.territory,
  usages: l.usages,
  generations: l.generations,
});

const toModel = ({ licenses, palette, rating, ...m }: ModelRow): Model => ({
  ...m,
  rating: Number(rating),
  palette: [palette[0] ?? "#737373", palette[1] ?? "#171717"],
  licenses: licenses.map(toLicense).sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)),
});

// The whole published catalogue, loaded once per request.
export const getModels = cache(async (): Promise<Model[]> => {
  const { data, error } = await supabase
    .from("models")
    .select(
      "id, position, name, age, gender, city, categories, tags, bio, rating, reviews, sales, palette, licenses (tier, name, price, duration_months, territory, usages, generations)",
    )
    .order("position");
  if (error) throw new Error(`Catalogo non disponibile: ${error.message}`);
  return (data as ModelRow[]).map(toModel);
});

export async function getModel(id: string) {
  return (await getModels()).find((m) => m.id === id);
}
