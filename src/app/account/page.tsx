"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { data: user, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.me(),
    retry: false,
  });

  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.getMyOrders(),
    enabled: !!user,
  });

  const handleAuth = async () => {
    setError("");
    try {
      if (mode === "signup") {
        await api.signup({ name, email, password });
      } else {
        await api.login({ email, password });
      }
      refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    }
  };

  const logout = async () => {
    await api.logout();
    refetch();
  };

  if (user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">My Account</h1>
        <div className="rounded-xl bg-orange-50 p-6 mb-6">
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="mt-2 text-sm font-bold text-dfc-red">🎁 {user.loyalty_points} loyalty points</p>
        </div>
        <h2 className="mb-4 text-xl font-bold">Order History</h2>
        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link key={o.id} href={`/orders/${o.id}`} className="block rounded-xl border border-orange-100 p-4 hover:shadow-sm">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">#{o.id.slice(0, 8)}</span>
                  <span className="text-sm font-bold text-dfc-red">{formatPrice(o.total)}</span>
                </div>
                <p className="text-xs text-gray-500 capitalize">{o.status} · {new Date(o.created_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        )}
        <button onClick={logout} className="mt-6 text-sm text-red-600 hover:underline">Log out</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{mode === "login" ? "Login" : "Sign Up"}</h1>
      <div className="space-y-4">
        {mode === "signup" && (
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        )}
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={handleAuth} className="w-full rounded-full bg-dfc-red py-3 font-semibold text-white">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="w-full text-sm text-dfc-red hover:underline">
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
