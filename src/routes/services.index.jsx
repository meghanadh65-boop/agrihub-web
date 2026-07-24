import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import droneImg from "@/assets/drone.jpg";
import harvesterImg from "@/assets/harvester.jpg";
import tractorImg from "@/assets/tractor.jpg";
import workforceImg from "@/assets/workforce.jpg";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Agri Services — Drone, Harvester, Tractor, Workforce" },
      {
        name: "description",
        content:
          "Book agriculture services on demand — drone spraying, harvester rental, tractor booking, and skilled workforce.",
      },
      { property: "og:title", content: "FLTY Agri Services" },
      {
        property: "og:description",
        content: "On-demand drone, harvester, tractor and workforce services.",
      },
    ],
  }),
  component: ServicesPage,
});

const imgs = {
  drone: droneImg,
  harvester: harvesterImg,
  tractor: tractorImg,
  workforce: workforceImg,
};

function ServicesPage() {
  return (
    <SiteShell>
      <section className="gradient-hero border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Agri Services, On Demand</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Skilled operators. Fair prices. Genuine machinery. Book any service in minutes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <Card key={s.slug} className="overflow-hidden">
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative h-56 md:h-full">
                  <img
                    src={imgs[s.slug]}
                    alt={s.name}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{s.name}</h3>
                  <p className="mt-2 text-muted-foreground">{s.short}</p>
                  <Link to="/services/$service" params={{ service: s.slug }}>
                    <Button className="mt-5 gap-1.5">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-accent/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              "Choose a service",
              "Enter your farm details",
              "Confirm date & operator",
              "Get the job done",
            ].map((step, i) => (
              <div key={step} className="relative rounded-2xl bg-card p-6 shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </div>
                <div className="mt-3 font-semibold">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-3xl font-bold">Why book with FLTY</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Certified operators & verified partners",
            "Transparent per-acre pricing, no hidden costs",
            "Priority support in your local language",
            "Free reschedule up to 24 hours before",
            "Cash or UPI on completion",
            "GPS-tracked service where available",
          ].map((b) => (
            <div
              key={b}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
