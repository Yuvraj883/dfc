"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
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

  const handleGoogleLogin = async () => {
    try {
      const { url } = await api.getGoogleLoginUrl();
      window.location.href = url;
    } catch {
      setError("Google authentication is not configured yet.");
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 w-full text-sm text-dfc-red hover:underline">
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
