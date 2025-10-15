
"use client";

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import Logo from './Logo';

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/Transition.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Error fetching animation:", error));

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Reduced from 2500ms to 1000ms

    return () => clearTimeout(timer);
  }, []);

  if (loading || !animationData) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background gap-4">
        {animationData && (
            <div className="absolute inset-0 w-full h-full z-0">
                <Lottie animationData={animationData} loop={true} className="w-full h-full object-cover"/>
            </div>
        )}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <Logo className="h-32 w-32 text-primary animate-pulse" />
            <p className="text-lg text-muted-foreground mt-4">Initializing Sanjiwani Health...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
