"use client";

import dynamic from "next/dynamic";

// Load Leaflet map only on the client (no SSR)
const HealthcareMap = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
});

export default function EmergencyPage() {
  return (
    <main className="flex flex-col h-screen w-full">
      <h1 className="text-2xl font-bold p-4 text-center text-accent">Emergency Healthcare Map</h1>
      <HealthcareMap />
    </main>
  );
}
