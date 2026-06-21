import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-orange-100 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <Logo className="mb-4 [&_*]:text-white [&_.text-dfc-red]:text-white [&_.text-dfc-yellow]:text-dfc-yellow" />
          <p className="text-sm">The Capital of Crisp — Janakpuri&apos;s favourite fried chicken.</p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/menu" className="hover:text-dfc-yellow">Menu</Link>
            <Link href="/reservations" className="hover:text-dfc-yellow">Book a Table</Link>
            <Link href="/catering" className="hover:text-dfc-yellow">Catering</Link>
            <Link href="/contact" className="hover:text-dfc-yellow">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Visit Us</h3>
          <p className="text-sm">C4E, Main Market, Janakpuri</p>
          <p className="text-sm">(near Mother Dairy), New Delhi</p>
          <a href="tel:9289912765" className="mt-2 block text-sm text-dfc-yellow hover:underline">
            📞 9289912765
          </a>
          <p className="mt-2 text-sm">Open daily 11:00 AM – 11:00 PM</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Delhi Fried Chicken. All rights reserved.
      </div>
    </footer>
  );
}
