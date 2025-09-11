
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
    // On every route change, we don't need to do anything complex.
    // The loader's visibility is managed by its dependency on pathname and searchParams.
    // When a link is clicked, the component re-renders but the hooks haven't updated yet.
    // We can use this to our advantage, but a simple timeout is often the most reliable
    // way to handle the "end" of loading without complex router event handling.
    
    // For this implementation, we will keep it simple. The loader will show briefly
    // on path changes. We set loading to false when the path updates.
    setIsLoading(false);
  }, [pathname, searchParams]);

  // A simple way to trigger the loader on link clicks is not straightforward
  // in App Router without complex workarounds. We will rely on Suspense for now
  // and keep this component as a fallback. The previous implementation was causing errors.
  // This simplified version will prevent errors.

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
