
"use client";

import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAppointmentsForUser, updateAppointmentStatus, updateAppointmentWithVideoConsult, submitAppointmentFeedback } from '@/lib/mock-data';
import type { Appointment, VideoConsultationDetails, AppointmentFeedback } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, LogIn, Building, Clock, Stethoscope, Ticket, Upload, CheckCircle, XCircle, BellRing, Pill, Video, Copy, MessageSquarePlus } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { verifyPrescription, VerifyPrescriptionOutput } from '@/ai/flows/verify-prescription-flow';
import { setMedicineReminder } from '@/ai/flows/set-reminder-flow';
import { Input } from '@/components/ui/input';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { FeedbackDialog } from '@/components/FeedbackDialog';

const AppointmentCard = ({ appointment, onStatusChange, onVideoConsultUpdate, onFeedbackSubmit }: { appointment: Appointment, onStatusChange: (id: string, status: Appointment['status']) => void, onVideoConsultUpdate: (id:string, details: VideoConsultationDetails) => void, onFeedbackSubmit: (id: string, feedback: AppointmentFeedback) => void }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSettingReminder, setIsSettingReminder] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await verifyPrescription({ 
                photoDataUri, 
                doctorName: appointment.doctor.name 
            });
            if (result.isValid) {
                onStatusChange(appointment.id, 'Completed');
                toast({ title: "Prescription Verified!", description: "Cashback will be processed within 24 hours.", variant: "default" });
            } else {
                 toast({ title: "Verification Failed", description: result.reason, variant: "destructive" });
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
  
  const handleSetReminder = async () => {
      if (!reminderText) {
          toast({ title: "Input required", description: "Please enter a medicine name.", variant: "destructive"});
          return;
      }
      setIsSettingReminder(true);
      try {
          const result = await setMedicineReminder({ reminderText });
          toast({ title: "Reminder Set!", description: result.confirmationMessage });
          setReminderText('');
      } catch (error) {
          console.error("Reminder error:", error);
          toast({ title: "An Error Occurred", description: "Could not set the reminder. Please try again later.", variant: "destructive" });
      } finally {
        setIsSettingReminder(false);
      }
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Meeting link copied to clipboard." });
  }

  const handleFeedbackSubmit = (feedback: AppointmentFeedback) => {
      onFeedbackSubmit(appointment.id, feedback);
      toast({
          title: "Feedback Submitted!",
          description: "Thank you for sharing your experience.",
      })
  }

  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');

  const renderActionSection = () => {
    if (appointment.status === 'Completed') {
        return (
             <div className="space-y-4">
                {appointment.feedback ? (
                    <div className="text-center text-sm text-muted-foreground p-2 rounded-md bg-green-500/10">
                        <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-600"/>
                        Feedback submitted. Thank you!
                    </div>
                ) : (
                    <>
                        <FeedbackDialog 
                            open={isFeedbackDialogOpen}
                            onOpenChange={setIsFeedbackDialogOpen}
                            onSubmit={handleFeedbackSubmit}
                        >
                            <Button variant="outline" className="w-full" onClick={() => setIsFeedbackDialogOpen(true)}>
                                <MessageSquarePlus className="mr-2 h-4 w-4"/>
                                Leave Feedback
                            </Button>
                        </FeedbackDialog>
                         <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-2 rounded-md bg-green-500/10">
                            <CheckCircle className="h-5 w-5" />
                            <p className="font-semibold text-sm">Appointment Completed</p>
                        </div>
                    </>
                )}
                 <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Pill className="h-4 w-4"/>Medicine Reminders</h4>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., Paracetamol" 
                            className="bg-white dark:bg-card"
                            value={reminderText}
                            onChange={(e) => setReminderText(e.target.value)}
                            disabled={isSettingReminder}
                        />
                        <Button variant="secondary" onClick={handleSetReminder} disabled={isSettingReminder}>
                            {isSettingReminder ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Set'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (appointment.appointmentType === 'video' && appointment.videoConsultDetails) {
        const { meetingLink, preliminaryAdvice } = appointment.videoConsultDetails;
        return (
             <div className="space-y-3">
                <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Video Consultation Link</h4>
                    <div className="flex gap-2">
                        <Input value={meetingLink} readOnly className="bg-white dark:bg-card text-xs"/>
                        <Button variant="secondary" size="icon" onClick={() => handleCopyToClipboard(meetingLink)}>
                            <Copy className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground p-2 bg-blue-500/10 rounded-md border border-blue-500/20">
                    <p className="font-semibold mb-1 text-blue-700 dark:text-blue-300">Doctor's Advice:</p>
                    <p>{preliminaryAdvice}</p>
                </div>
             </div>
        )
    }

    if (appointment.status === 'Confirmed' && appointment.appointmentType === 'clinic') {
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
                 <CardTitle className="text-xl font-headline text-accent">Dr. {appointment.doctor.name}</CardTitle>
                 <CardDescription>{appointment.doctor.specialty}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <Badge 
                    variant={appointment.status === 'Completed' ? 'default' : (appointment.status === 'Confirmed' ? 'secondary' : 'destructive')}
                    className={appointment.status === 'Completed' ? 'bg-green-600 text-white' : ''}
                >
                    {appointment.status}
                </Badge>
                {appointment.appointmentType === 'video' && (
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
      <CardFooter className="flex flex-col items-stretch bg-muted/30 p-4 min-h-[6rem]">
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
  
  const handleVideoConsultUpdate = (id: string, details: VideoConsultationDetails) => {
      setAppointments(prev => prev.map(app => app.id === id ? {...app, videoConsultDetails: details} : app));
      updateAppointmentWithVideoConsult(id, details);
  }

  const handleFeedbackSubmit = (id: string, feedback: AppointmentFeedback) => {
      setAppointments(prev => prev.map(app => app.id === id ? {...app, feedback} : app));
      submitAppointmentFeedback(id, feedback);
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userAppointments = await getAppointmentsForUser(currentUser.uid);
        setAppointments(userAppointments);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
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

    const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed');
    const pastAppointments = appointments.filter(a => a.status !== 'Confirmed');

    return (
      <div className="space-y-8">
        {upcomingAppointments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline text-accent">Upcoming</h3>
            {upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} onStatusChange={handleStatusChange} onVideoConsultUpdate={handleVideoConsultUpdate} onFeedbackSubmit={handleFeedbackSubmit}/>)}
          </div>
        )}
        {pastAppointments.length > 0 && (
            <div className="space-y-4">
                 <h3 className="text-xl font-bold font-headline text-accent">Past</h3>
                {pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} onStatusChange={handleStatusChange} onVideoConsultUpdate={handleVideoConsultUpdate} onFeedbackSubmit={handleFeedbackSubmit}/>)}
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
