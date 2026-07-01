import Link from "next/link";

export const metadata = {
  title: "About Us",
};

export default async function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-dfc-red/20 border border-dfc-red/30 px-4 py-1.5 text-sm font-bold tracking-widest text-dfc-yellow backdrop-blur-md">
            OUR STORY
          </span>
          <h1 className="font-display mb-6 text-5xl font-extrabold md:text-7xl drop-shadow-lg">
            The Capital of Crisp.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed">
            From a humble kitchen in Janakpuri to the most talked-about fried chicken in Delhi. 
            Here is how we built the perfect crunch.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-4xl font-extrabold text-gray-900">
              It Started With a Craving
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Delhi Fried Chicken was born out of a simple necessity: we couldn&apos;t find fried chicken that was truly exceptional. The big chains were dry and flavorless, and the local spots lacked the signature crunch.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              So, we took matters into our own hands. After 142 different spice blend experiments and countless late nights perfecting our double-fry technique, we finally created the ultimate recipe. 
            </p>
            <div className="pl-6 border-l-4 border-dfc-red py-2">
              <p className="text-xl font-bold text-gray-900 italic">
                &quot;Our mission is simple: serve the crispiest, juiciest, most flavorful fried chicken you&apos;ve ever had, every single time.&quot;
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-dfc-yellow/20 rounded-[3rem] blur-2xl transform rotate-3" />
            <div className="relative h-[500px] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl border border-white">
              <div className="absolute inset-0 flex items-center justify-center bg-orange-50 text-8xl">
                🍗
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-orange-50/50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-extrabold text-gray-900">Why DFC?</h2>
            <p className="mt-4 text-gray-600">The secrets behind our signature crunch.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Fresh, Never Frozen",
                desc: "We source our chicken fresh daily from local farms. It makes a massive difference in juiciness.",
                icon: "🌿"
              },
              {
                title: "Signature 12-Spice Blend",
                desc: "Our proprietary seasoning is a carefully guarded secret that took over a year to perfect.",
                icon: "🌶️"
              },
              {
                title: "The Double-Fry Method",
                desc: "We fry every piece twice at different temperatures to guarantee that earth-shattering crunch.",
                icon: "🔥"
              }
            ].map((value) => (
              <div key={value.title} className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/40 border border-gray-100 transition-transform hover:-translate-y-2">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl shadow-sm">
                  {value.icon}
                </div>
                <h3 className="font-display mb-3 text-2xl font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="font-display mb-6 text-4xl font-extrabold text-gray-900">Hungry Yet?</h2>
        <p className="mb-10 text-lg text-gray-600">
          Stop reading and start eating. Order online or come visit us in Janakpuri.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-dfc-red px-10 py-4 font-bold text-white shadow-xl shadow-dfc-red/20 transition-transform hover:scale-105 hover:bg-dfc-red-dark"
          >
            Order Now
          </Link>
          <Link
            href="/locations"
            className="rounded-full bg-white border border-gray-200 px-10 py-4 font-bold text-gray-900 shadow-sm transition-transform hover:scale-105 hover:bg-gray-50"
          >
            Find Us
          </Link>
        </div>
      </section>
    </>
  );
}
