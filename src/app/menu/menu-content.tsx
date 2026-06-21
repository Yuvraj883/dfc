"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Flame, Leaf, Search, Star } from "lucide-react";
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
    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 text-4xl overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          item.is_vegetarian ? "🥗" : "🍗"
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <span className="shrink-0 font-bold text-dfc-red">{formatPrice(item.price + extra)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.is_vegetarian && (
            <span className="inline-flex items-center gap-0.5 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
              <Leaf className="h-3 w-3" /> Veg
            </span>
          )}
          {item.spice_level >= 2 && (
            <span className="inline-flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
          {item.is_featured && (
            <span className="inline-flex items-center gap-0.5 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800">
              <Star className="h-3 w-3" /> Popular
            </span>
          )}
        </div>
        {[...item.customizations, ...globalCustomizations].length > 0 && (
          <div className="mt-3 space-y-1">
            {[...item.customizations, ...globalCustomizations].map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                {c.name} (+{formatPrice(c.extra_price)})
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
          className="mt-4 w-full rounded-full bg-dfc-red py-2 text-sm font-semibold text-white hover:bg-dfc-red-dark"
        >
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      {tableToken && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          🪑 Dine-in mode — your order will be linked to your table.
        </div>
      )}
      <h1 className="mb-2 text-3xl font-bold">Our Menu</h1>
      <p className="mb-6 text-gray-600">Fresh, crispy, and made to order.</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu..."
            className="w-full rounded-full border border-orange-200 py-2 pl-10 pr-4 text-sm focus:border-dfc-red focus:outline-none"
          />
        </div>
        {[
          { key: "veg", label: "Vegetarian" },
          { key: "spicy", label: "Spicy" },
          { key: "popular", label: "Popular" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(filter === f.key ? null : f.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              filter === f.key ? "bg-dfc-red text-white" : "bg-orange-100 text-gray-700 hover:bg-orange-200"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-orange-50" />
          ))}
        </div>
      ) : (
        data?.categories.map((cat) => (
          <section key={cat.id} id={cat.slug} className="mb-12">
            <h2 className="mb-4 border-b border-orange-100 pb-2 text-xl font-bold text-dfc-red">
              {cat.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
