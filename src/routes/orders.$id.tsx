import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Phone, CheckCircle2, Circle, Package, ArrowLeft } from "lucide-react";
import { StatusBadge } from "./orders.index";
import { z } from "zod";

const search = z.object({ placed: z.number().optional() });

export const Route = createFileRoute("/orders/$id")({
  validateSearch: (raw) => search.parse(raw),
  head: () => ({
    meta: [
      { title: "Order details — FLTY" },
      { name: "description", content: "Track your FLTY order status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetail,
});

const STEPS = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
const LABELS: Record<string, string> = {
  placed: "Order placed",
  confirmed: "Confirmed by seller",
  packed: "Packed for dispatch",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

function OrderDetail() {
  const { id } = Route.useParams();
  const { placed } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  async function loadAll() {
    const [o, i, e] = await Promise.all([
      supabase.from("orders").select("*").eq("id", id).maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", id),
      supabase.from("status_events").select("*").eq("entity_id", id).eq("entity_type", "order").order("created_at"),
    ]);
    setOrder(o.data);
    setItems(i.data ?? []);
    setEvents(e.data ?? []);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    loadAll();
    // Realtime subscription for status updates
    const ch = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "status_events", filter: `entity_id=eq.${id}` }, () => loadAll())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, () => loadAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, id]);

  async function simulate(next: string) {
    await supabase.from("orders").update({ status: next }).eq("id", id);
    await supabase.from("status_events").insert({
      user_id: user!.id, entity_type: "order", entity_id: id, status: next,
      note: `Status updated to ${LABELS[next] ?? next}`,
    });
  }

  if (loading || !user || !order) {
    return <SiteShell><div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></SiteShell>;
  }

  const currentIdx = STEPS.indexOf(order.status);
  const nextStep = STEPS[currentIdx + 1];

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        {placed && (
          <Card className="mt-4 flex items-center gap-3 border-primary/40 bg-brand-green/10 p-4">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold">Order placed successfully!</div>
              <div className="text-sm text-muted-foreground">You'll receive updates on WhatsApp and here.</div>
            </div>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Order · {new Date(order.created_at).toLocaleString()}</div>
            <h1 className="mt-1 font-mono text-2xl font-bold">#{id.slice(0, 8).toUpperCase()}</h1>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <Card className="mt-6 p-6">
          <h2 className="mb-6 text-lg font-bold">Order tracking</h2>
          <ol className="relative border-l-2 border-border pl-6">
            {STEPS.map((s, idx) => {
              const reached = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              const event = events.find((e) => e.status === s);
              return (
                <li key={s} className="relative mb-6 last:mb-0">
                  <span className={`absolute -left-[33px] grid h-6 w-6 place-items-center rounded-full border-2 ${reached ? "border-primary bg-primary" : "border-border bg-background"}`}>
                    {reached ? <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> : <Circle className="h-2 w-2 text-muted-foreground" />}
                  </span>
                  <div className={reached ? "" : "opacity-50"}>
                    <div className={`font-semibold ${isCurrent ? "text-primary" : ""}`}>{LABELS[s]}</div>
                    {event && <div className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</div>}
                  </div>
                </li>
              );
            })}
          </ol>
          {nextStep && (
            <div className="mt-4 border-t border-dashed border-border pt-4">
              <Button variant="outline" size="sm" onClick={() => simulate(nextStep)}>
                Simulate: mark as {LABELS[nextStep]}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">Demo: in production, sellers push these updates.</p>
            </div>
          )}
        </Card>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-semibold"><Package className="h-4 w-4" /> Items ({items.length})</h3>
            <ul className="mt-4 divide-y divide-border">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.seller} · Qty {i.quantity}</div>
                  </div>
                  <div className="font-semibold">₹{i.unit_price * i.quantity}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-3 text-base font-bold">
              <span>Total</span><span className="text-primary">₹{order.total}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Payment: {order.payment_method.toUpperCase()} · {order.payment_status}</div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Delivery address</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="font-medium">{order.contact_name}</div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{order.address_line}, {order.village}{order.district ? `, ${order.district}` : ""}{order.pincode ? ` - ${order.pincode}` : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {order.contact_phone}</div>
              {order.notes && <div className="mt-2 rounded-md bg-accent/50 p-3 text-xs">{order.notes}</div>}
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
