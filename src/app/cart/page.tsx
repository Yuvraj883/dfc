"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, promoDiscount, orderType, tableToken } = useCart();
  const sub = subtotal();
  const tax = (sub - promoDiscount) * 0.05;
  const total = sub - promoDiscount + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="rounded-[3rem] border border-white/10 bg-zinc-900/50 p-12 backdrop-blur-xl text-center max-w-lg w-full shadow-2xl">
          <p className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🛒</p>
          <h1 className="text-3xl font-extrabold text-white">Your cart is empty</h1>
          <p className="mt-4 text-lg text-gray-400 font-light">Add some crispy goodness from our menu!</p>
          <Link href="/menu" className="mt-10 inline-block rounded-full bg-dfc-red px-10 py-4 font-bold text-white shadow-[0_0_30px_rgba(230,46,53,0.3)] transition-all hover:scale-105 hover:bg-dfc-red-dark hover:shadow-[0_0_50px_rgba(230,46,53,0.5)]">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-32 text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Your Cart</h1>
        {orderType === "dine_in" && tableToken && (
          <p className="mb-6 rounded-xl bg-dfc-yellow/10 border border-dfc-yellow/20 px-4 py-3 text-sm text-dfc-yellow backdrop-blur-md flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-dfc-yellow animate-pulse"></span>
            Dine-in order linked to your table
          </p>
        )}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.menuItemId}-${item.customizationIds.join(",")}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-xl transition-all hover:bg-zinc-900 hover:border-white/20"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                {item.customizationLabels.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1">{item.customizationLabels.join(", ")}</p>
                )}
                <p className="mt-2 text-base font-bold text-dfc-red">
                  {formatPrice((item.price + item.customizationExtra) * item.quantity)}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-zinc-950/50 rounded-full border border-white/5 p-1">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.customizationIds, item.quantity - 1)}
                  className="rounded-full hover:bg-white/10 p-2 text-gray-300 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-semibold text-white">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.customizationIds, item.quantity + 1)}
                  className="rounded-full hover:bg-white/10 p-2 text-gray-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.menuItemId, item.customizationIds)}
                className="ml-2 rounded-full p-3 text-gray-500 hover:bg-red-500/10 hover:text-dfc-red transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl">
          <div className="space-y-3">
            <div className="flex justify-between text-base text-gray-300">
              <span>Subtotal</span><span>{formatPrice(sub)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-base text-dfc-yellow font-medium">
                <span>Discount</span><span>-{formatPrice(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base text-gray-300">
              <span>GST (5%)</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="my-4 border-t border-white/10" />
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span><span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-8 block w-full rounded-full bg-dfc-red py-4 text-center text-lg font-bold text-white shadow-[0_0_30px_rgba(230,46,53,0.3)] transition-all hover:scale-[1.02] hover:bg-dfc-red-dark hover:shadow-[0_0_50px_rgba(230,46,53,0.5)]"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
