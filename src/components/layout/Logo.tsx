
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline font-bold flex items-center gap-2", className)}>
      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 neon-glow-cyan bg-[#020817]">
        <Image 
          src="/logo.jpg" 
          alt="Sanjiwani Logo" 
          fill
          className="object-cover"
        />
      </div>
      <span className="tracking-tight uppercase text-white font-black">Sanjiwani</span>
    </div>
  );
}
