"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop",
    title: "Our Menu",
    subtitle: "Artisanal coffee & decadent treats."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop",
    title: "Freshly Roasted",
    subtitle: "Experience the perfect morning blend."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
    title: "Cafe Vibe",
    subtitle: "A space to relax, work, and connect."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=2000&auto=format&fit=crop",
    title: "Premium Pastries",
    subtitle: "Baked fresh daily just for you."
  }
];

export default function MenuHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-raisin">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image with slow zoom out */}
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_SLIDES[currentSlide].image}
              alt="Cafe Vibe"
              fill
              className="object-cover opacity-60"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Static overlay for text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-7xl text-white font-bold mb-6 drop-shadow-md">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light drop-shadow-sm">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
