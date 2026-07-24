import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { z } from "zod";

const search = z.object({
  ref: z.string().optional(),
  service: z.string().optional(),
});

export const Route = createFileRoute("/booking/success")({
  validateSearch: (raw) => search.parse(raw),
  head: () => ({
    meta: [
      { title: "Booking Confirmed — FLTY" },
      { name: "description", content: "Your booking has been confirmed." },
      { property: "og:title", content: "Booking Confirmed" },
      { property: "og:description", content: "Booking confirmation on FLTY." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { ref, service } = Route.useSearch();
  const { t } = useI18n();
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-green/15">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold">{t("book.success")}</h1>
        <p className="mt-3 text-muted-foreground">{t("book.successSub")}</p>
        <Card className="mt-8 w-full p-6 text-left">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground">Reference</span>
            <span className="font-mono font-bold">{ref ?? "FLT000000"}</span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">Service</span>
            <span className="font-semibold capitalize">{service ?? "—"}</span>
          </div>
        </Card>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/orders"><Button size="lg">View My Bookings</Button></Link>
          <Link to="/"><Button size="lg" variant="outline">Back to Home</Button></Link>
        </div>
      </div>
    </SiteShell>
  );
}
