import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Users, Sprout, TrendingUp, Award } from "lucide-react";
import heroImg from "@/assets/hero-farm.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FLTY — Empowering Indian Farmers" },
      { name: "description", content: "FLTY is a farmer-first agri commerce and services platform bringing quality inputs and machinery to every village." },
      { property: "og:title", content: "About FLTY" },
      { property: "og:description", content: "Farmer-first agri commerce and on-demand services." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 to-foreground/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <span className="rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-semibold text-foreground">About FLTY</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-background sm:text-5xl">
            Building the future of farming, from the ground up.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-background/85">
            FLTY brings together an agri e-commerce marketplace and on-demand machinery services in a single, farmer-friendly platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <Card className="p-8">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-yellow">
              <Sprout className="h-6 w-6 text-foreground" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Our Mission</h2>
            <p className="mt-2 text-muted-foreground">
              Put the tools of modern agriculture — genuine inputs, drone spraying, harvesters and skilled workforce — within
              reach of every farmer, in every language.
            </p>
          </Card>
          <Card className="p-8">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Our Vision</h2>
            <p className="mt-2 text-muted-foreground">
              A profitable, sustainable rural economy where every farmer has fair access to technology, transparent prices,
              and dependable support.
            </p>
          </Card>
        </div>
      </section>

      <section className="bg-accent/40 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          {[
            { n: "6,000+", l: "Villages served" },
            { n: "1.2 L+", l: "Farmer families" },
            { n: "400+", l: "Certified service partners" },
            { n: "12+", l: "States covered" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-card p-6 text-center shadow-soft">
              <div className="text-3xl font-extrabold text-primary">{s.n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold">What we offer</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: Users, title: "Marketplace", body: "Seeds, nutrition, crop protection and tools from top brands." },
            { icon: TrendingUp, title: "Agri Services", body: "Drone, harvester, tractor and workforce, booked on demand." },
            { icon: Award, title: "Advisory", body: "Free multilingual agronomy help before, during and after purchase." },
          ].map((f) => (
            <Card key={f.title} className="p-6">
              <f.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/shop"><Button size="lg">Start Shopping</Button></Link>
          <Link to="/services"><Button size="lg" variant="outline">Explore Services</Button></Link>
        </div>
      </section>
    </SiteShell>
  );
}
