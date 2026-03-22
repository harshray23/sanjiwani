
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline font-bold flex items-center gap-3", className)}>
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_15px_rgba(0,242,255,0.3)] bg-[#020817]">
        <Image 
          src="/logo.jpg" 
          alt="Sanjiwani Logo" 
          fill
          className="object-cover"
        />
      </div>
      <span className="tracking-tight uppercase text-white font-black text-xl">Sanjiwani</span>
    </div>
  );
}
