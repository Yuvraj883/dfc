"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { triggerHaptic, playPopSound } from "@/lib/haptics";
import { Eye, EyeOff, LogOut, Gift, ShoppingBag, User as UserIcon, ChevronRight } from "lucide-react";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

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
    setIsPending(true);
    triggerHaptic('heavy');
    playPopSound();
    try {
      if (mode === "signup") {
        await api.signup({ name, email, password });
      } else {
        await api.login({ email, password });
      }
      await refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setIsPending(false);
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
      <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32">
        <div className="mx-auto max-w-lg px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">My Profile</h1>
            <button 
              onClick={() => { triggerHaptic('light'); playPopSound(); logout(); }} 
              className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 border border-red-100 shadow-sm"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>

          <div className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-dfc-red to-orange-500 p-8 text-white shadow-[0_20px_60px_-15px_rgba(230,46,53,0.4)]">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-black/20 blur-3xl" />
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-md shadow-inner border border-white/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{user.name}</p>
                <p className="text-white/80 text-sm font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="relative z-10 mt-8 flex items-center gap-4 rounded-2xl bg-black/20 p-4 backdrop-blur-md border border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg">
                <Gift size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Loyalty Balance</p>
                <p className="text-2xl font-extrabold">{user.loyalty_points} <span className="text-sm font-medium text-white/80">Pts</span></p>
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 px-2">
            <ShoppingBag size={20} className="text-zinc-400" />
            <h2 className="text-xl font-extrabold text-zinc-900">Recent Orders</h2>
          </div>
          
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((o) => (
                <Link key={o.id} href={`/orders/${o.id}`} className="group block overflow-hidden rounded-3xl border border-zinc-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Order #{o.id.slice(0, 6)}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'completed' ? 'bg-green-100 text-green-700' :
                          o.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-zinc-500">
                        {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-extrabold text-dfc-red">{formatPrice(o.total)}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition-colors group-hover:bg-dfc-red group-hover:text-white">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-100 bg-zinc-50 py-16 text-center">
              <ShoppingBag size={48} className="mb-4 text-zinc-300" />
              <p className="text-lg font-bold text-zinc-900">No orders yet</p>
              <p className="text-sm text-zinc-500">Your delicious history will appear here.</p>
              <Link href="/catering" className="mt-6 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:-translate-y-0.5 shadow-lg active:scale-95">
                Start an Order
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{mode === "login" ? "Login" : "Sign Up"}</h1>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
        {mode === "signup" && (
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        )}
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <div className="relative">
          <input 
            placeholder="Password" 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full rounded-lg border border-orange-200 px-4 py-2 pr-10" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex justify-center items-center gap-2 rounded-full bg-dfc-red py-3 font-semibold text-white transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {mode === "login" ? "Logging in..." : "Creating Account..."}
            </>
          ) : (
            mode === "login" ? "Login" : "Create Account"
          )}
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
          type="button"
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

        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 w-full text-sm text-dfc-red hover:underline">
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
