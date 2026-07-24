import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Store } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "./index";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import shopImg from "@/assets/shop.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Agri Products — FLTY" },
      { name: "description", content: "Browse seeds, fertilizers, crop protection, fungicides, insecticides and farm tools from trusted brands." },
      { property: "og:title", content: "FLTY Shop" },
      { property: "og:description", content: "Everything for your farm, delivered." },
    ],
  }),
  component: ShopPage,
});

const stores = [
  { name: "Krishna Agri Store", city: "Warangal", km: 2.4 },
  { name: "Balaji Seeds & Fertilizers", city: "Karimnagar", km: 4.1 },
  { name: "GreenLeaf Traders", city: "Nizamabad", km: 6.7 },
];

function ShopPage() {
  const { t } = useI18n();
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");
  const filtered = products.filter(
    (p) => (active === "all" || p.category === active) && p.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-border">
        <img src={shopImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" width={1280} height={800} />
        <div className="absolute inset-0 gradient-hero mix-blend-multiply" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Shop</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Quality agri inputs from top Indian brands.</p>
          <div className="mt-6 flex max-w-2xl rounded-full bg-card p-1.5 shadow-soft">
            <Search className="ml-4 h-5 w-5 self-center text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              placeholder={t("common.search")}
            />
            <Button className="rounded-full">Search</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <Chip active={active === "all"} onClick={() => setActive("all")}>All</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={active === c.slug} onClick={() => setActive(c.slug)}>
              <span className="mr-1">{c.emoji}</span> {c.name}
            </Chip>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Nearby stores
              </div>
              <ul className="space-y-3">
                {stores.map((s) => (
                  <li key={s.name} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.city} · {s.km} km away</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
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
                      <span>{c.emoji} {c.name}</span>
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
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
