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
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-dfc-red-dark to-dfc-red text-white"
        style={{
          backgroundImage: 'url("/hero-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-6xl px-4 py-28 md:py-36">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            <p className="mb-3 inline-block rounded-full bg-black/30 backdrop-blur-md px-4 py-1.5 text-sm font-bold tracking-widest text-dfc-yellow shadow-xl border border-white/10">
              {settings?.tagline || "THE CAPITAL OF CRISP."}
            </p>
            <h1 className="font-display mb-6 max-w-3xl text-5xl font-extrabold leading-[1.1] md:text-7xl lg:text-8xl drop-shadow-2xl">
              Delhi Fried Chicken
            </h1>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both">
            <p className="mb-10 max-w-xl text-lg text-gray-200 md:text-xl leading-relaxed drop-shadow-md">
              Crispy. Juicy. Unforgettable. Janakpuri&apos;s go-to spot for legendary fried chicken, towering burgers, and massive buckets.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="group relative overflow-hidden rounded-full bg-dfc-yellow px-8 py-3.5 font-bold text-gray-900 shadow-xl shadow-dfc-yellow/20 transition-all hover:scale-105 hover:bg-yellow-400 hover:shadow-dfc-yellow/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Order Now
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/reservations"
                className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 font-bold text-white transition-all hover:bg-white/20 hover:scale-105"
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-dfc-yellow/20 blur-[100px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-dfc-red/40 blur-[100px] pointer-events-none" />
      </section>

      {settings?.announcement && (
        <div className="bg-dfc-yellow px-4 py-3 text-center text-sm font-bold tracking-wide text-gray-900 shadow-md relative z-10">
          {settings.announcement}
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 py-24 relative">
        <div className="absolute top-0 left-1/2 h-[500px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-orange-50/50 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 mb-12 flex flex-col items-center text-center">
          <span className="mb-2 font-bold text-dfc-red uppercase tracking-wider text-sm">Our Signatures</span>
          <h2 className="font-display text-4xl font-extrabold text-gray-900 md:text-5xl">Featured Favourites</h2>
        </div>

        <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length > 0
            ? featured.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/10"
                >
                  <div className="relative flex h-56 items-center justify-center bg-gray-50 overflow-hidden">
                    {item.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <span className="text-6xl transition-transform duration-500 group-hover:scale-110">🍗</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display mb-2 text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="mb-4 text-sm text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xl font-extrabold text-dfc-red">{formatPrice(item.price)}</span>
                      <Link 
                        href="/menu" 
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-dfc-red transition-all group-hover:bg-dfc-red group-hover:text-white"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] animate-pulse rounded-[2rem] bg-gray-100" />
              ))}
        </div>
      </section>

      <section className="bg-gray-900 py-24 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-24 items-center">
            <div>
              <span className="mb-2 block font-bold text-dfc-yellow uppercase tracking-wider text-sm">Our Story</span>
              <h2 className="font-display mb-6 text-4xl font-extrabold md:text-5xl">Crisp That Speaks For Itself.</h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Born in the heart of Janakpuri, Delhi Fried Chicken serves up the crispiest chicken
                in town. From classic buckets to tandoori burgers, every bite is made fresh with love
                and our signature spice blend.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 font-bold text-dfc-yellow hover:text-white transition-colors">
                Read our full story
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="rounded-[2rem] bg-white/5 p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dfc-red text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">Visit Us</h3>
                  <p className="text-gray-400 text-sm">{settings?.address || "C4E, Main Market, Janakpuri"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dfc-yellow text-gray-900">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">Call Us</h3>
                  <a href={`tel:${settings?.phone || "9289912765"}`} className="text-gray-400 text-sm hover:text-dfc-yellow transition-colors">
                    +91 {settings?.phone || "9289912765"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">Opening Hours</h3>
                  <p className="text-gray-400 text-sm">Open daily 11:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
