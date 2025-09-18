
"use client";

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import transitionAnimation from '@/assets/animations/Transition.json';
import Logo from './Logo';

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background gap-4">
        <Logo className="h-32 w-32 text-primary animate-pulse" />
        <div className="w-64 h-64">
             <Lottie animationData={transitionAnimation} loop={true} />
        </div>
        <p className="text-lg text-muted-foreground">Initializing Sanjiwani Health...</p>
      </div>
    );
  }

  return <>{children}</>;
}
