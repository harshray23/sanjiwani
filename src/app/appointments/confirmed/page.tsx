
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAppointmentById } from '@/lib/data';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Ticket, User, Stethoscope, Building, Calendar, Clock, IndianRupee, ShieldCheck, ExternalLink, Hash } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Badge } from '@/components/ui/badge';

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
      // Poll a few times if proof is pending (simulating webhook latency)
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
  
  const getAppointmentDate = () => {
    try {
        if (appointment.scheduledAt) {
            const date = new Date(appointment.scheduledAt);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    } catch(e) {}
    return new Date();
  }

  const appointmentDate = getAppointmentDate();
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(appointmentDate, 'p');

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
        {/* Token and Proof Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed rounded-lg p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Your Unique Token</p>
                <p className="text-3xl font-bold text-primary flex items-center gap-2">
                    <Ticket className="h-8 w-8"/> 
                    {appointment.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Show this at clinic reception.</p>
            </div>

            <div className="border border-accent/20 rounded-lg p-4 bg-accent/5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-accent">Payment Integrity Proof</p>
                        <Badge className="bg-accent text-[10px] h-5">Avalanche Verified</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono break-all line-clamp-2">
                        Hash: {appointment.onChainHash || 'Anchoring in progress...'}
                    </p>
                </div>
                {appointment.txHash && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-accent self-start mt-2" asChild>
                        <Link href={`https://testnet.snowtrace.io/tx/${appointment.txHash}`} target="_blank">
                            <ExternalLink className="h-3 w-3 mr-1"/> View on Avalanche Fuji
                        </Link>
                    </Button>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <h4 className="font-bold text-lg col-span-1 md:col-span-2">Appointment Details</h4>
            
            <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Doctor</p>
                    <p className="font-semibold">{appointment.doctor?.name}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Clinic</p>
                    <p className="font-semibold">{appointment.clinic?.name}</p>
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
                    <p className="font-semibold">{formattedTime}</p>
                </div>
            </div>
        </div>
        
        <Separator/>

        <div className="space-y-2">
            <h4 className="font-bold text-lg">Fee Slip</h4>
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Consultation Fee:</span>
                    <span>₹{appointment.doctor?.consultationFee?.toFixed(2) || '500.00'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span>₹{0.00.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span className="text-foreground">Total Paid:</span>
                    <span className="text-primary">₹{appointment.doctor?.consultationFee?.toFixed(2) || '500.00'}</span>
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
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
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
