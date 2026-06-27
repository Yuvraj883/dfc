import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Delhi Fried Chicken | The Capital of Crisp",
    template: "%s | Delhi Fried Chicken",
  },
  description:
    "Order crispy fried chicken, burgers, buckets & more from Delhi Fried Chicken in Janakpuri. Pickup, dine-in & table reservations.",
  openGraph: {
    title: "Delhi Fried Chicken | The Capital of Crisp",
    description: "Janakpuri's favourite fried chicken — order online or book a table.",
    type: "website",
    locale: "en_IN",
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full`}>
      <body className="font-sans flex min-h-full flex-col antialiased selection:bg-dfc-yellow selection:text-gray-900">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster theme="dark" richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
