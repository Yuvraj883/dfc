"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Flame, Leaf, Search, Star, Plus } from "lucide-react";
import { api, type MenuItem, type Customization } from "@/lib/api";
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
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-lg shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/10">
      <div className="relative flex h-48 items-center justify-center bg-gray-50 overflow-hidden">
        {item.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
            {item.is_vegetarian ? "🥗" : "🍗"}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.is_vegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-green-700 shadow-sm">
              <Leaf className="h-3 w-3" /> Veg
            </span>
          )}
          {item.spice_level >= 2 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-red-700 shadow-sm">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
          {item.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-yellow-600 shadow-sm">
              <Star className="h-3 w-3" /> Popular
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
          <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-extrabold text-dfc-red border border-orange-100">
            {formatPrice(item.price + extra)}
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
        
        {[...item.customizations, ...globalCustomizations].length > 0 && (
          <div className="mb-4 space-y-2 rounded-xl bg-gray-50 p-3 border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Add-ons</span>
            {[...item.customizations, ...globalCustomizations].map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center justify-between group/label" onClick={() => toggle(c.id)}>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700 group-hover/label:text-gray-900 transition-colors">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    selected.includes(c.id) ? "border-dfc-red bg-dfc-red text-white" : "border-gray-300 bg-white"
                  )}>
                    {selected.includes(c.id) && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {c.name}
                </div>
                <span className="text-xs text-gray-500">+{formatPrice(c.extra_price)}</span>
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
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-xl active:translate-y-0 active:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
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
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {tableToken && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-green-800 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">🪑</div>
          <div>
            <h4 className="font-bold">Dine-in mode active</h4>
            <p className="text-sm text-green-700">Your order will be served directly to your table.</p>
          </div>
        </div>
      )}

      <div className="mb-10 text-center">
        <h1 className="font-display mb-3 text-4xl font-extrabold md:text-5xl lg:text-6xl text-gray-900 tracking-tight">Our Menu</h1>
        <p className="text-lg text-gray-500">Fresh, crispy, and made to order just for you.</p>
      </div>

      <div className="mb-12 flex flex-col items-center gap-4 md:flex-row md:justify-between rounded-3xl bg-white p-4 shadow-lg shadow-gray-200/30 border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for burgers, buckets..."
            className="w-full rounded-2xl bg-gray-50 py-3 pl-12 pr-4 text-sm font-medium transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-yellow"
          />
        </div>
        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          {[
            { key: "veg", label: "Vegetarian", icon: <Leaf className="h-3.5 w-3.5" /> },
            { key: "spicy", label: "Spicy", icon: <Flame className="h-3.5 w-3.5" /> },
            { key: "popular", label: "Popular", icon: <Star className="h-3.5 w-3.5" /> },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(filter === f.key ? null : f.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
                filter === f.key 
                  ? "bg-dfc-red text-white shadow-md shadow-dfc-red/20 scale-105" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] animate-pulse rounded-[2rem] bg-gray-100" />
          ))}
        </div>
      ) : (
        data?.categories.map((cat) => (
          <section key={cat.id} id={cat.slug} className="mb-16">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-2xl font-extrabold text-gray-900 md:text-3xl">
                {cat.name}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  globalCustomizations={data.global_customizations}
                  onAdd={handleAdd}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
