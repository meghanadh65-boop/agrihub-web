import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Wrench, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My Orders & Bookings — FLTY" },
      { name: "description", content: "Track your product orders and service bookings on FLTY." },
      { property: "og:title", content: "My Orders — FLTY" },
      { property: "og:description", content: "Orders and bookings dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    (async () => {
      const [o, b] = await Promise.all([
        supabase
          .from("orders")
          .select("id, created_at, total, status, payment_method")
          .order("created_at", { ascending: false }),
        supabase
          .from("bookings")
          .select(
            "id, created_at, service_slug, provider_name, acres, scheduled_date, total, status",
          )
          .order("created_at", { ascending: false }),
      ]);
      setOrders(o.data ?? []);
      setBookings(b.data ?? []);
    })();
  }, [user, loading, navigate]);

  if (loading || !user || orders === null || bookings === null) {
    return (
      <SiteShell>
        <div className="grid min-h-[400px] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">My Orders & Bookings</h1>
          <p className="mt-2 text-muted-foreground">
            Track everything you've ordered and booked in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Wrench className="h-4 w-4" />
              Bookings ({bookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6 space-y-3">
            {orders.length === 0 && (
              <EmptyState label="No orders yet." link="/shop" cta="Start shopping" />
            )}
            {orders.map((o) => (
              <Link key={o.id} to="/orders/$id" params={{ id: o.id }}>
                <Card className="flex flex-col justify-between gap-3 p-5 transition-shadow hover:shadow-soft sm:flex-row sm:items-center">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Order · {new Date(o.created_at).toLocaleDateString()}
                    </div>
                    <div className="mt-1 font-mono text-sm">{o.id.slice(0, 8).toUpperCase()}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Payment: {o.payment_method.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">₹{o.total}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="mt-6 space-y-3">
            {bookings.length === 0 && (
              <EmptyState label="No bookings yet." link="/services" cta="Book a service" />
            )}
            {bookings.map((b) => (
              <Link key={b.id} to="/orders/booking/$id" params={{ id: b.id }}>
                <Card className="flex flex-col justify-between gap-3 p-5 transition-shadow hover:shadow-soft sm:flex-row sm:items-center">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Booking · {new Date(b.created_at).toLocaleDateString()}
                    </div>
                    <div className="mt-1 font-semibold capitalize">
                      {b.service_slug} · {b.provider_name}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {b.acres} acres · {new Date(b.scheduled_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">₹{b.total}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </section>
    </SiteShell>
  );
}

function EmptyState({ label, link, cta }) {
  return (
    <Card className="p-8 text-center">
      <p className="text-muted-foreground">{label}</p>
      <Link to={link} className="mt-3 inline-block font-semibold text-primary hover:underline">
        {cta} →
      </Link>
    </Card>
  );
}

export function StatusBadge({ status }) {
  const map = {
    placed: "bg-blue-100 text-blue-800",
    confirmed: "bg-brand-yellow/40 text-foreground",
    packed: "bg-brand-yellow/40 text-foreground",
    shipped: "bg-blue-100 text-blue-800",
    out_for_delivery: "bg-orange-100 text-orange-800",
    delivered: "bg-brand-green/20 text-brand-green-dark",
    completed: "bg-brand-green/20 text-brand-green-dark",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-brand-yellow/40 text-foreground",
  };
  return (
    <Badge className={`${map[status] ?? "bg-muted text-foreground"} capitalize font-semibold`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
