import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, ShieldCheck, Truck, Sparkles, Leaf, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { categories, products, services } from "@/lib/data";
import heroImg from "@/assets/hero-farm.jpg";
import droneImg from "@/assets/drone.jpg";
import harvesterImg from "@/assets/harvester.jpg";
import tractorImg from "@/assets/tractor.jpg";
import workforceImg from "@/assets/workforce.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FLTY — Agri Shop & Services for Farmers" },
      { name: "description", content: "Shop seeds, fertilizers, and crop protection. Book drones, harvesters, tractors, and workforce on demand." },
      { property: "og:title", content: "FLTY — Agri Shop & Services for Farmers" },
      { property: "og:description", content: "Farmer-first e-commerce with drone, harvester, tractor and workforce booking." },
    ],
  }),
  component: HomePage,
});

const serviceImages: Record<string, string> = {
  drone: droneImg,
  harvester: harvesterImg,
  tractor: tractorImg,
  workforce: workforceImg,
};

function HomePage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
        </div>
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-semibold text-foreground">
            <Leaf className="h-3.5 w-3.5" /> {t("hero.tag")}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-background sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-background/85">{t("hero.subtitle")}</p>

          <div className="mt-8 flex max-w-xl rounded-full bg-background p-1.5 shadow-warm">
            <Search className="ml-4 h-5 w-5 self-center text-muted-foreground" />
            <Input
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              placeholder={t("common.search")}
            />
            <Link to="/shop">
              <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-brand-green-dark">
                {t("cta.shop")}
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/services">
              <Button size="lg" variant="secondary" className="bg-brand-yellow text-foreground hover:brightness-95">
                {t("cta.explore")} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader title={t("home.categories")} viewAll="/shop" viewAllLabel={t("cta.viewAll")} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-3xl transition-colors group-hover:bg-brand-yellow">
                {c.emoji}
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{c.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.blurb}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-accent/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader title={t("home.services")} viewAll="/services" viewAllLabel={t("cta.viewAll")} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                to="/services/$service"
                params={{ service: s.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={serviceImages[s.slug]}
                    alt={s.name}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-lg font-bold text-background">{s.name}</div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground">{s.short}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                    {t("cta.book")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader title={t("home.featured")} viewAll="/shop" viewAllLabel={t("cta.viewAll")} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* OFFERS BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="gradient-brand relative overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-background/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-primary-foreground">
              <div className="text-xs font-bold uppercase tracking-widest opacity-90">{t("home.offers")}</div>
              <h3 className="mt-2 text-3xl font-extrabold md:text-4xl">Kharif Season Sale — up to 25% off</h3>
              <p className="mt-2 max-w-lg opacity-90">Save big on seeds, fertilizers and crop protection this season. Limited stock.</p>
            </div>
            <Link to="/shop">
              <Button size="lg" className="bg-background text-foreground hover:bg-brand-yellow">
                {t("cta.shop")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-bold text-foreground">{t("home.why")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Trusted brands", body: "Genuine products sourced directly from manufacturers." },
            { icon: Truck, title: "Village delivery", body: "Doorstep delivery to 6,000+ villages across India." },
            { icon: Sparkles, title: "Expert support", body: "Free agronomist advice in your local language." },
          ].map((f) => (
            <Card key={f.title} className="border-border p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-yellow">
                <f.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeader({ title, viewAll, viewAllLabel }: { title: string; viewAll: string; viewAllLabel: string }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      <Link to={viewAll} className="text-sm font-semibold text-primary hover:underline">
        {viewAllLabel} →
      </Link>
    </div>
  );
}

export function ProductCard({ product }: { product: import("@/lib/data").Product }) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-square overflow-hidden bg-accent/50">
        <div className="grid h-full w-full place-items-center text-6xl">
          {categories.find((c) => c.slug === product.category)?.emoji ?? "🌾"}
        </div>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-green px-2 py-0.5 text-xs font-bold text-primary-foreground">
            {off}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{product.seller}</div>
        <div className="mt-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
          {product.name}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{product.unit}</div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />
          {product.rating}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">₹{product.price}</span>
          {off > 0 && <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>}
        </div>
      </div>
    </Link>
  );
}
