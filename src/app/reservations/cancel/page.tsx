"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function CancelContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const cancel = async () => {
    if (!token) return;
    try {
      await api.cancelReservation(token);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    }
  };

  if (!token) {
    return <p className="text-center text-red-600">Invalid cancel link.</p>;
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-5xl mb-4">✓</p>
        <h1 className="text-2xl font-bold">Reservation Cancelled</h1>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="mb-4 text-2xl font-bold">Cancel Reservation?</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <button onClick={cancel} className="rounded-full bg-dfc-red px-8 py-3 font-semibold text-white">
        Confirm Cancel
      </button>
    </div>
  );
}

export default function CancelReservationPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <CancelContent />
      </Suspense>
    </div>
  );
}
