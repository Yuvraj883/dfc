"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About Us" },
  { href: "/reservations", label: "Book Table" },
  { href: "/locations", label: "Location" },
  { href: "/reviews", label: "Reviews" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const [open, setOpen] = useState(false);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="px-4 pt-4">
      <header className="sticky top-4 z-50 mx-auto max-w-6xl rounded-full border border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/20 transition-all duration-300">
        <div className="flex items-center justify-between px-6 py-3">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200 hover:text-dfc-red group",
                  pathname === l.href ? "text-dfc-red font-semibold" : "text-gray-600"
                )}
              >
                {l.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-dfc-red transition-all duration-300 rounded-full",
                  pathname === l.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
            <Link href="/account" className="relative text-sm font-medium text-gray-600 transition hover:text-dfc-red group">
              Account
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-dfc-red transition-all duration-300 rounded-full group-hover:w-full" />
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 rounded-full bg-dfc-red px-5 py-2 text-sm font-bold text-white shadow-lg shadow-dfc-red/20 transition-all hover:-translate-y-0.5 hover:bg-dfc-red-dark hover:shadow-xl hover:shadow-dfc-red/30"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-dfc-yellow text-[10px] font-extrabold text-gray-900 shadow-sm animate-in zoom-in">
                  {count}
                </span>
              )}
            </Link>
          </nav>
          <button className="md:hidden rounded-full p-2 hover:bg-gray-100 transition" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-orange-100 bg-white px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm font-medium text-gray-700"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/account" className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
            Account
          </Link>
          <Link href="/cart" className="block py-2 text-sm font-semibold text-dfc-red" onClick={() => setOpen(false)}>
            Cart ({count})
          </Link>
        </nav>
      )}
    </header>
    </div>
  );
}
