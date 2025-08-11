
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, LogIn } from "lucide-react";
import Link from 'next/link';

export default function AppointmentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Checking your login status...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Please log in to view your appointments.
          </p>
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Go to Login
            </Link>
          </Button>
        </div>
      );
    }

    // TODO: Fetch and display actual appointments for the logged-in user
    return (
       <div className="text-center">
            <p className="text-muted-foreground">You have no upcoming appointments.</p>
             <p className="text-sm text-muted-foreground mt-2">(Appointment booking functionality coming soon)</p>
       </div>
    );
  };

  return (
    <div className="py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">My Appointments</CardTitle>
          <CardDescription>View your upcoming and past appointments here.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
