import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { services } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Star, CheckCircle2, MapPin, Clock } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { supabase } from "@/integrations/supabase/client";
import droneImg from "@/assets/drone.jpg";
import harvesterImg from "@/assets/harvester.jpg";
import tractorImg from "@/assets/tractor.jpg";
import workforceImg from "@/assets/workforce.jpg";
import { useEffect, useState } from "react";

const imgs = {
  drone: droneImg,
  harvester: harvesterImg,
  tractor: tractorImg,
  workforce: workforceImg,
};

const info = {
  drone: {
    benefits: [
      "90% less water usage",
      "10× faster than manual",
      "Even, precise coverage",
      "Reduces chemical drift",
    ],
    includes: [
      "Certified drone pilot",
      "DGCA-approved drone",
      "Chemical mixing support",
      "GPS-mapped spraying",
    ],
    price: "₹320+/acre",
  },
  harvester: {
    benefits: [
      "Faster harvest, less grain loss",
      "Trained combine operators",
      "Flexible per-acre or per-hour",
      "Insured machinery",
    ],
    includes: ["Combine harvester", "Skilled operator", "Diesel included", "Transport to site"],
    price: "₹1,750+/acre",
  },
  tractor: {
    benefits: [
      "Ploughing, tilling & haulage",
      "Multiple implements available",
      "Hourly & daily rates",
      "Trusted local vendors",
    ],
    includes: ["Tractor + operator", "Choice of implement", "Fuel included", "On-time arrival"],
    price: "₹620+/hour",
  },
  workforce: {
    benefits: [
      "Skilled and semi-skilled workers",
      "Sowing, weeding, harvesting",
      "Construction & maintenance",
      "Daily or contract basis",
    ],
    includes: ["Group of workers", "Supervisor on-site", "Basic tools", "Attendance tracking"],
    price: "₹430+/worker-day",
  },
};

export const Route = createFileRoute("/services/$service")({
  head: ({ params }) => {
    const s = services.find((x) => x.slug === params.service);
    return {
      meta: [
        { title: s ? `${s.name} — Book on FLTY` : "Service — FLTY" },
        { name: "description", content: s?.short ?? "Book an agri service on FLTY." },
        { property: "og:title", content: s ? `${s.name} — FLTY` : "FLTY Service" },
        { property: "og:description", content: s?.short ?? "Book on-demand agri services." },
      ],
    };
  },
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.service);
    if (!service) throw notFound();
    return { service };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-primary hover:underline">
          Back to Services
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <div className="p-10 text-center">Error loading service.</div>
    </SiteShell>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const meta = info[service.slug];
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    supabase
      .from("service_providers")
      .select("id, name, area, rating, price_per_acre, price_unit")
      .eq("service_slug", service.slug)
      .eq("available", true)
      .then(({ data }) => {
        setProviders(data ?? []);
      });
  }, [service.slug]);

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <img
          src={imgs[service.slug]}
          alt={service.name}
          width={1280}
          height={800}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 to-foreground/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold text-foreground">
            FLTY Service
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-background sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-background/85">{service.short}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-sm font-semibold text-foreground">
            Starting at <span className="text-primary">{meta.price}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_440px]">
        <div className="space-y-10">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold">Why book this service</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {meta.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> {b}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold">What's included</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {meta.includes.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-yellow" /> {i}
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <h2 className="text-2xl font-bold">Available providers</h2>
            <div className="mt-4 space-y-3">
              {providers.map((p) => (
                <Card key={p.id} className="flex items-center justify-between p-5">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {p.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Same day
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">
                      ₹{p.price_per_acre}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        /{p.price_unit}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 rounded-full bg-brand-yellow/25 px-2 py-0.5 text-xs font-semibold">
                      <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" /> {p.rating}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm service={service.slug} providers={providers} />
        </div>
      </section>
    </SiteShell>
  );
}
