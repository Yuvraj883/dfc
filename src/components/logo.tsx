import Image from "next/image";

/* eslint-disable @next/next/no-html-link-for-pages */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <a 
      href="/" 
      className={`flex items-center gap-2 active:scale-95 transition-all cursor-pointer relative z-50 ${className}`}
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden border border-zinc-800">
        <Image src="/logo.png" alt="DFC Logo" fill className="object-cover" />
      </div>
      <div className="leading-tight hidden sm:block">
        <div className="text-xl font-black tracking-tight text-dfc-red uppercase">Delhi Fried</div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-dfc-yellow">
          Chicken
        </div>
      </div>
    </a>
  );
}
