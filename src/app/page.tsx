import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  let settings = null;
  let menu = null;
  try {
    [settings, menu] = await Promise.all([api.getSettings(), api.getMenu({ popular: "true" })]);
  } catch {
    // API may be offline during build
  }

  const featured = menu?.categories.flatMap((c) => c.items.filter((i) => i.is_featured)).slice(0, 6) ?? [];

  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-br from-dfc-red/90 to-dfc-red-dark/95 text-white"
        style={{
          backgroundImage: 'url("/hero-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-dfc-yellow">
            {settings?.tagline || "The Capital of Crisp."}
          </p>
          <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Delhi Fried Chicken
          </h1>
          <p className="mb-8 max-w-xl text-lg text-red-100">
            Crispy. Juicy. Unforgettable. Janakpuri&apos;s go-to spot for fried chicken, burgers,
            buckets, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-dfc-yellow px-8 py-3 font-bold text-gray-900 shadow-lg hover:bg-yellow-400"
            >
              Order Now
            </Link>
            <Link
              href="/reservations"
              className="rounded-full border-2 border-white px-8 py-3 font-bold hover:bg-white/10"
            >
              Book a Table
            </Link>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-dfc-yellow/20 blur-3xl" />
      </section>

      {settings?.announcement && (
        <div className="bg-dfc-yellow px-4 py-3 text-center text-sm font-medium text-gray-900">
          {settings.announcement}
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Featured Favourites</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length > 0
            ? featured.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 text-5xl overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      "🍗"
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-dfc-red">{formatPrice(item.price)}</span>
                      <Link href="/menu" className="text-sm font-semibold text-dfc-red hover:underline">
                        Order →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-orange-50" />
              ))}
        </div>
      </section>

      <section className="bg-orange-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Born in the heart of Janakpuri, Delhi Fried Chicken serves up the crispiest chicken
                in town. From classic buckets to tandoori burgers, every bite is made fresh with love
                and our signature spice blend.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-bold text-dfc-red">Visit Us</h3>
              <p className="text-gray-600">
                {settings?.address || "C4E, Main Market, Janakpuri (near Mother Dairy), New Delhi"}
              </p>
              <p className="mt-2 font-semibold">
                <a href="tel:9289912765" className="text-dfc-red hover:underline">
                  📞 {settings?.phone || "9289912765"}
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-500">Open daily 11:00 AM – 11:00 PM</p>
              <Link href="/locations" className="mt-4 inline-block text-sm font-semibold text-dfc-red hover:underline">
                Get Directions →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
