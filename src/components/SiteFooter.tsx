import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <div className="rounded-lg bg-background/10 p-2 w-fit">
            <Logo />
          </div>
          <p className="text-sm text-background/70">{t("footer.tagline")}</p>
          <div className="flex gap-3 text-background/70">
            <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-brand-yellow" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-brand-yellow" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="h-5 w-5 hover:text-brand-yellow" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-yellow">Explore</h4>
          <ul className="space-y-2 text-sm text-background/80">
            <li><Link to="/shop" className="hover:text-brand-yellow">{t("nav.shop")}</Link></li>
            <li><Link to="/services" className="hover:text-brand-yellow">{t("nav.services")}</Link></li>
            <li><Link to="/about" className="hover:text-brand-yellow">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-brand-yellow">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-yellow">Services</h4>
          <ul className="space-y-2 text-sm text-background/80">
            <li><Link to="/services/drone" className="hover:text-brand-yellow">Drone Spraying</Link></li>
            <li><Link to="/services/harvester" className="hover:text-brand-yellow">Harvester Rental</Link></li>
            <li><Link to="/services/tractor" className="hover:text-brand-yellow">Tractor Booking</Link></li>
            <li><Link to="/services/workforce" className="hover:text-brand-yellow">Workforce</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-yellow">Contact</h4>
          <ul className="space-y-2 text-sm text-background/80">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5" /> +91 98765 43210</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5" /> support@flty.in</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Hyderabad, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-background/60 sm:px-6">
          © {new Date().getFullYear()} FLTY. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
