import Link from "next/link";
import { api } from "@/lib/api";
import { ItemCard } from "@/components/item-card";

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
        className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center min-h-[80vh]"
        style={{
          backgroundImage: 'url("/hero-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both flex flex-col items-center">
            <p className="mb-6 inline-block rounded-full bg-black/30 border border-white/20 px-5 py-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg backdrop-blur-md">
              {settings?.tagline || "THE CAPITAL OF CRISP."}
            </p>
            <h1 className="font-display mb-8 max-w-4xl text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white drop-shadow-2xl">
              Delhi Fried <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-dfc-red to-dfc-yellow filter drop-shadow-lg">Chicken</span>
            </h1>
            
            <p className="mb-10 max-w-2xl text-base sm:text-lg lg:text-xl text-zinc-200 leading-relaxed font-medium px-2 sm:px-0 drop-shadow-xl">
              Crispy. Juicy. Unforgettable. Janakpuri&apos;s legendary destination for artisanal fried chicken, towering burgers, and epic buckets.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
              <Link
                href="/menu"
                className="group relative flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-dfc-red px-8 py-4 sm:px-10 font-bold text-white shadow-[0_10px_40px_-10px_rgba(230,46,53,0.8)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(230,46,53,0.9)] active:scale-95 active:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                  Order Now
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/reservations"
                className="flex w-full sm:w-auto items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md px-8 py-4 sm:px-10 font-bold text-zinc-800 shadow-sm transition-all hover:bg-white hover:border-zinc-300 hover:-translate-y-1 text-base sm:text-lg active:scale-95 active:translate-y-0"
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {settings?.announcement && (
        <div className="bg-dfc-yellow px-4 py-3 text-center text-sm font-bold tracking-wide text-zinc-900 shadow-sm relative z-20">
          {settings.announcement}
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 relative">
        <div className="relative z-10 mb-16 flex flex-col items-center text-center">
          <span className="mb-3 font-bold text-dfc-red tracking-[0.2em] text-xs uppercase">Our Signatures</span>
          <h2 className="font-display text-4xl font-extrabold text-zinc-900 md:text-5xl lg:text-6xl tracking-tight">Featured Favourites</h2>
        </div>

        <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length > 0
            ? featured.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                globalCustomizations={menu?.global_customizations || []} 
              />
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] animate-pulse rounded-[2rem] bg-zinc-100 border border-zinc-50" />
              ))}
        </div>
      </section>

      <section className="bg-white py-32 relative overflow-hidden border-t border-zinc-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 md:grid-cols-2 lg:gap-24 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <span className="mb-3 block font-bold text-dfc-red tracking-[0.2em] text-xs uppercase">Our Story</span>
              <h2 className="font-display mb-8 text-5xl font-extrabold md:text-6xl tracking-tight leading-[1.1] text-zinc-900">Crisp That Speaks For Itself.</h2>
              <p className="text-zinc-600 leading-relaxed text-lg mb-10 font-light">
                Born in the heart of Janakpuri, Delhi Fried Chicken serves up the crispiest chicken
                in town. From classic buckets to tandoori burgers, every bite is made fresh with love
                and our highly guarded signature spice blend.
              </p>
              <Link href="/about" className="group inline-flex items-center gap-3 font-bold text-dfc-red hover:text-dfc-red-dark transition-colors active:opacity-70">
                <span className="border-b-2 border-dfc-red/20 group-hover:border-dfc-red/50 pb-1 transition-colors">Read our full story</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            <div className="rounded-[2.5rem] bg-zinc-50 p-6 sm:p-10 border border-zinc-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 border-b border-zinc-200 pb-8">
                <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-2xl bg-dfc-red/10 text-dfc-red">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-xl mb-1">Visit Us</h3>
                  <p className="text-zinc-500 text-sm font-light">{settings?.address || "C4E, Main Market, Janakpuri"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6 mb-8 border-b border-zinc-200 pb-8">
                <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-2xl bg-dfc-yellow/10 text-dfc-yellow-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-xl mb-1">Call Us</h3>
                  <a href={`tel:${settings?.phone || "9289912765"}`} className="text-zinc-500 text-sm font-light hover:text-dfc-red transition-colors">
                    +91 {settings?.phone || "9289912765"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-2xl bg-zinc-200/50 text-zinc-600 border border-zinc-200">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-xl mb-1">Opening Hours</h3>
                  <p className="text-zinc-500 text-sm font-light">Open daily 11:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
