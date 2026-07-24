import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Wrench } from "lucide-react";

export const Route = createFileRoute("/orders")({
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

const orders = [
  { id: "ORD10231", date: "Jul 18, 2026", items: "Urea 46% × 2, DAP × 1", total: 2090, status: "Delivered" },
  { id: "ORD10195", date: "Jul 12, 2026", items: "Kaveri Cotton Seeds × 3", total: 2550, status: "In transit" },
];
const bookings = [
  { id: "FLT882301", date: "Aug 04, 2026", service: "Drone Spraying", acres: 8, status: "Confirmed" },
  { id: "FLT881120", date: "Jul 22, 2026", service: "Tractor Booking", acres: 4, status: "Completed" },
];

function OrdersPage() {
  return (
    <SiteShell>
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">My Orders & Bookings</h1>
          <p className="mt-2 text-muted-foreground">Track everything you've ordered and booked in one place.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" />Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2"><Wrench className="h-4 w-4" />Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6 space-y-3">
            {orders.map((o) => (
              <Card key={o.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">{o.id} · {o.date}</div>
                  <div className="mt-1 font-semibold">{o.items}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">₹{o.total}</span>
                  <Badge variant={o.status === "Delivered" ? "default" : "secondary"}>{o.status}</Badge>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="mt-6 space-y-3">
            {bookings.map((b) => (
              <Card key={b.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">{b.id} · {b.date}</div>
                  <div className="mt-1 font-semibold">{b.service} · {b.acres} acres</div>
                </div>
                <Badge variant={b.status === "Completed" ? "secondary" : "default"}>{b.status}</Badge>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-10 text-sm text-muted-foreground">
          Need something else? <Link to="/contact" className="font-semibold text-primary hover:underline">Contact support</Link>.
        </div>
      </section>
    </SiteShell>
  );
}
