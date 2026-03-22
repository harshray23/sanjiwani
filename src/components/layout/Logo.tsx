import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline font-bold text-accent whitespace-nowrap flex items-center justify-center", className)}>
      Sanjiwani
    </div>
  );
}
