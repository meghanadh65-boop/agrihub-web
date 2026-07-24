import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t-4 border-[#FDCF20]" style={{ background: "#052416" }}>
      {/* Newsletter strip */}
      <div className="border-b border-white/10 py-8 bg-[#041c11]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <div>
            <p className="text-base font-bold text-[#FDCF20]">
              Get farming tips &amp; exclusive offers
            </p>
            <p className="text-sm text-white/60">
              Weekly crop advisory, seasonal discounts, and service alerts.
            </p>
          </div>
          <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#09B652] focus:outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-[#FDCF20] px-5 py-2 text-sm font-bold text-[#052416] transition hover:brightness-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 grid-cols-2 md:grid-cols-7">
        {/* Brand col */}
        <div className="space-y-4 col-span-2 md:col-span-2">
          <div className="w-fit rounded-xl bg-white/5 p-2">
            <Logo lightText={true} />
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-white/60 max-w-sm">
            Your trusted partner for quality agricultural products, expert advice, and modern
            farming solutions.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/70 hover:border-[#FDCF20] hover:text-[#FDCF20] transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/70 hover:border-[#FDCF20] hover:text-[#FDCF20] transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/70 hover:border-[#FDCF20] hover:text-[#FDCF20] transition-colors"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h4 className="mb-4 text-sm font-bold text-[#FDCF20] uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <Link to="/" className="hover:text-[#FDCF20] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#FDCF20] transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-[#FDCF20] transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#FDCF20] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#FDCF20] transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="col-span-1">
          <h4 className="mb-4 text-sm font-bold text-[#FDCF20] uppercase tracking-wider">
            Categories
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              "Crop Protection",
              "Seeds",
              "Fertilizers",
              "Tools & Equipment",
              "Organic Products",
            ].map((item) => (
              <li key={item}>
                <Link to="/shop" className="hover:text-[#FDCF20] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="col-span-1">
          <h4 className="mb-4 text-sm font-bold text-[#FDCF20] uppercase tracking-wider">
            Services
          </h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <Link to="/services/drone" className="hover:text-[#FDCF20] transition-colors">
                Drone Spraying
              </Link>
            </li>
            <li>
              <Link to="/services/tractor" className="hover:text-[#FDCF20] transition-colors">
                Tractor Rental
              </Link>
            </li>
            <li>
              <Link to="/services/harvester" className="hover:text-[#FDCF20] transition-colors">
                Harvester Booking
              </Link>
            </li>
            <li>
              <Link to="/services/workforce" className="hover:text-[#FDCF20] transition-colors">
                Labor Squads
              </Link>
            </li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div className="col-span-2 md:col-span-2">
          <h4 className="mb-4 text-sm font-bold text-[#FDCF20] uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-3.5 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#09B652]" />
              <a href="tel:+919440858865" className="hover:text-[#FDCF20] transition-colors">
                +91 94408 58865
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#09B652]" />
              <a href="mailto:support@fltyservices.in" className="hover:text-[#FDCF20] transition-colors break-all">
                support@fltyservices.in
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#09B652]" />
              <a
                href="https://maps.google.com/?q=Guntur,+Andhra+Pradesh+-+522001"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FDCF20] transition-colors"
              >
                Guntur, Andhra Pradesh - 522001
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. BOTTOM BAR (Golden Yellow with Forest Green text) */}
      <div className="bg-[#FDCF20] py-4 text-xs font-bold text-[#052416]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} FLTY Services. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with ❤️ for Farmers</span>
            <svg className="h-4 w-4 fill-current text-[#052416] ml-1" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.1 5.1 19.3c-.1.3-.4.5-.7.5h-1c-.5 0-.9-.5-.8-1C3.5 13.9 6.2 5.2 16.6 3.1c.5-.1 1 .3.9.8V7c0 .6-.2.9-.5 1zm1.2.7c1-.7 2-1.7 2-1.7s-.9.7-2.3 1.3v.4z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
