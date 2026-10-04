import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { MatchingProvider } from "@/components/MatchingSearchForm";
import { getModels } from "@/lib/catalog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Technical/editorial look: monospace for text and labels, a grotesk for big display type.
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pola.AI — Diritti AI dei modelli",
  description: "Trova un modello e acquista la licenza per usare il suo volto con l'AI.",
};

// Header and footer live in the (site) layout; the home page draws its own hero header.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const models = await getModels();
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <MatchingProvider models={models}>{children}</MatchingProvider>
      </body>
    </html>
  );
}
