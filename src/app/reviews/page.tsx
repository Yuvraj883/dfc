import { Star } from "lucide-react";
import { api, type Review } from "@/lib/api";

export default async function ReviewsPage() {
  let reviews: Review[] = [];
  try {
    reviews = await api.getReviews();
  } catch {
    // offline
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">What Our Customers Say</h1>
      <p className="mb-8 text-gray-600">Real reviews from DFC fans in Janakpuri.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="mb-2 flex gap-1">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-dfc-yellow text-dfc-yellow" />
              ))}
            </div>
            <p className="text-gray-700">&ldquo;{r.comment}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold text-gray-900">— {r.customer_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
