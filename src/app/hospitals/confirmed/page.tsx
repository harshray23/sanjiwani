
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle, Ticket, Hospital, Calendar, Clock, BedDouble } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

// Define a type for the booking details we expect from session storage
interface BedBookingDetails {
  id: string;
  hospitalName: string;
  bedType: string;
  patientName: string;
  reservedAt: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<BedBookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Data is passed via session storage for this mock flow
    const bookingDataString = sessionStorage.getItem('bedBookingDetails');
    if (bookingDataString) {
      const bookingData = JSON.parse(bookingDataString);
      // Ensure the ID from the URL matches the one in storage for security/consistency
      if (bookingData.id === bookingId) {
        setBooking(bookingData);
      }
    }
    setIsLoading(false);

    // Clean up session storage after reading
    return () => {
        sessionStorage.removeItem('bedBookingDetails');
    }
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="text-lg text-muted-foreground mt-4">Finalizing your bed reservation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center p-8">
        <CardTitle className="text-2xl text-destructive">Reservation Not Found</CardTitle>
        <CardDescription className="mt-2">
          We couldn't find the details for this reservation. Please try booking again.
        </CardDescription>
        <Button asChild className="mt-6">
          <Link href="/hospitals">Find Hospitals</Link>
        </Button>
      </div>
    );
  }
  
  const reservationDate = new Date(booking.reservedAt);
  const formattedDate = format(reservationDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(reservationDate, 'p');

  return (
    <>
      <CardHeader className="text-center items-center pb-4">
        <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit mb-4">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-3xl font-headline text-green-600 dark:text-green-400">Bed Reserved Successfully!</CardTitle>
        <CardDescription className="max-w-md">
          Your bed has been reserved. Please proceed to the hospital within 2 hours to complete admission formalities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border border-dashed rounded-lg p-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
                <p className="text-sm text-muted-foreground">Your Reservation ID</p>
                <p className="text-3xl font-bold text-primary flex items-center gap-2">
                  <Ticket className="h-8 w-8"/> 
                  {booking.id.slice(-6).toUpperCase()}
                </p>
             </div>
             <p className="text-sm text-center sm:text-right max-w-xs text-muted-foreground">Show this ID at the hospital reception for priority assistance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <h4 className="font-bold text-lg col-span-1 md:col-span-2">Reservation Details</h4>
            
            <div className="flex items-center gap-3">
                <Hospital className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Hospital</p>
                    <p className="font-semibold">{booking.hospitalName}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <BedDouble className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Bed Type</p>
                    <p className="font-semibold capitalize">{booking.bedType}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Reservation Date</p>
                    <p className="font-semibold">{formattedDate}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary"/>
                <div>
                    <p className="text-muted-foreground">Reservation Time</p>
                    <p className="font-semibold">{formattedTime}</p>
                </div>
            </div>
        </div>
        
        <Separator/>

        <div className="space-y-2">
            <h4 className="font-bold text-lg">Patient Details</h4>
            <p className="text-sm">Patient Name: <strong>{booking.patientName}</strong></p>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row justify-center gap-4">
        <Button asChild className="w-full sm:w-auto">
            <Link href="/appointments">
                View All My Bookings
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

export default function ConfirmedBedPage() {
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
