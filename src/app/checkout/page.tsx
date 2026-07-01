"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { triggerHaptic, playClickSound, playPopSound } from "@/lib/haptics";
import { ScrollReveal } from "@/components/scroll-reveal";

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
    triggerHaptic('light');
    playClickSound();
    try {
      const res = await api.validatePromo(promoInput, sub);
      if (res.valid) setPromo(promoInput.toUpperCase(), res.discount);
      else setError(res.message);
    } catch {
      setError("Invalid promo code");
    }
  };

  const placeOrder = async () => {
    triggerHaptic('heavy');
    playPopSound();
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
    } catch (e: unknown) {
      const err = e as Error;
      if (err.name === 'AbortError' || err.message?.includes('AbortError')) {
        setError("Request timed out. Please check your connection and try again.");
      } else {
        setError(err.message || "Order failed");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center min-h-[70vh] flex items-center justify-center">
        <h1 className="text-3xl font-extrabold text-zinc-900">Nothing to checkout</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32">
      <ScrollReveal delay={0.1} direction="up" className="mx-auto max-w-lg px-4">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-zinc-900">Checkout</h1>
        <div className="space-y-5 rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          <div>
            <label className="text-sm font-bold text-zinc-600 mb-1 block">Full Name</label>
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-600 mb-1 block">Email</label>
            <input
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-zinc-600 mb-1 block">Phone Number</label>
            <input
              placeholder="Your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium"
            />
          </div>
          
          <div className="pt-2">
            <label className="text-sm font-bold text-zinc-600 mb-1 block">Promo Code</label>
            <div className="flex gap-2">
              <input
                placeholder="Enter code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium"
              />
              <button onClick={applyPromo} className="rounded-2xl bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 transition-all active:scale-95">
                Apply
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-zinc-100">
            <label className="text-sm font-bold text-zinc-600 mb-2 block">Payment Method</label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  playClickSound();
                  setPaymentMethod("stripe");
                }}
                className={`flex-1 rounded-2xl border-2 py-3.5 text-sm font-bold transition-all active:scale-95 ${paymentMethod === "stripe" ? "border-dfc-red bg-red-50 text-dfc-red shadow-[0_5px_15px_-5px_rgba(230,46,53,0.3)]" : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200 hover:bg-zinc-100"}`}
              >
                Pay Online
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  playClickSound();
                  setPaymentMethod("pay_at_counter");
                }}
                className={`flex-1 rounded-2xl border-2 py-3.5 text-sm font-bold transition-all active:scale-95 ${paymentMethod === "pay_at_counter" ? "border-dfc-red bg-red-50 text-dfc-red shadow-[0_5px_15px_-5px_rgba(230,46,53,0.3)]" : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200 hover:bg-zinc-100"}`}
              >
                Pay at Counter
              </button>
            </div>
          </div>
          
          <div className="rounded-2xl bg-zinc-50 p-6 border border-zinc-100 mt-4">
            <div className="flex justify-between text-lg items-center">
              <span className="font-bold text-zinc-600">Total to Pay</span>
              <span className="text-2xl font-extrabold text-dfc-red">{formatPrice(total)}</span>
            </div>
          </div>
          
          {error && <p className="text-sm font-medium text-dfc-red text-center mt-2">{error}</p>}
          
          <button 
            onClick={placeOrder} 
            disabled={loading || !isFormValid()} 
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-dfc-red py-4 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(230,46,53,0.6)] transition-all hover:bg-dfc-red-dark hover:shadow-[0_20px_50px_-10px_rgba(230,46,53,0.8)] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Place Order"}
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}
