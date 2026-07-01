"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { triggerHaptic, playPopSound } from "@/lib/haptics";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function CateringPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name || !email || !phone || !eventDate || !guestCount) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    setIsPending(true);
    triggerHaptic('heavy');
    playPopSound();

    try {
      await api.submitCatering({
        name,
        email,
        phone,
        event_date: eventDate || undefined,
        guest_count: guestCount ? Number(guestCount) : undefined,
        message,
      });
      setSent(true);
    } catch (e) {
      setError("Failed to submit inquiry. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32 text-zinc-900">
        <ScrollReveal delay={0.1} direction="up" className="mx-auto max-w-lg px-4 py-32 text-center flex flex-col items-center justify-center">
          <p className="text-6xl mb-6 drop-shadow-sm">🎉</p>
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-4">Inquiry Received!</h1>
          <p className="text-lg text-zinc-600 font-light">Our team will contact you within 24 hours.</p>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-32 text-zinc-900">
      <ScrollReveal delay={0.1} direction="up" className="mx-auto max-w-lg px-4">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Catering & Events</h1>
        <p className="mb-8 text-zinc-500 font-light text-lg">Planning a party? Let us handle the crispiness.</p>
        
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
            <label className="text-sm font-bold text-zinc-600 mb-1 block">Email Address</label>
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
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-zinc-600 mb-1 block">Event Date</label>
              <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 font-medium"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-zinc-600 mb-1 block">Guest Count</label>
              <input 
                placeholder="Ex: 50" 
                type="number" 
                min="1"
                value={guestCount} 
                onChange={(e) => setGuestCount(e.target.value)} 
                className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-bold text-zinc-600 mb-1 block">Event Details</label>
            <textarea 
              placeholder="Tell us about your event..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              rows={4} 
              className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dfc-red/30 transition-colors text-zinc-900 placeholder-zinc-400 font-medium resize-none"
            />
          </div>

          {error && <p className="text-sm font-medium text-dfc-red text-center mt-2">{error}</p>}
          
          <button 
            onClick={submit} 
            disabled={isPending}
            className="mt-6 w-full flex justify-center items-center gap-2 rounded-2xl bg-dfc-red py-4 font-bold text-lg text-white shadow-[0_10px_30px_-10px_rgba(230,46,53,0.6)] hover:bg-dfc-red-dark hover:shadow-[0_20px_50px_-10px_rgba(230,46,53,0.8)] transition-all hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : "Submit Inquiry"}
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}
