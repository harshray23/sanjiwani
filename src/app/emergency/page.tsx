
"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Load map only on the client with a fallback UI
const HealthcareMap = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-muted/20 animate-pulse">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-medium">Initializing Interactive Map...</p>
    </div>
  ),
});

export default function EmergencyPage() {
  return (
    <main className="flex flex-col h-[calc(100vh-150px)] w-full max-w-7xl mx-auto px-4">
      <div className="py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-2">Emergency Healthcare Map</h1>
        <p className="text-muted-foreground">Find verified hospitals and clinics near your current location.</p>
      </div>
      <div className="flex-grow rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 relative">
        <HealthcareMap />
      </div>
      <div className="py-4 text-center">
        <p className="text-xs text-muted-foreground italic">
          Data provided by OpenStreetMap & Overpass API. Location access required for local results.
        </p>
      </div>
    </main>
  );
}
