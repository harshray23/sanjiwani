
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAppointmentById } from '@/lib/data';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Ticket, User, Stethoscope, Building, Calendar, Clock, IndianRupee } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) {
      setIsLoading(false);
      return;
    }
    const fetchAppointment = async () => {
      setIsLoading(true);
      const data = await getAppointmentById(appointmentId);
      if (data) {
        setAppointment(data);
      }
      setIsLoading(false);
    };
    fetchAppointment();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="text-lg text-muted-foreground mt-4">Finalizing your appointment...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center p-8">
        <CardTitle className="text-2xl text-destructive">Appointment Not Found</CardTitle>
        <CardDescription className="mt-2">
          We couldn't find the details for this appointment. Please check your appointments list.
        </CardDescription>
        <Button asChild className="mt-6">
          <Link href="/appointments">View My Appointments</Link>
        </Button>
      </div>
    );
  }
  
  const appointmentDate = new Date(appointment.date);
  if (isNaN(appointmentDate.getTime())) {
    // Handle invalid date string from mock data if necessary
    return <div>Invalid date format</div>;
  }
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');

  return (
    <>
      <CardHeader className="text-center items-center pb-4">
        <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit mb-4">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-3xl font-headline text-green-600 dark:text-green-400">Appointment Confirmed!</CardTitle>
        <CardDescription className="max-w-md">
          Your fee has been received and your appointment is booked. The clinic and doctor have been notified.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border border-dashed rounded-lg p-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
                <p className="text-sm text-muted-foreground">Your Unique Token</p>
                <p className="text-3xl font-bold text-primary flex items-center gap-2">
                  <Ticket className="h-8 w-8"/> 
                  {appointment.token}
                </p>
             </div>
             <p className="text-sm text-center sm:text-right max-w-xs text-muted-foreground">Show this token at the clinic reception for a priority check-in.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <h4 className="font-bold text-lg col-span-1 md:col-span-2">Appointment Details</h4>
            
            <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-semibold">{appointment.doctor.name}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Clinic</p>
                    <p className="font-semibold">{appointment.clinic.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">{formattedDate}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-semibold">{appointment.time}</p>
                </div>
            </div>
        </div>
        
        <Separator/>

        <div className="space-y-2">
            <h4 className="font-bold text-lg">Fee Slip</h4>
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Consultation Fee:</span>
                    <span>₹{appointment.feeDetails.consultationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span>₹{appointment.feeDetails.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span className="text-foreground">Total Paid:</span>
                    <span className="text-primary">₹{appointment.feeDetails.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row justify-center gap-4">
        <Button asChild className="w-full sm:w-auto">
            <Link href="/appointments">
                View All My Appointments
            </Link>
        </Button>
         <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
                Back to Home
            </Link>
        </Button>
      </CardFooter>
    </>
  )
}

export default function ConfirmedAppointmentPage() {
  return (
    <div className="py-12 w-full">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
            <p className="text-lg text-muted-foreground mt-4">Loading confirmation...</p>
          </div>
        }>
          <ConfirmationContent />
        </Suspense>
      </Card>
    </div>
  );
}
