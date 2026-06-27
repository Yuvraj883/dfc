import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 text-gray-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="mb-6 [&_*]:text-white [&_.text-dfc-red]:text-white [&_.text-dfc-yellow]:text-dfc-yellow scale-110 origin-left" />
          <p className="text-sm leading-relaxed max-w-md">
            The Capital of Crisp — Janakpuri&apos;s favourite fried chicken. 
            We blend classic techniques with our signature spice mix to deliver 
            unforgettable crunch and flavor in every bite.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white tracking-wider text-sm uppercase">Explore</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/menu" className="hover:text-white transition-colors">Menu</Link>
            <Link href="/reservations" className="hover:text-white transition-colors">Book a Table</Link>
            <Link href="/catering" className="hover:text-white transition-colors">Catering</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white tracking-wider text-sm uppercase">Visit Us</h3>
          <p className="text-sm mb-1">C4E, Main Market, Janakpuri</p>
          <p className="text-sm mb-4 text-gray-500">(near Mother Dairy), New Delhi</p>
          <a href="tel:9289912765" className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">
            <span>📞</span> 9289912765
          </a>
          <p className="mt-4 text-xs text-gray-500 font-medium">Open daily 11:00 AM – 11:00 PM</p>
        </div>
      </div>
      <div className="border-t border-white/5 bg-black/50 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Delhi Fried Chicken. All rights reserved. Built with passion.
      </div>
    </footer>
  );
}
