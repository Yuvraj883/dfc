"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function ReservationsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [requests, setRequests] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { data: availability } = useQuery({
    queryKey: ["availability", date],
    queryFn: () => api.getAvailability(date),
    enabled: !!date,
    staleTime: 60 * 1000, // Cache for 1 minute on the frontend
  });

  const submit = async () => {
    setError("");
    
    if (!date || !selectedTime || !name || !email || !phone) {
      setError("Please fill out all required fields and select a time slot.");
      return;
    }
    
    setIsPending(true);
    try {
      await api.createReservation({
        name,
        email,
        phone,
        party_size: partySize,
        date,
        time: selectedTime + ":00",
        special_requests: requests || undefined,
      });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-6xl mb-6 drop-shadow-sm">🎉</p>
        <h1 className="text-4xl font-extrabold text-zinc-900 mb-4">Table Booked!</h1>
        <p className="text-lg text-zinc-600 font-light">Check your email for confirmation details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32 text-zinc-900">
      <div className="mx-auto max-w-lg px-4">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Book a Table</h1>
        <p className="mb-8 text-zinc-500 font-light text-lg">Reserve your spot at DFC Janakpuri.</p>
        
        <div className="space-y-6 rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          <div>
            <label className="text-sm font-bold text-zinc-600 mb-2 block">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={new Date().toISOString().split("T")[0]} 
              className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 font-medium"
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-zinc-600 mb-2 block">Available Times</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {availability?.slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`rounded-2xl py-3 text-sm font-bold transition-all duration-200 border-2 ${
                      !slot.available 
                        ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed opacity-60"
                        : isSelected 
                          ? "bg-dfc-red text-white border-dfc-red shadow-[0_5px_15px_-5px_rgba(230,46,53,0.4)] active:scale-95" 
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-95"
                    }`}
                  >
                    {slot.time} {!slot.available && <span className="block text-[10px] font-medium uppercase mt-0.5">Full</span>}
                  </button>
                );
              })}
              {!availability && (
                <div className="col-span-4 py-4 text-center text-sm text-zinc-400 font-medium">
                  Loading slots...
                </div>
              )}
              {availability && availability.slots.length === 0 && (
                <div className="col-span-4 py-4 text-center text-sm text-red-500 font-medium bg-red-50 rounded-xl border border-red-100">
                  No tables available on this date.
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-zinc-100 space-y-4">
            <div>
              <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium" />
            </div>
            <div>
              <input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium" />
            </div>
            <div>
              <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium" />
            </div>
            <div>
              <label className="text-sm font-bold text-zinc-600 mb-2 block">Party Size</label>
              <input type="number" min={1} max={20} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 font-medium" />
            </div>
            <div>
              <textarea placeholder="Special requests (high chair, birthday, etc.)" value={requests} onChange={(e) => setRequests(e.target.value)} className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium resize-none" rows={3} />
            </div>
          </div>
          
          {error && <p className="text-sm font-medium text-dfc-red text-center mt-2">{error}</p>}
          
          <button 
            onClick={submit} 
            disabled={isPending} 
            className="mt-6 w-full flex justify-center items-center gap-2 rounded-full bg-dfc-red py-4 font-bold text-lg text-white shadow-[0_10px_30px_-10px_rgba(230,46,53,0.6)] hover:bg-dfc-red-dark hover:shadow-[0_20px_50px_-10px_rgba(230,46,53,0.8)] transition-all hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming...
              </>
            ) : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}
