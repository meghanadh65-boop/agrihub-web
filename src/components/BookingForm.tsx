import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, MapPin, Loader2, LogIn } from "lucide-react";

export type Provider = {
  id: string;
  name: string;
  area: string;
  rating: number;
  price_per_acre: number;
  price_unit: string;
};

export function BookingForm({ service, providers }: { service: string; providers: Provider[] }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState<string>(providers[0]?.id ?? "");
  const provider = providers.find((p) => p.id === providerId) ?? providers[0];
  const [acres, setAcres] = useState<number>(1);
  const total = provider ? provider.price_per_acre * acres : 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) { navigate({ to: "/auth" }); return; }
    if (!provider) return;
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const { data, error } = await supabase.from("bookings").insert({
      user_id: user.id,
      service_slug: service,
      provider_id: provider.id,
      provider_name: provider.name,
      acres,
      scheduled_date: String(form.get("date")),
      contact_name: String(form.get("name")),
      contact_phone: String(form.get("phone")),
      village: String(form.get("loc")),
      price_per_acre: provider.price_per_acre,
      total,
      notes: String(form.get("notes") ?? ""),
    }).select("id").single();
    setLoading(false);
    if (error || !data) { toast.error(error?.message ?? "Booking failed"); return; }
    toast.success("Booking confirmed!");
    navigate({ to: "/orders/booking/$id", params: { id: data.id } });
  }

  return (
    <Card className="p-6 md:p-8">
      <h3 className="text-2xl font-bold">{t("book.title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Pick a provider and confirm — team calls within 2 hours.</p>

      {!user && (
        <div className="mt-4 flex items-center gap-3 rounded-md border border-brand-yellow bg-brand-yellow/20 p-3 text-sm">
          <LogIn className="h-4 w-4" />
          <span className="flex-1">Sign in to book.</span>
          <Link to="/auth" className="font-semibold text-primary hover:underline">Sign in</Link>
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div>
          <Label>Choose provider</Label>
          <div className="mt-2 space-y-2">
            {providers.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${providerId === p.id ? "border-primary bg-accent/50" : "border-border hover:border-primary/50"}`}>
                <input type="radio" name="provider" checked={providerId === p.id} onChange={() => setProviderId(p.id)} className="h-4 w-4 accent-primary" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.area}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />{p.rating}</span>
                  </div>
                </div>
                <div className="text-right text-sm font-bold text-primary">₹{p.price_per_acre}<span className="text-[10px] font-normal text-muted-foreground">/{p.price_unit}</span></div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">{t("common.name")}</Label>
            <Input id="name" name="name" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">{t("common.phone")}</Label>
            <Input id="phone" name="phone" required type="tel" className="mt-1.5" defaultValue={user?.phone ? "+" + user.phone : ""} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="loc">{t("common.location")}</Label>
            <Input id="loc" name="loc" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="acres">{t("common.acres")}</Label>
            <Input id="acres" name="acres" required type="number" min={1} value={acres} onChange={(e) => setAcres(Math.max(1, Number(e.target.value)))} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label htmlFor="date">{t("common.date")}</Label>
          <Input id="date" name="date" required type="date" className="mt-1.5" min={new Date().toISOString().split("T")[0]} />
        </div>
        <div>
          <Label htmlFor="notes">{t("common.notes")}</Label>
          <Textarea id="notes" name="notes" rows={2} className="mt-1.5" />
        </div>

        {provider && (
          <div className="rounded-lg bg-accent/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">₹{provider.price_per_acre} × {acres} {provider.price_unit}s</span>
              <span className="text-lg font-bold text-primary">₹{total}</span>
            </div>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading || !provider}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Book ${provider?.name ?? ""}`}
        </Button>
      </form>
    </Card>
  );
}
