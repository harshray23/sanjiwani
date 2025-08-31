
"use client";

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { cn } from '@/lib/utils';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This effect handles the display of the loader.
    // It's designed to show the loader only for client-side navigations,
    // not on the initial server-rendered page load.
    
    // We use a short timeout to prevent a brief flash of the loader on very fast navigations.
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 100); // Small delay to avoid flicker

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);
  
   useEffect(() => {
    // This effect is responsible for hiding the loader once navigation is complete.
    // By setting isLoading to false without a delay, we ensure it disappears promptly.
    setIsLoading(false);
  }, [pathname, searchParams]);


  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {loadingAnimation && (
         <div className="w-48 h-48">
            <Lottie animationData={loadingAnimation} loop={true} />
         </div>
      )}
    </div>
  );
}
