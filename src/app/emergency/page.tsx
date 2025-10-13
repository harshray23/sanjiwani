
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

// Disable SSR for the map component to ensure it only renders on the client.
// This is the standard and most reliable way to prevent Leaflet from trying to initialize on the server.
const HealthcareMapWithNoSSR = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" />
      <p className="text-muted-foreground mt-4">Loading map...</p>
    </div>
  ),
});


export default function EmergencyPage() {
  return <HealthcareMapWithNoSSR />;
}
