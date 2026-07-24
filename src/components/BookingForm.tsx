import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function BookingForm({ service }: { service: string }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <Card className="p-6 md:p-8">
      <h3 className="text-2xl font-bold">{t("book.title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Fill in a few details — our team confirms within 2 hours.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          const ref = "FLT" + Math.floor(100000 + Math.random() * 900000);
          setTimeout(() => {
            navigate({ to: "/booking/success", search: { ref, service } });
          }, 400);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">{t("common.name")}</Label>
            <Input id="name" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">{t("common.phone")}</Label>
            <Input id="phone" required type="tel" className="mt-1.5" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="loc">{t("common.location")}</Label>
            <Input id="loc" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="acres">{t("common.acres")}</Label>
            <Input id="acres" required type="number" min={1} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label htmlFor="date">{t("common.date")}</Label>
          <Input id="date" required type="date" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="notes">{t("common.notes")}</Label>
          <Textarea id="notes" rows={3} className="mt-1.5" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Submitting…" : t("common.submit")}
        </Button>
      </form>
    </Card>
  );
}
