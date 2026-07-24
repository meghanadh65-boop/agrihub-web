import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FLTY — We're here to help" },
      { name: "description", content: "Talk to our farmer support team via phone, WhatsApp or email. Multilingual assistance available." },
      { property: "og:title", content: "Contact FLTY" },
      { property: "og:description", content: "Farmer support in your local language." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <section className="gradient-hero border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl">We're here to help</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Questions about a product, order or service? Reach out and our team will get back within an hour.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
        {[
          { icon: Phone, title: "Call us", body: "+91 98765 43210", sub: "Mon – Sat, 8am – 8pm" },
          { icon: MessageCircle, title: "WhatsApp", body: "+91 98765 43210", sub: "Instant chat support" },
          { icon: Mail, title: "Email", body: "support@flty.in", sub: "Reply within 4 hours" },
        ].map((c) => (
          <Card key={c.title} className="p-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-yellow">
              <c.icon className="h-6 w-6 text-foreground" />
            </div>
            <div className="mt-4 text-lg font-semibold">{c.title}</div>
            <div className="mt-1 text-base font-medium text-primary">{c.body}</div>
            <div className="text-sm text-muted-foreground">{c.sub}</div>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 md:grid-cols-2">
        <Card className="p-8">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          {sent ? (
            <div className="mt-6 rounded-xl bg-primary/10 p-6 text-center">
              <div className="text-lg font-semibold text-primary">Thanks! We got your message.</div>
              <p className="mt-2 text-sm text-muted-foreground">Our team will reach out shortly.</p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                toast.success("Message sent!");
              }}
            >
              <div>
                <Label htmlFor="name">{t("common.name")}</Label>
                <Input id="name" required className="mt-1.5" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">{t("common.phone")}</Label>
                  <Input id="phone" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">{t("common.email")}</Label>
                  <Input id="email" type="email" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="msg">{t("common.message")}</Label>
                <Textarea id="msg" rows={4} required className="mt-1.5" />
              </div>
              <Button type="submit" size="lg" className="w-full">Send message</Button>
            </form>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">Head office</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Plot 42, Agri-Tech Park<br />
                  Gachibowli, Hyderabad, 500032<br />
                  Telangana, India
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">Working hours</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Monday – Saturday · 8:00 AM to 8:00 PM<br />
                  Sunday · 9:00 AM to 2:00 PM
                </div>
              </div>
            </div>
          </Card>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="FLTY Office Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=78.34%2C17.42%2C78.42%2C17.46&layer=mapnik"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
