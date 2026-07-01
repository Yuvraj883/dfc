"use client";
// Force HMR rebuild to clear stale SSR cache

import { useState } from "react";
import Image from "next/image";
import { Flame, Leaf, Star, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { type MenuItem, type Customization } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { playPopSound, playClickSound, triggerHaptic } from "@/lib/haptics";

export function ItemCard({
  item,
  globalCustomizations,
}: {
  item: MenuItem;
  globalCustomizations: Customization[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const items = useCart((s) => s.items);
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const extra = [...item.customizations, ...globalCustomizations]
    .filter((c) => selected.includes(c.id))
    .reduce((s, c) => s + c.extra_price, 0);

  const toggle = (id: string) => {
    triggerHaptic('light');
    playClickSound();
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const cartItem = items.find((i) => {
    if (i.menuItemId !== item.id) return false;
    if (i.customizationIds.length !== selected.length) return false;
    const sortedCartIds = [...i.customizationIds].sort();
    const sortedSelected = [...selected].sort();
    return sortedCartIds.every((id, idx) => id === sortedSelected[idx]);
  });
  
  const quantityInCart = cartItem?.quantity || 0;

  const handleAdd = () => {
    triggerHaptic('heavy');
    playPopSound();
    
    const all = [...item.customizations, ...globalCustomizations];
    const labels = all.filter((c) => selected.includes(c.id)).map((c) => c.name);
    
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      customizationIds: selected,
      customizationLabels: labels,
      customizationExtra: extra,
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:border-zinc-200">
      <div className="relative flex h-56 items-center justify-center bg-zinc-50 overflow-hidden">
        {item.image_url ? (
          <Image 
            src={item.image_url} 
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <span className="text-6xl transition-transform duration-500 group-hover:scale-110 drop-shadow-sm">
            {item.is_vegetarian ? "🥗" : "🍗"}
          </span>
        )}
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.is_vegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-green-700 shadow-sm backdrop-blur-md">
              <Leaf className="h-3 w-3" /> Veg
            </span>
          )}
          {item.spice_level >= 2 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-red-700 shadow-sm backdrop-blur-md">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
          {item.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-dfc-yellow/10 border border-dfc-yellow/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-dfc-yellow-700 shadow-sm backdrop-blur-md">
              <Star className="h-3 w-3" /> Popular
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4 sm:p-6 bg-white z-10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 leading-tight">{item.name}</h3>
          <span className="shrink-0 rounded-full bg-dfc-red/10 px-3 py-1 text-sm font-extrabold text-dfc-red border border-dfc-red/20">
            {formatPrice(item.price + extra)}
          </span>
        </div>
        <p className="mb-6 text-sm text-zinc-500 line-clamp-2 leading-relaxed font-light">{item.description}</p>
        
        {[...item.customizations, ...globalCustomizations].length > 0 && (
          <div className="mb-6 space-y-2 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Add-ons</span>
            {[...item.customizations, ...globalCustomizations].map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center justify-between group/label" onClick={() => toggle(c.id)}>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 group-hover/label:text-zinc-900 transition-colors">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    selected.includes(c.id) ? "border-dfc-red bg-dfc-red text-white" : "border-zinc-300 bg-white"
                  )}>
                    {selected.includes(c.id) && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {c.name}
                </div>
                <span className="text-xs font-semibold text-zinc-500">+{formatPrice(c.extra_price)}</span>
              </label>
            ))}
          </div>
        )}
        
        {quantityInCart > 0 ? (
          <div className="mt-auto flex w-full items-center justify-between rounded-full bg-zinc-50 border border-zinc-200 p-1 shadow-sm">
            <button
              onClick={() => {
                triggerHaptic('light');
                playClickSound();
                if (quantityInCart === 1) {
                  removeItem(item.id, selected);
                } else {
                  updateQuantity(item.id, selected, quantityInCart - 1);
                }
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-500 transition-all active:scale-90"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="w-8 text-center font-bold text-zinc-900">{quantityInCart}</span>
            <button
              onClick={() => {
                triggerHaptic('medium');
                playPopSound();
                updateQuantity(item.id, selected, quantityInCart + 1);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-500 transition-all active:scale-90"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-dfc-red hover:shadow-[0_10px_20px_-10px_rgba(230,46,53,0.5)] active:translate-y-0 active:shadow-sm active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
