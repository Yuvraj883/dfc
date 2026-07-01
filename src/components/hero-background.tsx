"use client";

import { useEffect, useState, useMemo } from "react";

export function HeroBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const particles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(15)].map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * -20,
      color: Math.random() > 0.5 ? 'bg-dfc-red' : 'bg-dfc-yellow'
    }));
  }, [mounted]);

  return (
    <>
      <div 
        className="absolute -inset-y-[25%] inset-x-0 w-full"
        style={{
          backgroundImage: 'url("/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.4}px)`,
          willChange: 'transform',
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Floating dynamic particles (like embers/spices) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full ${p.color} opacity-40 blur-[1px]`}
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                bottom: '-20px',
                animation: `floatUp ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
