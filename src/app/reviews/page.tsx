import { Star } from "lucide-react";
import { api, type Review } from "@/lib/api";

export default async function ReviewsPage() {
  let reviews: Review[] = [];
  try {
    reviews = await api.getReviews();
  } catch {
    // offline
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-32">
      {/* Premium Hero Section */}
      <div className="relative mx-auto max-w-6xl px-4 mb-20 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-dfc-red/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="mb-4 inline-block rounded-full bg-dfc-yellow/10 border border-dfc-yellow/20 backdrop-blur-md px-5 py-2 text-xs font-bold tracking-[0.2em] text-dfc-yellow uppercase shadow-lg shadow-dfc-yellow/5">
            Wall of Love
          </span>
          <h1 className="font-display mb-6 text-5xl font-extrabold text-white md:text-6xl tracking-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-dfc-red to-dfc-yellow drop-shadow-sm">Customers Say</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 font-light leading-relaxed">
            Real reviews from real fans in Janakpuri. Discover why Delhi Fried Chicken is the undisputed capital of crisp.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="mx-auto max-w-6xl px-4 relative z-10">
        {reviews.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, idx) => (
              <div 
                key={r.id} 
                className="group relative rounded-[2rem] border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-zinc-900 hover:shadow-dfc-yellow/10 hover:border-white/20"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Decorative Quote Icon Background */}
                <div className="absolute -top-4 -right-4 text-9xl text-white/5 font-serif leading-none pointer-events-none group-hover:text-dfc-red/10 transition-colors duration-500">
                  &quot;
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6 flex gap-1.5 drop-shadow-[0_0_10px_rgba(255,193,7,0.3)]">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-dfc-yellow text-dfc-yellow" />
                    ))}
                    {Array.from({ length: 5 - r.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gray-700" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed font-light text-lg flex-1 mb-8">&ldquo;{r.comment}&rdquo;</p>
                  
                  <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dfc-red to-dfc-red-dark text-white font-bold shadow-lg shadow-dfc-red/20">
                      {r.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-bold text-white tracking-wide">{r.customer_name}</p>
                      <p className="text-xs text-dfc-yellow uppercase tracking-widest font-bold mt-1">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-zinc-900/30 rounded-3xl border border-white/5">
            <p className="text-xl">No reviews yet! Be the first to leave one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
