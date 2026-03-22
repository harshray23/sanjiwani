import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <Image
        src="/logo.jpg"
        alt="Sanjiwani Logo"
        fill
        className="object-contain rounded-full"
        priority
      />
    </div>
  );
}
