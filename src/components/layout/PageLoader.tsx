
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
    // This effect runs on the client after hydration.
    // We use it to set up the loading state logic.
    setIsLoading(false); // Ensure loader is hidden initially on client

    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // This is a bit of a workaround for Next.js App Router.
    // We're simulating route change events.
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      handleStart();
      originalPushState.apply(this, args);
      // We can't reliably know when it finishes, so we'll use a timeout
      // and also rely on the subsequent effect hook.
      setTimeout(handleComplete, 1000); 
    };

    return () => {
      history.pushState = originalPushState;
    };

  }, []);

  useEffect(() => {
    // This effect will run whenever the path changes, hiding the loader.
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
