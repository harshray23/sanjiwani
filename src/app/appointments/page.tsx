
"use client";

import { useEffect, useState } from 'react';
import { getAppointmentsForUser } from '@/lib/data';
import type { Appointment, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, LogIn, Building, Clock, Stethoscope, Ticket, CheckCircle, Video, Hospital, FlaskConical, BedDouble, Microscope } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const appointmentDate = new Date(appointment.scheduledAt);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = appointment.type === 'bed' ? 'Instant Reservation' : format(appointmentDate, 'p');
  const isCompleted = appointment.status === 'completed';

  const getTitle = () => {
      if (appointment.type === 'bed') return appointment.hospital?.name || "Hospital Bed";
      if (appointment.type === 'test') return appointment.testName || "Lab Test";
      return `Dr. ${appointment.doctor?.name || 'Unknown'}`;
  }

  const getSubtitle = () => {
      if (appointment.type === 'bed') return `Bed Type: ${appointment.bedType?.toUpperCase()}`;
      if (appointment.type === 'test') return "Diagnostic Center Booking";
      return appointment.doctor?.specialization;
  }

  const getIcon = () => {
      if (appointment.type === 'bed') return <Hospital className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full"/>;
      if (appointment.type === 'test') return <Microscope className="h-10 w-10 text-green-500 bg-green-100 p-2 rounded-full"/>;
      return <Stethoscope className="h-10 w-10 text-orange-500 bg-orange-100 p-2 rounded-full"/>;
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-all border-l-4 border-l-primary bg-card overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
                 {getIcon()}
                 <div>
                    <CardTitle className="text-xl font-headline text-accent group-hover:text-primary transition-colors">{getTitle()}</CardTitle>
                    <CardDescription className="font-medium text-primary/80">{getSubtitle()}</CardDescription>
                 </div>
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
      <CardContent className="space-y-3 text-sm pb-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-muted">
            <Ticket className="h-5 w-5 text-primary"/>
            <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Booking ID</p>
                <p className="font-bold text-primary text-lg">{appointment.id.slice(-6).toUpperCase()}</p>
            </div>
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-primary"/>
                <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary"/>
                <span className="font-medium">{formattedTime}</span>
            </div>
         </div>
         {appointment.clinic?.name && (
            <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground"/>
                <span className="text-muted-foreground">Location: {appointment.clinic.name}</span>
            </div>
         )}
      </CardContent>
      {isCompleted && (
        <CardFooter className="bg-green-50 dark:bg-green-900/20 py-2 border-t border-green-100 dark:border-green-900/30">
            <p className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-2">
                <CheckCircle className="h-3 w-3"/>
                Visit Completed
            </p>
        </CardFooter>
      )}
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
      getAppointmentsForUser(currentUser.uid).then(allBookings => {
        setAppointments(allBookings);
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
          <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center p-12 bg-card rounded-xl shadow-lg border">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Your Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view and manage your appointments, bed reservations, and test results.
          </p>
          <Button asChild size="lg">
            <Link href="/login">
              Go to Login
            </Link>
          </Button>
        </div>
      );
    }

    if (appointments.length === 0) {
        return (
           <div className="text-center p-12 bg-card rounded-xl shadow-lg border">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-lg font-medium text-muted-foreground mb-6">You have no upcoming or past bookings.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/search">
                            <Stethoscope className="mr-2 h-4 w-4"/>
                            Find Doctors
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/hospitals">
                            <Hospital className="mr-2 h-4 w-4"/>
                            Hospitals
                        </Link>
                    </Button>
                </div>
           </div>
        );
    }

    const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

    return (
      <div className="space-y-10">
        {upcomingAppointments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
                <h3 className="text-xl font-bold font-headline text-accent uppercase tracking-wider">Upcoming & Active</h3>
            </div>
            <div className="grid gap-6">
                {upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
            </div>
          </div>
        )}
        {pastAppointments.length > 0 && (
            <div className="space-y-4">
                 <div className="flex items-center gap-2 border-b pb-2 opacity-60">
                    <h3 className="text-xl font-bold font-headline text-accent uppercase tracking-wider">Past History</h3>
                </div>
                <div className="grid gap-6 opacity-80 grayscale-[0.2]">
                    {pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12 w-full">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
           <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit mb-4">
            <Calendar className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-4xl font-bold font-headline text-accent">My Bookings</h1>
          <p className="text-lg text-muted-foreground">Manage your consultations, hospital beds, and diagnostic tests in one place.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
