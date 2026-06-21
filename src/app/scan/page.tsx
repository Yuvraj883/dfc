"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export default function ScanPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      router.push(`/menu?t=${token}`);
    } else {
      // If empty, simulate with a random token for demo
      router.push(`/menu?t=demo_table_token`);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl bg-orange-100">
        <Camera className="h-12 w-12 text-dfc-red" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Scan Table QR</h1>
      <p className="mb-8 text-gray-600">
        Point your camera at the QR code on your table to view the menu and start your dine-in order.
      </p>
      
      <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-6 text-left">
        <h2 className="mb-2 text-sm font-semibold text-orange-800">Demo Simulator</h2>
        <p className="mb-4 text-xs text-orange-700">
          In a real device, this would open your camera. For this demo, enter a table token or click Simulate.
        </p>
        <form onSubmit={handleSimulate} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Table Token..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1 rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm focus:border-dfc-red focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-dfc-red px-4 py-2 text-sm font-semibold text-white hover:bg-dfc-red-dark"
          >
            Simulate
          </button>
        </form>
      </div>
    </div>
  );
}
