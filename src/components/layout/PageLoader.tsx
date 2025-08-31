
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Don't show loader on initial page load
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      // This is a failsafe to hide the loader if something goes wrong
      setIsLoading(false);
    }, 5000); // Hide after 5 seconds regardless

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    // This effect specifically handles hiding the loader.
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
