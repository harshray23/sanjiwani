

"use client";

import { useEffect, useState } from 'react';
import { getDoctorById, updateDoctorProfile } from '@/lib/data';
import type { DoctorProfile, Appointment, User as AppUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Clock, PlusCircle, Pencil, Upload, LogIn, ShieldAlert } from "lucide-react";
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

const profileFormSchema = z.object({
  specialization: z.string().min(2, "Please list at least one specialty."),
  licenseNo: z.string().min(2, "License number is required."),
  consultationFee: z.coerce.number().positive("Fee must be a positive number."),
});

const DoctorDashboard = () => {
  const [userProfile, setUserProfile] = useState<AppUser | null | undefined>(undefined);
  const [doctor, setDoctor] = useState<DoctorProfile | null | undefined>(undefined);
  const [appointments, setAppointments] = useState<Appointment[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      specialization: "",
      licenseNo: "",
      consultationFee: 0,
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(currentUser);

    const fetchData = async () => {
        if (currentUser && currentUser.role === 'doctor') {
            try {
                const doctorProfile = await getDoctorById(currentUser.uid);
                setDoctor(doctorProfile);
                if (doctorProfile) {
                     profileForm.reset({
                        specialization: doctorProfile.specialization || '',
                        licenseNo: doctorProfile.licenseNo || '',
                        consultationFee: doctorProfile.consultationFee || 500,
                    });
                }
                // TODO: Fetch appointments for the doctor
                setAppointments([]);
            } catch (error) {
                console.error("Error fetching doctor data:", error);
                toast({ title: "Error", description: "Could not load doctor profile.", variant: "destructive"});
                setDoctor(null);
            }
        }
        setIsLoading(false);
    };

    fetchData();
  }, [profileForm, toast]);

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
      if (!userProfile) return;
      try {
        await updateDoctorProfile(userProfile.uid, values);
        toast({
            title: "Profile Updated!",
            description: "Your information has been saved successfully.",
        });
        // Refetch doctor data to update UI if needed
        const updatedDoctorProfile = await getDoctorById(userProfile.uid);
        setDoctor(updatedDoctorProfile);
      } catch (error) {
        console.error("Failed to update profile", error);
        toast({ title: "Update Failed", description: "Could not save your profile.", variant: "destructive"});
      }
  };
  
  if (userProfile === undefined || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Doctor Dashboard...</p>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'doctor') {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto p-8">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold font-headline text-destructive">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You must be logged in as a doctor to view this page.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4"/>
                Go to Login
              </Link>
            </Button>
        </Card>
      </div>
    );
  }
  
  if (!doctor) {
      return (
         <div className="text-center p-8">
            <Card className="max-w-md mx-auto p-8">
                <h2 className="text-2xl font-bold font-headline text-destructive">Profile Not Found</h2>
                <p className="mt-2 text-muted-foreground">We couldn't find a doctor profile associated with your account.</p>
            </Card>
        </div>
      )
  }

  return (
    <div className="py-12 w-full max-w-5xl mx-auto">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-headline text-accent">Welcome, {doctor.name}</h1>
        <p className="text-lg text-muted-foreground">Manage your appointments, profile, and availability.</p>
      </div>

      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">My Appointments ({appointments?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="profile">Profile & Skills</TabsTrigger>
          <TabsTrigger value="availability">Availability & Locations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Upcoming & Past Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments && appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map(app => (
                    <Card key={app.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{app.patient?.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {format(new Date(app.scheduledAt), 'PP')}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> {format(new Date(app.scheduledAt), 'p')}</span>
                        </p>
                      </div>
                       <Badge variant={app.status === 'completed' ? 'default' : 'secondary'} className={app.status === 'completed' ? 'bg-green-600' : ''}>
                          {app.status}
                       </Badge>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">You have no appointments scheduled.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">Profile Settings</CardTitle>
                <CardDescription>Update your public profile information and skills.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                         <h4 className="font-semibold">Profile Picture</h4>
                         <div className="relative w-40 h-40 mx-auto">
                            <Image
                                src={doctor.imageUrl || `https://i.pravatar.cc/150?u=${doctor.uid}`}
                                alt={doctor.name || 'Doctor profile picture'}
                                width={160}
                                height={160}
                                className="rounded-full object-cover border-4 border-primary/20"
                            />
                         </div>
                         <Button className="w-full" variant="outline" onClick={() => toast({title: "Feature coming soon!"})}>
                            <Upload className="mr-2 h-4 w-4"/>
                            Upload New Photo
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                <FormField
                                    control={profileForm.control}
                                    name="specialization"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specialization</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Cardiology, Pediatric Care" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={profileForm.control}
                                    name="licenseNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>License Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your medical license number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={profileForm.control}
                                    name="consultationFee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Consultation Fee (INR)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 800" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="availability">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Manage Your Availability</CardTitle>
                    <CardDescription>View and edit your available time slots at your practice locations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Location and availability editing to be implemented */}
                     <Card className="border-dashed">
                        <CardContent className="p-6 text-center">
                             <p className="text-muted-foreground">Availability management is coming soon.</p>
                            <Button variant="outline" className="mt-4">
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add a New Practice Location
                            </Button>
                        </CardContent>
                    </Card>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
