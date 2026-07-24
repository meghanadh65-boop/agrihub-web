import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, User, Globe, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useI18n, languageOptions, type Lang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const links: { to: string; key: string }[] = [
    { to: "/", key: "nav.home" },
    { to: "/shop", key: "nav.shop" },
    { to: "/services", key: "nav.services" },
    { to: "/about", key: "nav.about" },
    { to: "/contact", key: "nav.contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-primary bg-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languageOptions.map((opt) => (
                <DropdownMenuItem key={opt.code} onSelect={() => setLang(opt.code as Lang)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/orders" className="hidden md:block">
            <Button variant="ghost" size="icon" aria-label="Orders">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/orders" className="hidden md:block">
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col p-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 hover:bg-accent"
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 hover:bg-accent"
            >
              {t("nav.orders")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
