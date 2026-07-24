import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  ShoppingCart,
  User,
  Globe,
  X,
  LogOut,
  Phone,
  Search,
  HelpCircle,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useI18n, languageOptions } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate({ to: "/shop", search: { q: searchVal } });
    }
  };

  const navLinks = [
    { to: "/", key: "nav.home" },
    { to: "/shop", key: "nav.shop" },
    { to: "/services", key: "nav.services" },
    { to: "/about", key: "nav.about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 1. TOP GREEN BAR */}
      <div className="w-full bg-[#056830] text-white py-2 text-xs font-medium">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 fill-current text-[#FDCF20]" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.1 5.1 19.3c-.1.3-.4.5-.7.5h-1c-.5 0-.9-.5-.8-1C3.5 13.9 6.2 5.2 16.6 3.1c.5-.1 1 .3.9.8V7c0 .6-.2.9-.5 1zm1.2.7c1-.7 2-1.7 2-1.7s-.9.7-2.3 1.3v.4z" />
            </svg>
            <span>India's Most Trusted Agri Solutions Platform</span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/about"
              className="flex items-center gap-1 hover:text-[#FDCF20] transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Support</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-[#FDCF20] transition-colors"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Track Order</span>
            </Link>

            {/* Language Picker in top bar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:text-[#FDCF20] transition-colors focus:outline-none">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="uppercase">
                    {lang === "en" ? "English" : lang === "te" ? "తెలుగు" : "हिंदी"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white text-foreground">
                {languageOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.code}
                    onSelect={() => setLang(opt.code)}
                    className="cursor-pointer hover:bg-[#edfaf3]"
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center w-full max-w-lg mx-8 relative"
        >
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search for products, services..."
            className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#09B652] focus:ring-1 focus:ring-[#09B652]"
          />

          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 bg-[#FDCF20] text-[#0f2018] px-4 rounded-md hover:bg-[#e0b61b] transition-colors flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="h-4 w-4 stroke-[3px]" />
          </button>
        </form>

        {/* Action Widgets */}
        <div className="flex items-center gap-6">
          {/* Call Us widget */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#edfaf3] text-[#09B652]">
              <Phone className="h-5 w-5 fill-[#09B652]/10" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-muted-foreground font-semibold leading-none">
                Call Us Anytime
              </span>
              <span className="text-sm font-bold text-[#0f2018] mt-0.5">+91 94408 58865</span>
            </div>
          </div>

          {/* Cart Widget */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 hover:text-[#09B652] transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-foreground/80 hover:text-[#09B652]" />
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-[#09B652] px-1 text-[10px] font-bold text-white shadow-sm animate-bounce">
                  {count}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-sm font-bold text-foreground/85">Cart</span>
          </Link>

          {/* My Account Widget */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 hover:text-[#09B652] transition-colors focus:outline-none">
                  <User className="h-6 w-6 text-foreground/80" />
                  <span className="hidden sm:inline text-sm font-bold text-foreground/85">
                    My Account
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">Signed in as</div>
                <div className="px-2 pb-2 text-sm font-medium">
                  {user.phone ? "+" + user.phone : user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#edfaf3]">
                  <Link to="/orders" className="w-full">
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => signOut()}
                  className="text-destructive cursor-pointer hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 hover:text-[#09B652] transition-colors"
            >
              <User className="h-6 w-6 text-foreground/80" />
              <span className="hidden sm:inline text-sm font-bold text-foreground/85">
                My Account
              </span>
            </Link>
          )}

          {/* Mobile Menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:text-[#09B652]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* 3. NAVIGATION BANNER */}
      <div className="w-full bg-[#FDCF20]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-11 items-center justify-center lg:justify-between">
            <nav className="flex items-center gap-8 md:gap-12">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-xs font-extrabold uppercase tracking-widest text-[#0f2018] hover:text-[#056830] transition-colors relative py-3 group"
                  activeProps={{ className: "text-[#056830]" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {t(l.key)}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#056830] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-250" />
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block">
              <Link to="/contact">
                <Button className="h-8 rounded-full bg-[#056830] text-white text-xs font-bold hover:bg-[#077a37] px-6 transition-all uppercase tracking-wider">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center mb-4 relative">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none"
              />

              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-[#FDCF20] text-[#0f2018] px-3 rounded-md"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-foreground/80 hover:bg-[#edfaf3] hover:text-[#09B652] uppercase tracking-wider"
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-foreground/80 hover:bg-[#edfaf3] hover:text-[#09B652] uppercase tracking-wider"
            >
              Contact Us
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-foreground/80 hover:bg-[#edfaf3] hover:text-[#09B652] uppercase tracking-wider"
            >
              My Orders
            </Link>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-destructive uppercase tracking-wider"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-[#056830] px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
