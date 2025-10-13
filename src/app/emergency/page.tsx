import dynamic from "next/dynamic";

// Import without SSR to avoid Next.js server-side rendering Leaflet
const HealthcareMap = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
});

export default function EmergencyPage() {
  return (
    <main className="flex flex-col h-screen w-full">
      <h1 className="text-2xl font-bold p-4 text-center text-accent">Emergency Healthcare Near You</h1>
      <HealthcareMap />
    </main>
  );
}
