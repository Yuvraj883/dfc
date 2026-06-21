"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    await api.submitContact({ name, email, subject, message });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Message Sent!</h1>
        <p className="mt-2 text-gray-600">We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>
      <div className="space-y-4">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full rounded-lg border border-orange-200 px-4 py-2" />
        <button onClick={submit} className="w-full rounded-full bg-dfc-red py-3 font-semibold text-white">Send Message</button>
      </div>
    </div>
  );
}
