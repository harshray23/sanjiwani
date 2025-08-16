
"use client";

import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAppointmentsForUser, updateAppointmentStatus } from '@/lib/mock-data';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, LogIn, Building, Clock, Stethoscope, Ticket, Upload, CheckCircle, XCircle, BellRing, Pill } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { verifyPrescription, VerifyPrescriptionOutput } from '@/ai/flows/verify-prescription-flow';
import { Input } from '@/components/ui/input';

const AppointmentCard = ({ appointment, onStatusChange }: { appointment: Appointment, onStatusChange: (id: string, status: Appointment['status']) => void }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifyPrescriptionOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ title: "File too large", description: "Please upload an image smaller than 4MB.", variant: "destructive" });
        return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    // Convert image to data URI
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await verifyPrescription({ 
                photoDataUri, 
                doctorName: appointment.doctor.name 
            });
            setVerificationResult(result);
            if (result.isValid) {
                onStatusChange(appointment.id, 'Completed');
                toast({ title: "Prescription Verified!", description: "Cashback of will be processed within 24 hours.", variant: "default" });
            } else {
                 toast({ title: "Verification Failed", description: "Could not verify the doctor's name on the prescription. Please try again.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast({ title: "An Error Occurred", description: "Could not verify the prescription. Please try again later.", variant: "destructive" });
        } finally {
            setIsVerifying(false);
        }
    };
    reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
        setIsVerifying(false);
    };
  };
  
  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');

  const renderActionSection = () => {
    if (appointment.status === 'Completed') {
        return (
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-2 rounded-md bg-green-500/10">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-semibold text-sm">Cashback Processed</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Pill className="h-4 w-4"/>Medicine Reminders</h4>
                    <div className="flex gap-2">
                        <Input placeholder="e.g., Paracetamol" className="bg-white dark:bg-card"/>
                        <Button variant="secondary">Set Reminder</Button>
                    </div>
                </div>
            </div>
        )
    }

    if (appointment.status === 'Confirmed') {
        return (
            <div className="space-y-3">
                 <div className="flex items-center gap-2 text-primary dark:text-primary-foreground p-2 rounded-md bg-primary/10">
                    <BellRing className="h-5 w-5" />
                    <p className="font-semibold text-sm">You will be notified 1 hour before your appointment.</p>
                </div>
                 <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id={`file-upload-${appointment.id}`}/>
                 <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isVerifying}
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Verifying...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4"/> Upload Prescription for Cashback
                        </>
                    )}
                 </Button>
            </div>
        )
    }
    return null;
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-xl font-headline">Dr. {appointment.doctor.name}</CardTitle>
                 <CardDescription>{appointment.doctor.specialty}</CardDescription>
            </div>
            <Badge 
                variant={appointment.status === 'Completed' ? 'default' : (appointment.status === 'Confirmed' ? 'secondary' : 'destructive')}
                className={appointment.status === 'Completed' ? 'bg-green-600 text-white' : ''}
            >
                {appointment.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10">
            <Ticket className="h-5 w-5 text-primary"/>
            <div className="flex-1">
                <p className="text-xs text-primary/80">Your Token</p>
                <p className="font-bold text-primary text-lg">{appointment.token}</p>
            </div>
        </div>
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
      </CardContent>
      <CardFooter className="flex flex-col items-stretch bg-muted/30 p-4">
        {renderActionSection()}
      </CardFooter>
    </Card>
  )
}

export default function AppointmentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status} : app));
    updateAppointmentStatus(id, status); // Update in mock data
  }

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

    return (
      <div className="space-y-6">
        {appointments.map(app => <AppointmentCard key={app.id} appointment={app} onStatusChange={handleStatusChange} />)}
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
          <CardDescription>View your appointments and manage cashback here.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
