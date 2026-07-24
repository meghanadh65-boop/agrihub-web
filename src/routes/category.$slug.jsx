import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { categories, products } from "@/lib/data";
import { ProductCard } from "./index";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    const title = cat ? `${cat.name} — FLTY Shop` : "Category — FLTY";
    return {
      meta: [
        { title },
        { name: "description", content: cat?.blurb ?? "Browse agri products" },
        { property: "og:title", content: title },
        { property: "og:description", content: cat?.blurb ?? "Browse agri products" },
      ],
    };
  },
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
          Back to Shop
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">Something went wrong.</div>
    </SiteShell>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = products.filter((p) => p.category === category.slug);
  return (
    <SiteShell>
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.name}</span>
          </nav>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white shadow-md bg-gray-50">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{category.name}</h1>
              <p className="text-muted-foreground">{category.blurb}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 text-sm text-muted-foreground">{list.length} products</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
