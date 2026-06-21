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

  const { data: availability } = useQuery({
    queryKey: ["availability", date],
    queryFn: () => api.getAvailability(date),
    enabled: !!date,
  });

  const submit = async () => {
    setError("");
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
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold">Table Booked!</h1>
        <p className="mt-2 text-gray-600">Check your email for confirmation details.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Book a Table</h1>
      <p className="mb-6 text-gray-600">Reserve your spot at DFC Janakpuri.</p>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="mt-1 w-full rounded-lg border border-orange-200 px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Available Times</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {availability?.slots.filter((s) => s.available).map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                className={`rounded-lg py-2 text-sm font-medium ${selectedTime === slot.time ? "bg-dfc-red text-white" : "bg-orange-100 text-gray-700 hover:bg-orange-200"}`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <div>
          <label className="text-sm font-medium">Party Size</label>
          <input type="number" min={1} max={20} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-orange-200 px-4 py-2" />
        </div>
        <textarea placeholder="Special requests (high chair, birthday, etc.)" value={requests} onChange={(e) => setRequests(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" rows={3} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={submit} disabled={!selectedTime || !name || !email || !phone} className="w-full rounded-full bg-dfc-red py-3 font-semibold text-white hover:bg-dfc-red-dark disabled:opacity-50">
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}
