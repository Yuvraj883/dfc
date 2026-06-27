"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!code) {
      setError("No authorization code found in URL.");
      return;
    }

    const authenticate = async () => {
      try {
        await api.googleCallback(code);
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        router.push("/account");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    authenticate();
  }, [searchParams, router, queryClient]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mb-6 text-gray-600">{error}</p>
        <button 
          onClick={() => router.push("/account")}
          className="rounded-full bg-dfc-red px-6 py-2 font-semibold text-white"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-dfc-red mb-4"></div>
      <p className="text-lg font-medium text-gray-600">Authenticating with Google...</p>
    </div>
  );
}
