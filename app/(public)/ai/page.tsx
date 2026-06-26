"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type AIMode = "mood" | "barista" | "pairing";

const DRINKS = [
  "Espresso","Cappuccino","Latte","Flat White","Americano","Mocha",
  "Cold Brew","Iced Latte","Frappe","Caramel Macchiato (Iced)","Vietnamese Iced Coffee","Nitro Cold Brew",
];

function BeanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let beans: any[] = [];
    const beanCount = 40;
    const mouse = { x: -1000, y: -1000 };
    const avoidanceRadius = 150;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    resize();

    class Bean {
      x!: number; y!: number; size!: number; rotation!: number;
      rotationSpeed!: number; vx!: number; vy!: number;
      baseColor!: string; accentColor!: string;

      constructor() {
        this.init();
      }

      init() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseColor = '#452006'; // Dark Espresso
        this.accentColor = '#c87740'; // Caramel
      }

      update() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < avoidanceRadius) {
          const force = (avoidanceRadius - dist) / avoidanceRadius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 5;
          this.y += Math.sin(angle) * force * 5;
        }

        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-this.size * 0.8, 0);
        ctx.bezierCurveTo(-this.size * 0.2, -this.size * 0.2, this.size * 0.2, this.size * 0.2, this.size * 0.8, 0);
        ctx.strokeStyle = this.accentColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        
        ctx.restore();
      }
    }

    for (let i = 0; i < beanCount; i++) {
      beans.push(new Bean());
    }

    let animationId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      beans.forEach(bean => {
        bean.update();
        bean.draw();
      });
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-40" />;
}

