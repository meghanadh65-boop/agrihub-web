import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories } from "@/lib/data";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — FLTY" },
      { name: "description", content: "Review the products in your FLTY cart before checkout." },
      { property: "og:title", content: "Your Cart — FLTY" },
      { property: "og:description", content: "Review and check out your cart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <SiteShell>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-accent">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add products from the shop to get started.</p>
          <Link to="/shop"><Button size="lg" className="mt-6">Browse products</Button></Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold">Your Cart ({count})</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map((i) => {
              const emoji = categories.find((c) => c.slug === i.category)?.emoji ?? "🌾";
              return (
                <Card key={i.id} className="flex gap-4 p-4">
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-accent text-4xl">{emoji}</div>
                  <div className="flex flex-1 flex-col">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{i.seller}</div>
                    <Link to="/product/$id" params={{ id: i.id }} className="mt-0.5 font-semibold hover:text-primary">
                      {i.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{i.unit}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQty(i.id, i.quantity - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQty(i.id, i.quantity + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-foreground">₹{i.price * i.quantity}</div>
                        <Button variant="ghost" size="icon" onClick={() => remove(i.id)} aria-label="Remove">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-medium">₹{subtotal}</dd></div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium">{shipping === 0 ? <span className="text-primary">FREE</span> : `₹${shipping}`}</dd>
              </div>
              {shipping > 0 && (
                <div className="rounded-md bg-brand-yellow/25 p-2 text-xs text-foreground">
                  Add ₹{1000 - subtotal} more for free delivery.
                </div>
              )}
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Total</dt><dd>₹{total}</dd>
              </div>
            </dl>
            <Button size="lg" className="mt-6 w-full" onClick={() => navigate({ to: "/checkout" })}>
              Proceed to Checkout
            </Button>
            <Link to="/shop" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary">
              Continue shopping
            </Link>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
