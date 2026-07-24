import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "./index";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import shopImg from "@/assets/shop.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Agri Products — FLTY" },
      {
        name: "description",
        content:
          "Browse seeds, fertilizers, crop protection, fungicides, insecticides and farm tools from trusted brands.",
      },
      { property: "og:title", content: "FLTY Shop" },
      { property: "og:description", content: "Everything for your farm, delivered." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { t } = useI18n();
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = products.filter(
    (p) =>
      (active === "all" || p.category === active) && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  // Pagination Logic
  const itemsPerPage = 24;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (slug) => {
    setActive(slug);
    setPage(1);
  };

  const handleQueryChange = (val) => {
    setQ(val);
    setPage(1);
  };

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={shopImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 gradient-hero mix-blend-multiply" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Shop</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Quality agri inputs from top Indian brands.
          </p>
          <div className="mt-6 flex max-w-2xl rounded-full bg-card p-1.5 shadow-soft">
            <Search className="ml-4 h-5 w-5 self-center text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              placeholder={t("common.search")}
            />

            <Button className="rounded-full">Search</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <Chip active={active === "all"} onClick={() => handleCategoryChange("all")}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={active === c.slug} onClick={() => handleCategoryChange(c.slug)}>
              {c.name}
            </Chip>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <Card className="p-5">
              <div className="font-semibold">Categories</div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
                    >
                      <span>
                        {c.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {products.filter((p) => p.category === c.slug).length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>

          <div>
            <div className="mb-4 text-sm text-muted-foreground">{filtered.length} products</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <Button
                    key={pNum}
                    variant={page === pNum ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 rounded-full ${page === pNum ? "bg-[#09B652] hover:bg-[#052416] text-white" : ""}`}
                    onClick={() => setPage(pNum)}
                  >
                    {pNum}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary hover:text-primary")
      }
    >
      {children}
    </button>
  );
}
