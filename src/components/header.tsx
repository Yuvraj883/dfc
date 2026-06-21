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
  { href: "/scan", label: "Scan QR" },
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
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition hover:text-dfc-red",
                pathname === l.href ? "text-dfc-red" : "text-gray-700"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/account" className="text-sm font-medium text-gray-700 hover:text-dfc-red">
            Account
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1 rounded-full bg-dfc-red px-4 py-2 text-sm font-semibold text-white hover:bg-dfc-red-dark"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-dfc-yellow text-xs font-bold text-gray-900">
                {count}
              </span>
            )}
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
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
  );
}
