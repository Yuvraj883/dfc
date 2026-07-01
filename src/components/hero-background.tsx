"use client";

import { useEffect, useState } from "react";

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
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 6 + 2; // 2px to 8px
            const left = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 10 + 10; // 10s to 20s
            const delay = Math.random() * -20; // Random start time
            const color = Math.random() > 0.5 ? 'bg-dfc-red' : 'bg-dfc-yellow';
            
            return (
              <div
                key={i}
                className={`absolute rounded-full ${color} opacity-40 blur-[1px]`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  bottom: '-20px',
                  animation: `floatUp ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
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
