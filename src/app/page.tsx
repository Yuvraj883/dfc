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
      <section className="relative overflow-hidden bg-zinc-950 text-white pt-24 lg:pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dfc-red/10 via-zinc-950 to-zinc-950"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
            {/* Text Content - Left Side */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both z-10 pt-10 lg:pt-0">
              <p className="mb-6 inline-block rounded-full bg-dfc-red/10 border border-dfc-red/20 backdrop-blur-md px-5 py-2 text-xs font-bold tracking-[0.2em] text-dfc-red uppercase shadow-lg shadow-dfc-red/5">
                {settings?.tagline || "THE CAPITAL OF CRISP."}
              </p>
              <h1 className="font-display mb-6 text-5xl font-extrabold leading-[1.1] sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white drop-shadow-lg">
                Delhi Fried <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-dfc-red to-dfc-yellow drop-shadow-sm">Chicken</span>
              </h1>
              
              <p className="mb-10 max-w-xl text-lg text-gray-300 sm:text-xl leading-relaxed font-light drop-shadow-md">
                Crispy. Juicy. Unforgettable. Janakpuri&apos;s legendary destination for artisanal fried chicken, towering burgers, and epic buckets.
              </p>
              
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <Link
                  href="/menu"
                  className="group relative overflow-hidden rounded-full bg-dfc-red px-8 py-4 sm:px-10 font-bold text-white shadow-[0_0_30px_rgba(230,46,53,0.3)] transition-all hover:scale-105 hover:bg-dfc-red-dark hover:shadow-[0_0_50px_rgba(230,46,53,0.5)]"
                >
                  <span className="relative z-10 flex items-center gap-2 text-base sm:text-lg">
                    Order Now
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/reservations"
                  className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 sm:px-10 font-bold text-white transition-all hover:bg-white/10 hover:border-white/30 hover:scale-105 text-base sm:text-lg"
                >
                  Book a Table
                </Link>
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="relative w-full h-[400px] lg:h-[600px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 ease-out fill-mode-both">
              <div className="absolute inset-0 bg-gradient-to-tr from-dfc-red/20 to-transparent rounded-full blur-[100px]"></div>
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1500&auto=format&fit=crop" 
                  alt="Delicious Fried Chicken Bucket"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-2xl bg-zinc-950/60 backdrop-blur-md border border-white/10 p-4 shadow-xl">
                    <p className="text-white font-bold flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      Now open for orders!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {settings?.announcement && (
        <div className="bg-dfc-yellow px-4 py-3 text-center text-sm font-bold tracking-wide text-gray-900 shadow-lg relative z-20">
          {settings.announcement}
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 py-32 relative">
        <div className="relative z-10 mb-16 flex flex-col items-center text-center">
          <span className="mb-3 font-bold text-dfc-red tracking-[0.2em] text-xs uppercase">Our Signatures</span>
          <h2 className="font-display text-4xl font-extrabold text-white md:text-6xl tracking-tight">Featured Favourites</h2>
        </div>

        <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length > 0
            ? featured.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-dfc-red/10 hover:border-white/10"
                >
                  <div className="relative flex h-64 items-center justify-center overflow-hidden bg-zinc-950">
                    {item.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" />
                    ) : (
                      <span className="text-6xl transition-transform duration-700 group-hover:scale-110">🍗</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
                  </div>
                  <div className="flex flex-1 flex-col p-8 relative z-10 -mt-12">
                    <h3 className="font-display mb-3 text-2xl font-bold text-white leading-tight">{item.name}</h3>
                    <p className="mb-6 text-sm text-gray-400 leading-relaxed line-clamp-2 font-light">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-2xl font-extrabold text-dfc-red">{formatPrice(item.price)}</span>
                      <Link 
                        href="/menu" 
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all group-hover:bg-dfc-red group-hover:border-dfc-red group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(230,46,53,0.4)]"
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
                <div key={i} className="h-[450px] animate-pulse rounded-3xl bg-zinc-900/50 border border-white/5" />
              ))}
        </div>
      </section>

      <section className="bg-zinc-950 py-32 text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="grid gap-16 md:grid-cols-2 lg:gap-24 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <span className="mb-3 block font-bold text-dfc-yellow tracking-[0.2em] text-xs uppercase">Our Story</span>
              <h2 className="font-display mb-8 text-5xl font-extrabold md:text-6xl tracking-tight leading-[1.1]">Crisp That Speaks For Itself.</h2>
              <p className="text-gray-400 leading-relaxed text-lg mb-10 font-light">
                Born in the heart of Janakpuri, Delhi Fried Chicken serves up the crispiest chicken
                in town. From classic buckets to tandoori burgers, every bite is made fresh with love
                and our highly guarded signature spice blend.
              </p>
              <Link href="/about" className="group inline-flex items-center gap-3 font-bold text-dfc-yellow hover:text-white transition-colors">
                <span className="border-b-2 border-dfc-yellow/30 group-hover:border-white/50 pb-1 transition-colors">Read our full story</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="rounded-[2.5rem] bg-zinc-900/40 p-10 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dfc-red text-white shadow-[0_0_20px_rgba(230,46,53,0.3)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl mb-1">Visit Us</h3>
                  <p className="text-gray-400 text-sm font-light">{settings?.address || "C4E, Main Market, Janakpuri"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dfc-yellow text-gray-900 shadow-[0_0_20px_rgba(255,193,7,0.2)]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl mb-1">Call Us</h3>
                  <a href={`tel:${settings?.phone || "9289912765"}`} className="text-gray-400 text-sm font-light hover:text-dfc-yellow transition-colors">
                    +91 {settings?.phone || "9289912765"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white border border-white/10">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl mb-1">Opening Hours</h3>
                  <p className="text-gray-400 text-sm font-light">Open daily 11:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
