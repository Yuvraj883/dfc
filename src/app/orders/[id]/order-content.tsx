"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, type Order } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const STATUS_STEPS = ["received", "preparing", "ready", "completed"];

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetch = () => api.getOrder(id, token).then(setOrder).catch(() => {});
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [id, token]);

  if (!order) {
    return <div className="mx-auto max-w-lg px-4 py-20 text-center">Loading order...</div>;
  }

  const currentIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6 text-center">
        <p className="text-5xl mb-2">✅</p>
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
      </div>
      <div className="mb-8 flex justify-between">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentIdx ? "bg-dfc-red text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className="mt-1 text-[10px] capitalize text-gray-600">{step}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-orange-100 bg-white p-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 text-sm">
            <span>{item.quantity}x {item.item_name}</span>
            <span>{formatPrice(item.line_price)}</span>
          </div>
        ))}
        <div className="mt-2 border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-dfc-red">{formatPrice(order.total)}</span>
        </div>
      </div>
      {order.loyalty_points_earned > 0 && (
        <p className="mt-4 text-center text-sm text-green-700">
          🎉 You earned {order.loyalty_points_earned} loyalty points!
        </p>
      )}
      <Link href="/menu" className="mt-6 block text-center text-sm font-semibold text-dfc-red hover:underline">
        Order More
      </Link>
    </div>
  );
}
