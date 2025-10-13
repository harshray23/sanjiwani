
"use client";

import { useEffect, useState, useRef } from 'react';
import { getAppointmentsForUser } from '@/lib/data';
import type { Appointment, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, LogIn, Building, Clock, Stethoscope, Ticket, CheckCircle, Video, Upload } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const appointmentDate = new Date(appointment.scheduledAt);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(appointmentDate, 'p');
  const isCompleted = appointment.status === 'completed';

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-xl font-headline text-accent">Dr. {appointment.doctor?.name}</CardTitle>
                 <CardDescription>{appointment.doctor?.specialization}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <Badge 
                    variant={appointment.status === 'completed' ? 'default' : (appointment.status === 'confirmed' ? 'secondary' : 'destructive')}
                    className={appointment.status === 'completed' ? 'bg-green-600 text-white' : ''}
                >
                    {appointment.status}
                </Badge>
                {appointment.type === 'video' && (
                    <Badge variant="outline" className="border-primary/50 text-primary">
                        <Video className="h-3 w-3 mr-1.5"/>
                        Video Consult
                    </Badge>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
            <Ticket className="h-5 w-5 text-primary"/>
            <div className="flex-1">
                <p className="text-xs text-primary/80">Your Token</p>
                <p className="font-bold text-primary text-lg">{appointment.id.slice(-6).toUpperCase()}</p>
            </div>
        </div>
         <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-muted-foreground"/>
            <span className="font-medium">{appointment.clinic?.name}</span>
        </div>
         <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground"/>
            <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground"/>
            <span className="font-medium">{formattedTime}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch bg-muted/30 p-4 min-h-[6rem]">
         {isCompleted && (
            <div className="text-center text-sm text-green-600 font-medium p-2 bg-green-100 rounded-md">
                <CheckCircle className="inline-block mr-2 h-4 w-4"/>
                This appointment is complete.
            </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default function AppointmentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
    setUser(currentUser);
    if (currentUser) {
      getAppointmentsForUser(currentUser.uid).then(userAppointments => {
        setAppointments(userAppointments);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
          <p className="mt-4 text-muted-foreground">Loading your appointments...</p>
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
                <p className="text-muted-foreground">You have no upcoming or past appointments.</p>
                <Button asChild>
                    <Link href="/search">
                        <Stethoscope className="mr-2 h-4 w-4"/>
                        Book a New Appointment
                    </Link>
                </Button>
           </div>
        );
    }

    const upcomingAppointments = appointments.filter(a => a.status === 'confirmed');
    const pastAppointments = appointments.filter(a => a.status !== 'confirmed');

    return (
      <div className="space-y-8">
        {upcomingAppointments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline text-accent">Upcoming</h3>
            {upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
          </div>
        )}
        {pastAppointments.length > 0 && (
            <div className="space-y-4">
                 <h3 className="text-xl font-bold font-headline text-accent">Past</h3>
                {pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12 w-full">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
           <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
            <Calendar className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-accent">My Appointments</h1>
          <p className="text-lg text-muted-foreground">View your upcoming and past appointments.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
