
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

export default function EmergencyPage() {
  const HealthcareMap = useMemo(
    () =>
      dynamic(() => import("@/components/HealthcareMap"), {
        loading: () => (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" />
            <p className="text-muted-foreground mt-4">Loading map...</p>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  return <HealthcareMap />;
}
