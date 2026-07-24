import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { categories, products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ShieldCheck, Truck, Star, Store, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    return {
      meta: [
        { title: p ? `${p.name} — FLTY` : "Product — FLTY" },
        { name: "description", content: p?.desc ?? "Product detail" },
        { property: "og:title", content: p?.name ?? "Product" },
        { property: "og:description", content: p?.desc ?? "Product detail" },
      ],
    };
  },
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
          Back to Shop
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <div className="p-10 text-center">Error loading product.</div>
    </SiteShell>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = categories.find((c) => c.slug === product.category);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const [qty, setQty] = useState(1);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const { add } = useCart();
  const navigate = useNavigate();
  const addToCart = () => {
    add(product, qty);
    toast.success(`${product.name} added to cart`);
  };
  const buyNow = () => {
    add(product, qty);
    navigate({ to: "/cart" });
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            to="/category/$slug"
            params={{ slug: product.category }}
            className="hover:text-primary"
          >
            {category?.name}
          </Link>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="grid aspect-square place-items-center rounded-3xl bg-accent text-[10rem]">
            {category?.emoji}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.seller}
            </div>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">· 2,341 farmers</span>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-primary">₹{product.price}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
                  <span className="rounded-full bg-brand-green/15 px-2.5 py-0.5 text-sm font-bold text-primary">
                    Save {off}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {product.unit} · inclusive of taxes
            </div>

            <p className="mt-6 text-muted-foreground">{product.desc}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1" onClick={addToCart}>
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 bg-brand-yellow text-foreground hover:brightness-95"
                onClick={buyNow}
              >
                Buy Now
              </Button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, text: "Village delivery in 3–5 days" },
                { icon: ShieldCheck, text: "100% genuine products" },
                { icon: Store, text: "Sold by verified sellers" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2 rounded-xl bg-accent/50 p-3 text-xs"
                >
                  <f.icon className="h-4 w-4 text-primary" /> {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Related products</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <Link to="/product/$id" params={{ id: p.id }} className="flex flex-col">
                    <div className="grid aspect-square place-items-center bg-accent/50 text-6xl">
                      {categories.find((c) => c.slug === p.category)?.emoji}
                    </div>
                    <div className="p-4">
                      <div className="line-clamp-2 text-sm font-semibold">{p.name}</div>
                      <div className="mt-2 text-lg font-bold text-primary">₹{p.price}</div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}
