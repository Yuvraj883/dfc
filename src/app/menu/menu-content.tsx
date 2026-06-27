"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Flame, Leaf, Search, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { api, type MenuItem, type Customization, type MenuCategory } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

function ItemCard({
  item,
  globalCustomizations,
  onAdd,
}: {
  item: MenuItem;
  globalCustomizations: Customization[];
  onAdd: (item: MenuItem, cids: string[], labels: string[], extra: number) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const extra = [...item.customizations, ...globalCustomizations]
    .filter((c) => selected.includes(c.id))
    .reduce((s, c) => s + c.extra_price, 0);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-dfc-yellow/10 hover:border-white/20">
      <div className="relative flex h-56 items-center justify-center bg-zinc-950 overflow-hidden">
        {item.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
        ) : (
          <span className="text-6xl transition-transform duration-500 group-hover:scale-110 opacity-70">
            {item.is_vegetarian ? "🥗" : "🍗"}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.is_vegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-green-400 shadow-sm">
              <Leaf className="h-3 w-3" /> Veg
            </span>
          )}
          {item.spice_level >= 2 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-red-400 shadow-sm">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
          {item.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-dfc-yellow/20 border border-dfc-yellow/30 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-dfc-yellow shadow-sm">
              <Star className="h-3 w-3" /> Popular
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-xl font-bold text-white leading-tight">{item.name}</h3>
          <span className="shrink-0 rounded-full bg-dfc-red/10 px-3 py-1 text-sm font-extrabold text-dfc-red border border-dfc-red/20 drop-shadow-md">
            {formatPrice(item.price + extra)}
          </span>
        </div>
        <p className="mb-6 text-sm text-gray-400 line-clamp-2 leading-relaxed font-light">{item.description}</p>
        
        {[...item.customizations, ...globalCustomizations].length > 0 && (
          <div className="mb-6 space-y-2 rounded-xl bg-zinc-950/50 p-4 border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Add-ons</span>
            {[...item.customizations, ...globalCustomizations].map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center justify-between group/label" onClick={() => toggle(c.id)}>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 group-hover/label:text-white transition-colors">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    selected.includes(c.id) ? "border-dfc-red bg-dfc-red text-white" : "border-white/20 bg-zinc-900"
                  )}>
                    {selected.includes(c.id) && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {c.name}
                </div>
                <span className="text-xs text-dfc-yellow/80">+{formatPrice(c.extra_price)}</span>
              </label>
            ))}
          </div>
        )}
        
        <button
          onClick={() => {
            const all = [...item.customizations, ...globalCustomizations];
            const labels = all.filter((c) => selected.includes(c.id)).map((c) => c.name);
            onAdd(item, selected, labels, extra);
          }}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-dfc-red py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(230,46,53,0.2)] transition-all hover:-translate-y-0.5 hover:bg-dfc-red-dark hover:shadow-[0_0_30px_rgba(230,46,53,0.4)] active:translate-y-0 active:shadow-md"
        >
          <Plus className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function CategorySection({ 
  cat, 
  globalCustomizations, 
  handleAdd 
}: { 
  cat: MenuCategory; 
  globalCustomizations: Customization[];
  handleAdd: any;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "400px 0px", // Load slightly before it comes into view
  });

  return (
    <section ref={ref} id={cat.slug} className="mb-20 scroll-mt-24">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl drop-shadow-md">
          {cat.name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
      
      {inView ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cat.items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              globalCustomizations={globalCustomizations}
              onAdd={handleAdd}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[450px] rounded-[2rem] bg-zinc-900/40 animate-pulse border border-white/5" />
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
  const addItem = useCart((s) => s.addItem);
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

  const handleAdd = (item: MenuItem, cids: string[], labels: string[], extra: number) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      customizationIds: cids,
      customizationLabels: labels,
      customizationExtra: extra,
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-32 selection:bg-dfc-red selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {tableToken && (
          <div className="mb-10 flex items-center gap-4 rounded-2xl border border-dfc-yellow/20 bg-dfc-yellow/10 px-6 py-4 text-dfc-yellow shadow-lg backdrop-blur-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dfc-yellow/20 text-2xl border border-dfc-yellow/30">🪑</div>
            <div>
              <h4 className="font-bold text-lg">Dine-in mode active</h4>
              <p className="text-sm text-dfc-yellow/80">Your order will be served directly to your table.</p>
            </div>
          </div>
        )}

        <div className="mb-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-dfc-red/20 blur-[100px] rounded-full pointer-events-none"></div>
          <h1 className="font-display mb-4 text-5xl font-extrabold md:text-6xl lg:text-7xl text-white tracking-tight relative z-10 drop-shadow-xl">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-dfc-red to-dfc-yellow">Menu</span>
          </h1>
          <p className="text-xl text-gray-400 font-light relative z-10">Fresh, crispy, and made to order just for you.</p>
        </div>

        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-[2rem] bg-zinc-900/50 p-4 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for burgers, buckets..."
              className="w-full rounded-2xl bg-zinc-950 py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-gray-500 transition-colors focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-dfc-red border border-white/5"
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
                onClick={() => setFilter(filter === f.key ? null : f.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 border",
                  filter === f.key 
                    ? "bg-dfc-red text-white shadow-[0_0_15px_rgba(230,46,53,0.4)] border-dfc-red scale-105" 
                    : "bg-zinc-950 text-gray-400 hover:bg-zinc-900 hover:text-white border-white/10"
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
              <div key={i} className="h-[450px] animate-pulse rounded-[2rem] bg-zinc-900/50 border border-white/5" />
            ))}
          </div>
        ) : (
          data?.categories.map((cat) => (
            <CategorySection 
              key={cat.id} 
              cat={cat} 
              globalCustomizations={data.global_customizations} 
              handleAdd={handleAdd} 
            />
          ))
        )}
      </div>
    </div>
  );
}
