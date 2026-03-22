import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline font-bold text-accent whitespace-nowrap flex items-center justify-center gap-3", className)}>
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <Image 
          src="/logo.jpg" 
          alt="Sanjiwani Logo" 
          fill
          className="rounded-full object-cover border-2 border-primary/20"
        />
      </div>
      <span>Sanjiwani</span>
    </div>
  );
}
