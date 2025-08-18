
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// This page is no longer needed for email/password auth but can be kept for future flows
// or as a generic auth handler. For now, it just redirects.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect users away from this page as it's not part of the main password flow.
    const timer = setTimeout(() => router.push('/'), 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="py-12 w-full">
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <CardTitle>Processing...</CardTitle>
                <CardDescription>Redirecting you to the homepage.</CardDescription>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
