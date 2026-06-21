import { Suspense } from "react";
import OrderStatusPage from "./order-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20 text-center">Loading...</div>}>
      <OrderStatusPage />
    </Suspense>
  );
}
