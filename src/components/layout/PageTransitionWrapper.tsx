"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lottie from 'lottie-react';

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/Loading.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Error fetching animation:", error));
  }, []);

  useEffect(() => {
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
      {isPageLoading && animationData && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <Lottie animationData={animationData} loop={true} className="w-64 h-64" />
        </div>
      )}
      {children}
    </>
  );
}
