"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ItemCard } from "./item-card";
import { type MenuItem, type Customization } from "@/lib/api";

export function ItemCarousel({
  items,
  globalCustomizations,
}: {
  items: MenuItem[];
  globalCustomizations: Customization[];
}) {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  if (items.length === 0) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[450px] animate-pulse rounded-[2rem] bg-zinc-100 border border-zinc-50" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing py-6 -my-6" ref={emblaRef}>
      <div className="flex -ml-4 sm:-ml-6 lg:-ml-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex-none min-w-0 w-[85vw] sm:w-[calc(50%)] lg:w-[calc(33.3333%)] pl-4 sm:pl-6 lg:pl-8"
          >
            <ItemCard item={item} globalCustomizations={globalCustomizations} />
          </div>
        ))}
      </div>
    </div>
  );
}
