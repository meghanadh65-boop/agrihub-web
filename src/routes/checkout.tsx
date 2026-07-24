import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Truck, Wallet, Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FLTY" },
      { name: "description", content: "Complete your FLTY order." },
      { property: "og:title", content: "Checkout — FLTY" },
      { property: "og:description", content: "Complete your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"cod" | "upi">("cod");
  const [form, setForm] = useState({
    contact_name: "", contact_phone: "", address_line: "", village: "", district: "", pincode: "", notes: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    if (items.length === 0) navigate({ to: "/cart" });
    if (user) {
      setForm((f) => ({ ...f, contact_phone: user.phone ? "+" + user.phone.replace(/^\+/, "") : f.contact_phone }));
    }
  }, [user, loading, items.length, navigate]);

  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + shipping;

  async function place(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        subtotal, shipping, total,
        payment_method: method,
        payment_status: method === "cod" ? "pending" : "pending",
        ...form,
      })
      .select("id")
      .single();

    if (error || !order) {
      setBusy(false);
      toast.error(error?.message ?? "Could not place order");
      return;
    }

    const lineItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.id,
      name: i.name,
      unit_price: i.price,
      quantity: i.quantity,
      seller: i.seller,
    }));
    const { error: liErr } = await supabase.from("order_items").insert(lineItems);
    if (liErr) {
      setBusy(false);
      toast.error(liErr.message);
      return;
    }

    clear();
    navigate({ to: "/orders/$id", params: { id: order.id }, search: { placed: 1 } });
  }

  if (loading || !user || items.length === 0) return null;

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <form onSubmit={place} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold">Delivery details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" id="name" value={form.contact_name} onChange={(v) => setForm({ ...form, contact_name: v })} />
                <Field label="Phone number" id="phone" value={form.contact_phone} onChange={(v) => setForm({ ...form, contact_phone: v })} />
              </div>
              <div className="mt-4">
                <Label htmlFor="addr">Address line</Label>
                <Input id="addr" required className="mt-1.5" value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Village" id="village" value={form.village} onChange={(v) => setForm({ ...form, village: v })} />
                <Field label="District" id="district" value={form.district} onChange={(v) => setForm({ ...form, district: v })} required={false} />
                <Field label="Pincode" id="pin" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} required={false} />
              </div>
              <div className="mt-4">
                <Label htmlFor="notes">Delivery notes (optional)</Label>
                <Textarea id="notes" rows={2} className="mt-1.5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold">Payment method</h2>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                  <RadioGroupItem value="cod" id="cod" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold"><Wallet className="h-4 w-4" /> Cash on Delivery</div>
                    <div className="mt-1 text-xs text-muted-foreground">Pay in cash when your order arrives.</div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                  <RadioGroupItem value="upi" id="upi" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">UPI on delivery</div>
                    <div className="mt-1 text-xs text-muted-foreground">Scan a QR at the door — no cash needed.</div>
                  </div>
                </label>
              </RadioGroup>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> Online card payments coming soon.
              </div>
            </Card>
          </div>

          <Card className="h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between py-2">
                  <div className="pr-2">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {i.quantity}</div>
                  </div>
                  <div className="font-semibold">₹{i.price * i.quantity}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>₹{subtotal}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping ? `₹${shipping}` : <span className="text-primary">FREE</span>}</dd></div>
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold"><dt>Total</dt><dd>₹{total}</dd></div>
            </dl>
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Truck className="mr-1.5 h-4 w-4" /> Place Order</>}
            </Button>
            <Link to="/cart" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary">Back to cart</Link>
          </Card>
        </form>
      </div>
    </SiteShell>
  );
}

function Field({ label, id, value, onChange, required = true }: { label: string; id: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} required={required} className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
