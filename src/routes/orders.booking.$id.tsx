import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Circle, MapPin, Phone, ArrowLeft, Calendar } from "lucide-react";
import { StatusBadge } from "./orders.index";

export const Route = createFileRoute("/orders/booking/$id")({
  head: () => ({
    meta: [
      { title: "Booking details — FLTY" },
      { name: "description", content: "Track your service booking." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingDetail,
});

const STEPS = ["pending", "confirmed", "en_route", "in_progress", "completed"];
const LABELS: Record<string, string> = {
  pending: "Booking received",
  confirmed: "Provider confirmed",
  en_route: "Provider en-route",
  in_progress: "Work in progress",
  completed: "Completed",
};

function BookingDetail() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  async function loadAll() {
    const [b, e] = await Promise.all([
      supabase.from("bookings").select("*").eq("id", id).maybeSingle(),
      supabase.from("status_events").select("*").eq("entity_id", id).eq("entity_type", "booking").order("created_at"),
    ]);
    setBooking(b.data);
    setEvents(e.data ?? []);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    loadAll();
    const ch = supabase.channel(`booking-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "status_events", filter: `entity_id=eq.${id}` }, () => loadAll())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "bookings", filter: `id=eq.${id}` }, () => loadAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, id]);

  async function simulate(next: string) {
    await supabase.from("bookings").update({ status: next }).eq("id", id);
    await supabase.from("status_events").insert({
      user_id: user!.id, entity_type: "booking", entity_id: id, status: next, note: LABELS[next] ?? next,
    });
  }

  if (loading || !user || !booking) {
    return <SiteShell><div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></SiteShell>;
  }

  const currentIdx = STEPS.indexOf(booking.status);
  const nextStep = STEPS[currentIdx + 1];

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to bookings
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground capitalize">{booking.service_slug} booking</div>
            <h1 className="mt-1 text-2xl font-bold">{booking.provider_name}</h1>
            <div className="mt-1 text-sm text-muted-foreground">
              {booking.acres} acres · <Calendar className="mr-0.5 inline h-3.5 w-3.5" />{new Date(booking.scheduled_date).toLocaleDateString()}
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <Card className="mt-6 p-6">
          <h2 className="mb-6 text-lg font-bold">Booking tracking</h2>
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
              <p className="mt-2 text-xs text-muted-foreground">Demo: in production, providers push these updates.</p>
            </div>
          )}
        </Card>

        <Card className="mt-6 p-6">
          <h3 className="font-semibold">Booking details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Contact</div>
              <div className="mt-1 font-medium">{booking.contact_name}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {booking.contact_phone}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Location</div>
              <div className="mt-1 flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> {booking.village}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Rate</div>
              <div className="mt-1">₹{booking.price_per_acre} × {booking.acres}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Total</div>
              <div className="mt-1 text-lg font-bold text-primary">₹{booking.total}</div>
            </div>
          </div>
          {booking.notes && <div className="mt-4 rounded-md bg-accent/50 p-3 text-xs">{booking.notes}</div>}
        </Card>
      </div>
    </SiteShell>
  );
}
