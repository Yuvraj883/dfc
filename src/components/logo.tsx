import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dfc-red text-lg font-bold text-white shadow-md">
        🍗
      </div>
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight text-dfc-red">DFC</div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-dfc-yellow">
          Capital of Crisp
        </div>
      </div>
    </Link>
  );
}
