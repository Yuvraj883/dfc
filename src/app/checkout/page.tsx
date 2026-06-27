"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, promoCode, promoDiscount, orderType, tableToken, clear, setPromo } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "pay_at_counter">("stripe");
  const [loyaltyRedeem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sub = subtotal();
  const tax = (sub - promoDiscount) * 0.05;
  const total = sub - promoDiscount - loyaltyRedeem + tax;

  const applyPromo = async () => {
    try {
      const res = await api.validatePromo(promoInput, sub);
      if (res.valid) setPromo(promoInput.toUpperCase(), res.discount);
      else setError(res.message);
    } catch {
      setError("Invalid promo code");
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    setError("");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    try {
      const order = await api.createOrder(
        {
          order_type: orderType,
          items: items.map((i) => ({
            menu_item_id: i.menuItemId,
            quantity: i.quantity,
            customization_ids: i.customizationIds,
          })),
          promo_code: promoCode,
          tip: 0,
          payment_method: paymentMethod,
          guest_name: name || undefined,
          guest_email: email || undefined,
          guest_phone: phone || undefined,
          loyalty_points_redeem: loyaltyRedeem,
        },
        tableToken,
        { signal: controller.signal }
      );

      if (paymentMethod === "stripe") {
        const intent = await api.createPaymentIntent(order.id, { signal: controller.signal });
        if (intent.mock) {
          await api.confirmMockPayment(order.id, intent.payment_intent_id, { signal: controller.signal });
        }
      }

      clear();
      const tokenParam = order.guest_token ? `?token=${order.guest_token}` : "";
      router.push(`/orders/${order.id}${tokenParam}`);
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('AbortError')) {
        setError("Request timed out. Please check your connection and try again.");
      } else {
        setError(e instanceof Error ? e.message : "Order failed");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <div className="space-y-4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-orange-200 px-4 py-2"
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-orange-200 px-4 py-2"
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-orange-200 px-4 py-2"
        />
        <div className="flex gap-2">
          <input
            placeholder="Promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-1 rounded-lg border border-orange-200 px-4 py-2"
          />
          <button onClick={applyPromo} className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold">
            Apply
          </button>
        </div>
        <div>
          <label className="text-sm font-medium">Payment Method</label>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${paymentMethod === "stripe" ? "border-dfc-red bg-red-50 text-dfc-red" : "border-gray-200"}`}
            >
              Pay Online
            </button>
            <button
              onClick={() => setPaymentMethod("pay_at_counter")}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${paymentMethod === "pay_at_counter" ? "border-dfc-red bg-red-50 text-dfc-red" : "border-gray-200"}`}
            >
              Pay at Counter
            </button>
          </div>
        </div>
        <div className="rounded-xl bg-orange-50 p-4">
          <div className="flex justify-between text-sm"><span>Total</span><span className="font-bold text-dfc-red">{formatPrice(total)}</span></div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full rounded-full bg-dfc-red py-3 font-semibold text-white hover:bg-dfc-red-dark disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
