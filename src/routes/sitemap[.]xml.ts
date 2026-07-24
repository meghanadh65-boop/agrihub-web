import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { categories, products, services } from "@/lib/data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/",
          "/about",
          "/contact",
          "/shop",
          "/services",
          "/orders",
          ...services.map((s) => `/services/${s.slug}`),
          ...categories.map((c) => `/category/${c.slug}`),
          ...products.map((p) => `/product/${p.id}`),
        ];
        const urls = paths.map((p) =>
          `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
