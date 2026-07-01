import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col pt-20">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Minimal Footer */}
      <footer className="bg-raisin text-cream py-16 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-2xl font-bold mb-4 tracking-wide uppercase">Peppery House</h3>
            <p className="text-cream/70 max-w-sm font-sans font-light leading-relaxed">
              Serving the finest freshly brewed coffee with a touch of modern elegance and AI precision.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 tracking-widest uppercase text-sm">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/menu" className="text-cream/70 hover:text-cream transition-colors">Menu</Link></li>
              <li><Link href="/ai" className="text-cream/70 hover:text-cream transition-colors">AI Barista</Link></li>
              <li><Link href="/blog" className="text-cream/70 hover:text-cream transition-colors">Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 tracking-widest uppercase text-sm">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-cream/70 hover:text-cream transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-cream/70 hover:text-cream transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-cream/10 text-cream/50 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Peppery House. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-cream">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
