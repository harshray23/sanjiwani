
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getClinicById, getAppointmentsForClinic, getUserProfile } from '@/lib/data';
import type { Clinic, Appointment, User as AppUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { UserPlus, Pencil, LogIn, Hourglass, Trash2, Upload, ShieldAlert } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const ClinicDashboard = () => {
  const [userProfile, setUserProfile] = useState<AppUser | null | undefined>(undefined);
  const [clinic, setClinic] = useState<Clinic | null | undefined>(undefined);
  const [appointments, setAppointments] = useState<Appointment[] | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
            const profile = await getUserProfile(currentUser.uid);
            setUserProfile(profile);

            if (profile?.role === 'clinic') {
                const clinicId = 'clinic-1'; // Mock: Assume this user's clinic is always 'clinic-1'
                
                const [clinicData, appointmentData] = await Promise.all([
                    getClinicById(clinicId),
                    getAppointmentsForClinic(clinicId)
                ]);

                if (clinicData) {
                  setClinic(clinicData);
                  setAppointments(appointmentData);
                } else {
                  setClinic(null);
                  setAppointments([]);
                }
            }
        } catch (error) {
            console.error("Error fetching clinic data:", error);
            toast({ title: "Error", description: "Could not load clinic data.", variant: "destructive"});
            setUserProfile(null);
            setClinic(null);
        }
      } else {
        setUserProfile(null);
        setClinic(null);
      }
    });
    return () => unsubscribe();
  }, [toast]);
  
  const handleUpdateTimings = () => {
      toast({
          title: "Timings Updated",
          description: "Your clinic hours have been successfully updated.",
      });
  }
  
   const handleAction = (action: string, entity: string, id: string) => {
    toast({
        title: "Action Mocked",
        description: `This would ${action} the ${entity} with ID: ${id}.`,
    });
  }


  if (userProfile === undefined || clinic === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Clinic Dashboard...</p>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'clinic') {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto p-8">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold font-headline text-destructive">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You must be logged in as a clinic administrator to view this page.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">
                 <LogIn className="mr-2"/>
                 Go to Login
              </Link>
            </Button>
        </Card>
      </div>
    );
  }

  if (!clinic) {
    return (
         <div className="text-center p-8">
            <Card className="max-w-md mx-auto p-8">
                <h2 className="text-2xl font-bold font-headline text-destructive">Profile Not Found</h2>
                <p className="mt-2 text-muted-foreground">We couldn't find a clinic profile associated with your account.</p>
            </Card>
        </div>
    )
  }

  return (
    <div className="py-12 w-full max-w-5xl mx-auto">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-headline text-accent">Clinic Dashboard</h1>
        <p className="text-lg text-muted-foreground">Managing {clinic.name}</p>
      </div>

       <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Appointments ({appointments?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="doctors">Doctors ({clinic.doctors.length})</TabsTrigger>
          <TabsTrigger value="profile">Clinic Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Patient Appointments</CardTitle>
                    <CardDescription>All appointments scheduled at your clinic.</CardDescription>
                </CardHeader>
                <CardContent>
                    {appointments && appointments.length > 0 ? (
                        <div className="space-y-4">
                        {appointments.map(app => (
                            <Card key={app.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{app.patientName}</p>
                                <p className="text-sm text-muted-foreground">with <span className="font-medium text-foreground">{app.doctor.name}</span></p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1.5"> {format(new Date(app.date), 'PP')}</span>
                                    <span className="flex items-center gap-1.5"> {app.time}</span>
                                </p>
                            </div>
                            <p className="text-sm font-bold">{app.status}</p>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No appointments found.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="doctors">
             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Manage Doctors</CardTitle>
                        <CardDescription>Add, view, or remove doctors from your clinic.</CardDescription>
                    </div>
                    <Button onClick={() => handleAction('add', 'doctor', '')}><UserPlus className="mr-2"/> Add New Doctor</Button>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {clinic.doctors.map(doc => (
                            <Card key={doc.id} className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-12 w-12">
                                        <AvatarImage src={doc.imageUrl} alt={doc.name} />
                                        <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-lg">{doc.name}</p>
                                        <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleAction('edit', 'doctor', doc.id)}><Pencil className="mr-2 h-4 w-4"/> Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleAction('remove', 'doctor', doc.id)}><Trash2 className="mr-2 h-4 w-4"/>Remove</Button>
                                </div>
                            </Card>
                        ))}
                     </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Clinic Information</CardTitle>
                    <CardDescription>Update your clinic's public details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-2">
                             <label className="font-semibold">Clinic Picture</label>
                             <Image 
                                src={clinic.imageUrl} 
                                alt={clinic.name}
                                width={200}
                                height={200}
                                className="w-full aspect-square object-cover rounded-lg border"
                             />
                              <Button className="w-full" variant="outline" onClick={() => toast({title: "Feature coming soon!"})}>
                                <Upload className="mr-2 h-4 w-4"/>
                                Upload New Photo
                            </Button>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                             <div className="space-y-2">
                                <label className="font-semibold">Clinic Name</label>
                                <Input defaultValue={clinic.name} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-semibold">About Section</label>
                                <Textarea defaultValue={clinic.about} rows={5}/>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-semibold flex items-center gap-2"><Hourglass/>Opening Time</label>
                                    <Input type="time" defaultValue="09:00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-semibold flex items-center gap-2"><Hourglass/>Closing Time</label>
                                    <Input type="time" defaultValue="18:00" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleUpdateTimings}>Update Information</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicDashboard;

    