import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