export default function AIPage() {
  const [mode, setMode] = useState<AIMode>("mood");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [energy, setEnergy] = useState("medium");
  const [taste, setTaste] = useState("sweet");
  const [temp, setTemp] = useState("hot");
  
  const [context, setContext] = useState("");
  const [drink, setDrink] = useState(DRINKS[0]);

  async function handleSubmit() {
    setLoading(true);
    setResult("");
    let endpoint = "";
    let body = {};
    if (mode === "mood") { endpoint = "/api/ai/mood-finder"; body = { energy, taste, temp }; }
    else if (mode === "barista") { endpoint = "/api/ai/barista"; body = { context }; }
    else { endpoint = "/api/ai/pairing"; body = { drink }; }

    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      setResult(data.recommendation || data.error || "Something went wrong.");
    } catch {
      setResult("Failed to get recommendation.");
    }
    setLoading(false);
  }

  return (
    <div className="bg-surface text-on-surface font-sans min-h-screen flex flex-col relative overflow-hidden">
      <BeanCanvas />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="bg-surface/90 backdrop-blur-md fixed top-0 w-full border-b border-outline-variant/10 shadow-sm z-50">
          <div className="flex justify-between items-center px-8 md:px-12 py-4 w-full max-w-7xl mx-auto">
            <Link className="font-serif text-2xl font-semibold text-primary tracking-tight" href="/">
              Peppery Caffe
            </Link>
            <nav className="hidden md:flex gap-8">
              <Link className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors" href="/menu">Roastery</Link>
              <Link className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors" href="/menu">Subscriptions</Link>
              <Link className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors" href="/ai">Experience</Link>
            </nav>
            <div className="flex items-center gap-5 text-primary">
              <Link href="/menu" className="hover:text-secondary transition-all hover:scale-110">
                <span className="material-symbols-outlined">shopping_bag</span>
              </Link>
              <Link href="/login" className="hover:text-secondary transition-all hover:scale-110">
                <span className="material-symbols-outlined">person</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow pt-32 pb-20 flex justify-center items-center px-6">
          <div className="max-w-3xl w-full flex flex-col items-center">
            
            <div className="text-center mb-12 w-full">
              <p className="font-serif italic text-secondary text-lg mb-2">Artisanal Curation</p>
              <h1 className="font-serif text-5xl md:text-6xl text-on-surface font-semibold mb-4">Brewed Just for You</h1>
              <p className="text-on-surface-variant text-lg max-w-lg mx-auto opacity-90">Discover the perfect brew for your present moment.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { key: "mood", label: "Mood Finder", icon: "☕" },
                { key: "barista", label: "AI Barista", icon: "🤖" },
                { key: "pairing", label: "Pairing Engine", icon: "🍰" },
              ].map((m) => (
                <button 
                  key={m.key} 
                  onClick={() => { setMode(m.key as AIMode); setResult(""); }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-4xl font-semibold pill-hover ${
                    mode === m.key 
                      ? "bg-primary text-on-primary" 
                      : "bg-surface-container border border-outline-variant/30 text-on-surface"
                  }`}
                >
                  <span className="text-lg">{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-6 mb-12">
              {mode === "mood" && (
                <>
                  <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl">
                    <label className="block text-secondary font-serif italic text-lg mb-4">What's your energy level?</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["low", "medium", "high"].map(e => (
                        <button key={e} onClick={() => setEnergy(e)}
                          className={`py-3.5 rounded-2xl font-semibold capitalize pill-hover ${
                            energy === e ? "bg-primary text-on-primary" : "bg-surface-container-highest border border-outline-variant/30 text-on-surface"
                          }`}>{e}</button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl">
                    <label className="block text-secondary font-serif italic text-lg mb-4">Cravings for taste?</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["sweet", "bitter", "balanced"].map(t => (
                        <button key={t} onClick={() => setTaste(t)}
                          className={`py-3.5 rounded-2xl font-semibold capitalize pill-hover ${
                            taste === t ? "bg-primary text-on-primary" : "bg-surface-container-highest border border-outline-variant/30 text-on-surface"
                          }`}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl">
                    <label className="block text-secondary font-serif italic text-lg mb-4">Ideal temperature?</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["hot", "cold"].map(t => (
                        <button key={t} onClick={() => setTemp(t)}
                          className={`py-3.5 rounded-2xl font-semibold capitalize pill-hover ${
                            temp === t ? "bg-primary text-on-primary" : "bg-surface-container-highest border border-outline-variant/30 text-on-surface"
                          }`}>{t === "hot" ? "Steaming Hot" : "Iced & Cold"}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mode === "barista" && (
                <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl">
                  <label className="block text-secondary font-serif italic text-lg mb-4">Describe your vibe or situation</label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. Late night coding session, feeling a bit tired but need to focus..."
                    className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-2xl p-4 resize-none focus:outline-none focus:border-primary placeholder:text-outline"
                    rows={4}
                  />
                </div>
              )}

              {mode === "pairing" && (
                <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl">
                  <label className="block text-secondary font-serif italic text-lg mb-4">Pick your drink</label>
                  <select 
                    value={drink} 
                    onChange={(e) => setDrink(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-2xl p-4 focus:outline-none focus:border-primary"
                  >
                    {DRINKS.map(d => <option key={d} value={d} className="bg-surface-container-highest text-on-surface">{d}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full max-w-2xl bg-primary hover:bg-opacity-90 text-on-primary py-5 rounded-4xl font-bold text-xl transition-all hover:scale-[1.02] shadow-[0_10px_25px_-5px_rgba(200,119,64,0.4)] mb-16 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Brewing Recommendation ✨..." : "Brew Recommendation ✨"}
            </button>

            {result && (
              <div className="w-full max-w-2xl bg-surface-container rounded-4xl p-10 border-2 border-secondary/20 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
                <div className="inline-block mb-4 px-4 py-1 border border-secondary/40 rounded-full">
                  <span className="font-serif italic text-secondary text-sm uppercase tracking-widest">Our Expert Selection</span>
                </div>
                
                <div className="relative z-10">
                  <p 
                    className="text-on-surface-variant text-lg leading-relaxed italic"
                    dangerouslySetInnerHTML={{
                      __html: `"${result.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>')}"`
                    }}
                  />
                </div>
                
                <div className="mt-8 flex justify-center items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="material-symbols-outlined text-sm">star</span>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
