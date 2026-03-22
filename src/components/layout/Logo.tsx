import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline font-bold text-[#0f4c5c] whitespace-nowrap flex items-center justify-center gap-2", className)}>
      <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
        <Image 
          src="/logo.jpg" 
          alt="Sanjiwani Logo" 
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <span className="tracking-tight uppercase">Sanjiwani</span>
    </div>
  );
}