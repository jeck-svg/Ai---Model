import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The brand moved from Velvet Mode to Pola.AI: send the old address to the new one.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "velvet-mode.vercel.app" }],
        destination: "https://pola-ai.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
