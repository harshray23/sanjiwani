"use client";

import { useState, useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Only show the loader if the pathname changes from its initial value.
    // This prevents the loader from showing on the very first page load,
    // where AppLoader is already handling the initial splash screen.
    const initialPath = sessionStorage.getItem('initialPath');
    if (!initialPath) {
      sessionStorage.setItem('initialPath', pathname);
    } else if (pathname !== initialPath && pathname !== sessionStorage.getItem('currentPath')) {
      setIsPageLoading(true);
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        sessionStorage.setItem('currentPath', pathname);
      }, 2000); 

      return () => clearTimeout(timer);
    }
     sessionStorage.setItem('currentPath', pathname);

  }, [pathname]);


  return (
    <>
      {isPageLoading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <Lottie animationData={loadingAnimation} loop={true} className="w-64 h-64" />
            <p className="text-lg text-muted-foreground mt-4">Loading Page...</p>
        </div>
      )}
      {children}
    </>
  );
}
