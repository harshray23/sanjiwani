
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAppointmentsForUser } from '@/lib/mock-data';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, LogIn, Building, Clock, Stethoscope, Ticket, IndianRupee } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
   const appointmentDate = new Date(appointment.date);
   const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-xl font-headline">Dr. {appointment.doctor.name}</CardTitle>
                 <CardDescription>{appointment.doctor.specialty}</CardDescription>
            </div>
            <Badge variant={appointment.status === 'Confirmed' ? 'default' : 'secondary'}>{appointment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-muted-foreground"/>
            <span className="font-medium">{appointment.clinic.name}</span>
        </div>
         <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground"/>
            <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground"/>
            <span className="font-medium">{appointment.time}</span>
        </div>
         <Separator className="my-3"/>
         <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
            <Ticket className="h-5 w-5 text-primary"/>
            <div className="flex-1">
                <p className="text-xs text-primary/80">Your Token</p>
                <p className="font-bold text-primary text-lg">{appointment.token}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AppointmentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // User is logged in, fetch their appointments
        const userAppointments = await getAppointmentsForUser(currentUser.uid);
        setAppointments(userAppointments);
      }
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
          <p className="ml-4 text-muted-foreground">Loading your appointments...</p>
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

    if (appointments.length === 0) {
        return (
           <div className="text-center space-y-4">
                <p className="text-muted-foreground">You have no upcoming appointments.</p>
                <Button asChild>
                    <Link href="/search">
                        <Stethoscope className="mr-2 h-4 w-4"/>
                        Book a New Appointment
                    </Link>
                </Button>
           </div>
        );
    }

    return (
      <div className="space-y-6">
        {appointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
      </div>
    );
  };

  return (
    <div className="py-12 w-full">
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
