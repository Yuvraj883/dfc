"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { triggerHaptic, playClickSound, playPopSound } from "@/lib/haptics";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, promoDiscount, orderType, tableToken } = useCart();
  const sub = subtotal();
  const tax = (sub - promoDiscount) * 0.05;
  const total = sub - promoDiscount + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
        <ScrollReveal delay={0.1} direction="up" className="rounded-[3rem] border border-zinc-100 bg-white p-12 text-center max-w-lg w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          <p className="text-6xl mb-6 drop-shadow-sm">🛒</p>
          <h1 className="text-3xl font-extrabold text-zinc-900">Your cart is empty</h1>
          <p className="mt-4 text-lg text-zinc-500 font-light">Add some crispy goodness from our menu!</p>
          <Link href="/menu" className="mt-10 inline-block rounded-full bg-dfc-red px-10 py-4 font-bold text-white shadow-[0_10px_30px_-10px_rgba(230,46,53,0.6)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(230,46,53,0.8)] active:scale-95 active:translate-y-0">
            Browse Menu
          </Link>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32 text-zinc-900">
      <ScrollReveal delay={0.1} direction="up" className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Your Cart</h1>
        {orderType === "dine_in" && tableToken && (
          <p className="mb-6 rounded-xl bg-dfc-yellow/10 border border-dfc-yellow/30 px-4 py-3 text-sm text-dfc-yellow-800 backdrop-blur-md flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-dfc-yellow animate-pulse"></span>
            Dine-in order linked to your table
          </p>
        )}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.menuItemId}-${item.customizationIds.join(",")}`}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-3xl border border-zinc-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:border-zinc-200"
            >
              <div className="flex flex-1 items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900">{item.name}</h3>
                  {item.customizationLabels.length > 0 && (
                    <p className="text-sm text-zinc-500 mt-1">{item.customizationLabels.join(", ")}</p>
                  )}
                  <p className="mt-2 text-base font-bold text-dfc-red">
                    {formatPrice((item.price + item.customizationExtra) * item.quantity)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('heavy');
                    playClickSound();
                    removeItem(item.menuItemId, item.customizationIds);
                  }}
                  className="sm:hidden rounded-full p-2 -mr-2 -mt-2 text-zinc-400 hover:bg-red-50 hover:text-dfc-red transition-all active:scale-90"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto mt-1 sm:mt-0">
                <div className="flex items-center gap-3 bg-zinc-50 rounded-full border border-zinc-200 p-1">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      playClickSound();
                      updateQuantity(item.menuItemId, item.customizationIds, item.quantity - 1);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-500 transition-all active:scale-90"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-semibold text-zinc-900">{item.quantity}</span>
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      playPopSound();
                      updateQuantity(item.menuItemId, item.customizationIds, item.quantity + 1);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-500 transition-all active:scale-90"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('heavy');
                    playClickSound();
                    removeItem(item.menuItemId, item.customizationIds);
                  }}
                  className="hidden sm:block ml-2 rounded-full p-3 text-zinc-400 hover:bg-red-50 hover:text-dfc-red transition-all active:scale-90"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          <div className="space-y-3">
            <div className="flex justify-between text-base text-zinc-600">
              <span>Subtotal</span><span>{formatPrice(sub)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-base text-dfc-yellow-600 font-medium">
                <span>Discount</span><span>-{formatPrice(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base text-zinc-600">
              <span>GST (5%)</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="my-4 border-t border-zinc-100" />
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span><span className="text-zinc-900">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-8 block w-full rounded-full bg-dfc-red py-4 text-center text-lg font-bold text-white shadow-[0_10px_30px_-10px_rgba(230,46,53,0.6)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(230,46,53,0.8)] active:scale-[0.98] active:translate-y-0"
          >
            Proceed to Checkout
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
