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
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some crispy goodness from our menu!</p>
        <Link href="/menu" className="mt-6 inline-block rounded-full bg-dfc-red px-8 py-3 font-semibold text-white">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      {orderType === "dine_in" && tableToken && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">Dine-in order linked to your table</p>
      )}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.menuItemId}-${item.customizationIds.join(",")}`}
            className="flex items-center gap-4 rounded-xl border border-orange-100 bg-white p-4"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              {item.customizationLabels.length > 0 && (
                <p className="text-xs text-gray-500">{item.customizationLabels.join(", ")}</p>
              )}
              <p className="text-sm font-bold text-dfc-red">
                {formatPrice((item.price + item.customizationExtra) * item.quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.menuItemId, item.customizationIds, item.quantity - 1)}
                className="rounded-full bg-orange-100 p-1"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuItemId, item.customizationIds, item.quantity + 1)}
                className="rounded-full bg-orange-100 p-1"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeItem(item.menuItemId, item.customizationIds)}
                className="ml-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl bg-orange-50 p-6">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(sub)}</span></div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span><span>-{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm"><span>GST (5%)</span><span>{formatPrice(tax)}</span></div>
        <div className="mt-2 flex justify-between border-t border-orange-200 pt-2 text-lg font-bold">
          <span>Total</span><span className="text-dfc-red">{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block w-full rounded-full bg-dfc-red py-3 text-center font-semibold text-white hover:bg-dfc-red-dark"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
