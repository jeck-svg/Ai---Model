// Generates one photorealistic portrait per mock model into public/models/<id>.jpg.
// The people do not exist: these are demo images until real models upload their photos.
// The committed photos were generated with Higgsfield (Soul 2.0 and GPT Image 2.5);
// this script is an alternative way to regenerate them with an OpenAI key.
//
// Usage: put OPENAI_API_KEY=... in .env.local, then `npm run generate:photos`.
// Existing files are skipped; pass --force to regenerate them.

import { existsSync, readdirSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

const MODEL = process.env.IMAGE_MODEL || "gpt-image-1";
const OUT_DIR = new URL("../public/models/", import.meta.url);
const MANIFEST = new URL("../src/lib/model-photos.json", import.meta.url);
const force = process.argv.includes("--force");

const PEOPLE = {
  "giulia-r": "a 26-year-old Italian woman with long natural red hair, freckles and green eyes, fresh minimal makeup",
  "marco-b": "a 32-year-old Italian man with an athletic build, short dark hair, a trimmed beard and visible arm tattoos, wearing a plain sports t-shirt",
  "aisha-k": "a 24-year-old tall Black woman with voluminous curly hair and dark skin, elegant editorial look",
  "luca-m": "a 45-year-old Southern Italian man with salt-and-pepper hair, a warm reassuring smile, wearing a light blue shirt",
  "sofia-l": "a 21-year-old Italian woman with long blonde hair and a bright smile, casual Gen Z lifestyle style",
  "kenji-t": "a 29-year-old Japanese man with shoulder-length black hair, minimal streetwear outfit",
  "elena-v": "a 63-year-old elegant Italian woman with short white hair, pearl earrings and a soft smile",
  "alex-p": "a 27-year-old androgynous non-binary person with a buzz cut, a few facial piercings and striking features",
  "davide-c": "a 38-year-old Mediterranean man with a dark beard, wearing a smart business blazer",
  "chiara-n": "a 30-year-old Italian woman with long dark brown hair tied back, athletic, wearing a yoga top",
  "omar-s": "a 23-year-old North African Italian man with curly dark hair, streetwear hoodie",
  "francesca-d": "a 35-year-old Italian woman with shoulder-length chestnut hair, natural look, friendly mom-next-door vibe",
};

const prompt = (who) =>
  `Professional model agency portfolio headshot, photorealistic, of ${who}. ` +
  `Head and shoulders, looking at the camera, soft studio lighting, neutral light grey background, ` +
  `85mm lens, natural skin texture, high detail. Fully clothed, no text, no logos, no watermark.`;

async function generate(id, who) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt(who),
      size: "1024x1536",
      quality: "medium",
      output_format: "jpeg",
      output_compression: 85,
      n: 1,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || `HTTP ${res.status}`);
  await writeFile(new URL(`${id}.jpg`, OUT_DIR), Buffer.from(json.data[0].b64_json, "base64"));
}

if (!process.env.OPENAI_API_KEY) {
  console.error("Manca OPENAI_API_KEY in .env.local");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
let failed = 0;
for (const [id, who] of Object.entries(PEOPLE)) {
  if (!force && existsSync(new URL(`${id}.jpg`, OUT_DIR))) {
    console.log(`= ${id} (già presente)`);
    continue;
  }
  try {
    await generate(id, who);
    console.log(`✓ ${id}`);
  } catch (err) {
    failed++;
    console.error(`✗ ${id}: ${err.message}`);
  }
}
// The app reads this list to know which models have a photo.
const ids = readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".jpg"))
  .map((f) => f.slice(0, -4))
  .sort();
await writeFile(MANIFEST, JSON.stringify(ids, null, 2) + "\n");
process.exit(failed ? 1 : 0);
