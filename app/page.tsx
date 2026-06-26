import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-espresso/20">
        <h1 className="font-display text-2xl text-raisin tracking-wide">Peppery House</h1>
        <div className="flex gap-6 text-sm text-espresso">
          <Link href="/menu" className="hover:text-caramel transition-colors">Menu</Link>
          <Link href="/ai" className="hover:text-caramel transition-colors">AI Picks</Link>
          <Link href="/login" className="bg-caramel text-cream px-4 py-1.5 rounded-full hover:bg-espresso transition-colors">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <p className="font-accent text-caramel text-lg tracking-widest uppercase">Welcome to</p>
        <h2 className="font-display text-6xl md:text-7xl text-raisin leading-tight">
          Peppery House
        </h2>
        <p className="text-espresso text-lg max-w-md font-accent italic">
          Where every cup tells a story. Cozy dine-in, swift delivery, and AI-picked favourites just for you.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/menu" className="bg-caramel text-cream px-6 py-3 rounded-full font-medium hover:bg-espresso transition-colors">
            Order Now
          </Link>
          <Link href="/ai" className="border border-caramel text-caramel px-6 py-3 rounded-full font-medium hover:bg-caramel hover:text-cream transition-colors">
            AI Picks ✨
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20 max-w-5xl mx-auto">
        {[
          { icon: "☕", title: "Hot & Cold Coffee", desc: "6 hot brews, 6 chilled sips — crafted with care." },
          { icon: "🍰", title: "Snacks & Desserts", desc: "Perfect pairings for every mood and moment." },
          { icon: "🤖", title: "AI Barista", desc: "Tell us your vibe, we'll pick your perfect order." },
        ].map((f) => (
          <div key={f.title} className="bg-white/60 border border-espresso/20 rounded-2xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-display text-xl text-raisin mb-2">{f.title}</h3>
            <p className="text-espresso text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
