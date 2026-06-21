"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CateringPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    await api.submitCatering({
      name,
      email,
      phone,
      event_date: eventDate || undefined,
      guest_count: guestCount ? Number(guestCount) : undefined,
      message,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Inquiry Received!</h1>
        <p className="mt-2 text-gray-600">Our team will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Catering & Group Orders</h1>
      <p className="mb-6 text-gray-600">Planning a party or event? Let us handle the food.</p>
      <div className="space-y-4">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Expected guest count" type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <textarea placeholder="Tell us about your event..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <button onClick={submit} className="w-full rounded-full bg-dfc-red py-3 font-semibold text-white">Submit Inquiry</button>
      </div>
    </div>
  );
}
