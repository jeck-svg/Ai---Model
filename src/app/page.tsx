import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ProcessPath } from "@/components/ProcessPath";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1">
        <ProcessPath />
      </main>
      <Footer />
    </>
  );
}
