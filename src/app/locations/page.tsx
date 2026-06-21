import { api } from "@/lib/api";

export default async function LocationsPage() {
  let settings = null;
  try {
    settings = await api.getSettings();
  } catch {
    // offline
  }

  const address = settings?.address || "C4E, Main Market, Janakpuri (near Mother Dairy), New Delhi";
  const lat = settings?.lat || 28.6219;
  const lng = settings?.lng || 77.0878;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Location & Hours</h1>
      <p className="mb-8 text-gray-600">{address}</p>
      <div className="mb-8 overflow-hidden rounded-2xl border border-orange-100">
        <iframe
          title="DFC Location"
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
          className="h-80 w-full"
          loading="lazy"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-orange-50 p-6">
          <h2 className="mb-3 font-bold text-dfc-red">Contact</h2>
          <p className="text-sm">📞 <a href="tel:9289912765" className="font-semibold hover:underline">{settings?.phone || "9289912765"}</a></p>
          <p className="mt-2 text-sm">✉️ {settings?.email || "hello@delhifriedchicken.com"}</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-6">
          <h2 className="mb-3 font-bold text-dfc-red">Hours</h2>
          <p className="text-sm">Monday – Sunday</p>
          <p className="text-sm font-semibold">11:00 AM – 11:00 PM</p>
        </div>
      </div>
    </div>
  );
}
