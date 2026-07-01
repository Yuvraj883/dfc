"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Flame, Leaf, Search, Star } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { api, type Customization, type MenuCategory } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { ItemCard } from "@/components/item-card";
import { ItemCarousel } from "@/components/item-carousel";
import { triggerHaptic, playClickSound } from "@/lib/haptics";
import { ScrollReveal } from "@/components/scroll-reveal";



function CategorySection({ 
  cat, 
  globalCustomizations, 
}: { 
  cat: MenuCategory; 
  globalCustomizations: Customization[];
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "400px 0px",
  });

  return (
    <section ref={ref} id={cat.slug} className="mb-20 scroll-mt-32">
      <ScrollReveal delay={0.1} direction="up" className="mb-8 flex items-center gap-4">
        <h2 className="font-display text-3xl font-extrabold text-zinc-900 md:text-4xl">
          {cat.name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent" />
      </ScrollReveal>
      
      {inView ? (
        <ScrollReveal delay={0.2} direction="up" className="relative z-10 w-full">
          <ItemCarousel 
            items={cat.items} 
            globalCustomizations={globalCustomizations} 
          />
        </ScrollReveal>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[450px] rounded-[2rem] bg-zinc-100 animate-pulse border border-zinc-50" />
          ))}
        </div>
      )}
    </section>
  );
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const tableToken = searchParams.get("t");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const setTableToken = useCart((s) => s.setTableToken);

  useEffect(() => {
    if (tableToken) {
      setTableToken(tableToken);
      api.validateTable(tableToken).catch(() => {});
    }
  }, [tableToken, setTableToken]);

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (filter === "veg") params.vegetarian = "true";
  if (filter === "spicy") params.spicy = "true";
  if (filter === "popular") params.popular = "true";

  const { data, isLoading } = useQuery({
    queryKey: ["menu", params],
    queryFn: () => api.getMenu(params),
  });



  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32 selection:bg-dfc-red selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {tableToken && (
          <div className="mb-10 flex items-center gap-4 rounded-2xl border border-dfc-yellow/30 bg-dfc-yellow/10 px-6 py-4 text-dfc-yellow-800 shadow-sm backdrop-blur-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl border border-dfc-yellow/30 shadow-sm">🪑</div>
            <div>
              <h4 className="font-bold text-lg">Dine-in mode active</h4>
              <p className="text-sm">Your order will be served directly to your table.</p>
            </div>
          </div>
        )}

        <ScrollReveal delay={0.1} direction="up" className="mb-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dfc-red/5 rounded-full blur-3xl pointer-events-none" />
          <h1 className="font-display mb-4 text-5xl font-extrabold md:text-6xl lg:text-7xl text-zinc-900 tracking-tight relative z-10">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-dfc-red to-dfc-red-dark">Menu</span>
          </h1>
          <p className="text-xl text-zinc-500 font-light relative z-10">Fresh, crispy, and made to order just for you.</p>
        </ScrollReveal>

        <div className="mb-16 sticky top-24 z-30 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-[2rem] bg-white/80 p-4 shadow-lg shadow-zinc-200/50 border border-zinc-100 backdrop-blur-xl">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for burgers, buckets..."
              className="w-full rounded-2xl bg-zinc-50 py-3.5 pl-12 pr-4 text-sm font-medium text-zinc-900 placeholder-zinc-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/50 border border-zinc-200"
            />
          </div>
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            {[
              { key: "veg", label: "Vegetarian", icon: <Leaf className="h-4 w-4" /> },
              { key: "spicy", label: "Spicy", icon: <Flame className="h-4 w-4" /> },
              { key: "popular", label: "Popular", icon: <Star className="h-4 w-4" /> },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  triggerHaptic('light');
                  playClickSound();
                  setFilter(filter === f.key ? null : f.key);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 border active:scale-95",
                  filter === f.key 
                    ? "bg-dfc-red text-white shadow-[0_5px_15px_-5px_rgba(230,46,53,0.5)] border-dfc-red" 
                    : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border-zinc-200"
                )}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[450px] animate-pulse rounded-[2rem] bg-zinc-100 border border-zinc-50" />
            ))}
          </div>
        ) : (
          data?.categories.map((cat) => (
            <CategorySection 
              key={cat.id} 
              cat={cat} 
              globalCustomizations={data.global_customizations} 
            />
          ))
        )}
      </div>
    </div>
  );
}
