
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAppointmentsForDoctor, getDoctorById } from '@/lib/mock-data';
import type { Appointment, Doctor } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, User as UserIcon, Building, Clock, BadgeCheck, Briefcase, PlusCircle, Home } from "lucide-react";
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
import { Checkbox } from '@/components/ui/checkbox';

const profileFormSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(500, "Bio cannot exceed 500 characters."),
  qualifications: z.string().min(2, "Please list at least one qualification."),
  specialties: z.string().min(2, "Please list at least one specialty."),
});

const availabilityFormSchema = z.object({
    locationType: z.enum(["existing", "new", "home"]),
    locationName: z.string().optional(),
    address: z.string().optional(),
    slots: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one time slot.",
    }),
});

const DoctorDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
  });

  const availabilityForm = useForm<z.infer<typeof availabilityFormSchema>>({
      resolver: zodResolver(availabilityFormSchema),
      defaultValues: {
          locationType: "existing",
          slots: [],
      }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // In a real app, you'd fetch the doctor profile linked to the UID
        // For mock, we'll assume the doctor is the first one with a matching email pattern.
        const mockDoctorId = 'doc-1'; // Hardcoding for demo
        const doctorProfile = await getDoctorById(mockDoctorId);
        const doctorAppointments = await getAppointmentsForDoctor(mockDoctorId);

        if (doctorProfile) {
            setDoctor(doctorProfile);
            profileForm.reset({
                bio: doctorProfile.bio,
                qualifications: doctorProfile.qualifications.join(', '),
                specialties: doctorProfile.specialty
            });
        }
        setAppointments(doctorAppointments);

      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [profileForm]);

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
      toast({
          title: "Profile Updated!",
          description: "Your information has been saved successfully.",
      });
      console.log(values);
  };
  
  const onAvailabilitySubmit = (values: z.infer<typeof availabilityFormSchema>) => {
       toast({
          title: "Availability Updated!",
          description: "Your schedule has been updated for the selected location.",
      });
      console.log(values);
      availabilityForm.reset();
  }

  const availableTimeSlots = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Doctor Dashboard...</p>
      </div>
    );
  }

  if (!user || !doctor) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold font-headline text-destructive">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">
          You must be logged in as a doctor to view this page.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 w-full max-w-5xl mx-auto">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-headline text-accent">Welcome, {doctor.name}</h1>
        <p className="text-lg text-muted-foreground">Manage your appointments, profile, and availability.</p>
      </div>

      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">My Appointments ({appointments.length})</TabsTrigger>
          <TabsTrigger value="profile">Profile & Skills</TabsTrigger>
          <TabsTrigger value="availability">Availability & Locations</TabsTrigger>
        </TabsList>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Upcoming & Past Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map(app => (
                    <Card key={app.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{app.patientName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {format(new Date(app.date), 'PP')}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> {app.time}</span>
                        </p>
                      </div>
                       <Badge variant={app.status === 'Completed' ? 'default' : 'secondary'} className={app.status === 'Completed' ? 'bg-green-600' : ''}>
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

        {/* Profile Tab */}
        <TabsContent value="profile">
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">Profile Settings</CardTitle>
                <CardDescription>Update your public profile information and skills.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell patients a little about yourself..." {...field} rows={5}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="qualifications"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualifications</FormLabel>
                                     <FormControl>
                                        <Input placeholder="e.g., MD, MBBS, FACC" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={profileForm.control}
                            name="specialties"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specialties & Skills</FormLabel>
                                     <FormControl>
                                        <Input placeholder="e.g., Cardiology, Pediatric Care" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Save Changes</Button>
                    </form>
                </Form>
            </CardContent>
           </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Manage Your Availability</CardTitle>
                    <CardDescription>Add or update your available time slots at different locations.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...availabilityForm}>
                        <form onSubmit={availabilityForm.handleSubmit(onAvailabilitySubmit)} className="space-y-6">
                             <FormField
                                control={availabilityForm.control}
                                name="locationType"
                                render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Where are you practicing?</FormLabel>
                                    {/* Radix RadioGroup can be used here for better semantics */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button type="button" variant={field.value === 'existing' ? 'default' : 'outline'} onClick={() => field.onChange('existing')} className="flex-1 justify-start gap-2"><Building className="h-4 w-4"/> At an Existing Clinic/Hospital</Button>
                                        <Button type="button" variant={field.value === 'new' ? 'default' : 'outline'} onClick={() => field.onChange('new')} className="flex-1 justify-start gap-2"><PlusCircle className="h-4 w-4"/> At a New Location</Button>
                                        <Button type="button" variant={field.value === 'home' ? 'default' : 'outline'} onClick={() => field.onChange('home')} className="flex-1 justify-start gap-2"><Home className="h-4 w-4"/> At Home (for house calls)</Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            {availabilityForm.watch('locationType') === 'new' && (
                                <div className="grid sm:grid-cols-2 gap-4 p-4 border rounded-md">
                                     <FormField
                                        control={availabilityForm.control}
                                        name="locationName"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Clinic/Hospital Name</FormLabel>
                                            <FormControl><Input placeholder="e.g., Wellness Clinic" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={availabilityForm.control}
                                        name="address"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl><Input placeholder="123 Health St, City" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                             <FormField
                                control={availabilityForm.control}
                                name="slots"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Select Available Time Slots</FormLabel>
                                            <CardDescription>Choose the times you will be available at this location.</CardDescription>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {availableTimeSlots.map((item) => (
                                                <FormField
                                                key={item}
                                                control={availabilityForm.control}
                                                name="slots"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem
                                                        key={item}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value ?? []), item])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value) => value !== item
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        {item}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <Button type="submit">Update Availability</Button>
                        </form>
                    </Form>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;

    