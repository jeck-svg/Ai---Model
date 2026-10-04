import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ProcessPath } from "@/components/ProcessPath";
import { getModels } from "@/lib/catalog";

export default async function Home() {
  const faces = (await getModels()).map(({ id, name }) => ({ id, name }));
  return (
    <>
      <Hero />
      <main className="flex-1">
        <ProcessPath faces={faces} />
      </main>
      <Footer />
    </>
  );
}
