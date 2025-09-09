
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAppointmentsForDoctor, getDoctorById, getClinicById } from '@/lib/data';
import type { Appointment, Doctor, Clinic } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, User as UserIcon, Building, Clock, BadgeCheck, Briefcase, PlusCircle, Home, MapPin, Pencil, Upload, LogIn } from "lucide-react";
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
import Image from 'next/image';

const profileFormSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(500, "Bio cannot exceed 500 characters."),
  qualifications: z.string().min(2, "Please list at least one qualification."),
  specialties: z.string().min(2, "Please list at least one specialty."),
});

const availabilityFormSchema = z.object({
    slots: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one time slot.",
    }),
});

const availableTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const LocationCard = ({ clinic, doctor }: { clinic: Clinic, doctor: Doctor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof availabilityFormSchema>>({
        resolver: zodResolver(availabilityFormSchema),
        defaultValues: {
            slots: doctor.availableSlots.filter(s => s.isAvailable).map(s => s.time),
        }
    });

    const onSubmit = (values: z.infer<typeof availabilityFormSchema>) => {
        console.log("Updating availability for", clinic.name, values);
        toast({
            title: "Availability Updated!",
            description: `Your schedule for ${clinic.name} has been updated.`,
        });
        setIsEditing(false);
    }
    
    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                           <Building className="h-5 w-5 text-primary"/> {clinic.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 pl-7 text-sm"><MapPin className="h-4 w-4"/> {clinic.contact.address}</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Pencil className="mr-2 h-4 w-4"/> Edit
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="slots"
                                render={() => (
                                    <FormItem>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {availableTimeSlots.map((item) => (
                                                <FormField
                                                key={item}
                                                control={form.control}
                                                name="slots"
                                                render={({ field }) => (
                                                    <FormItem key={item} className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                    ? field.onChange([...(field.value ?? []), item])
                                                                    : field.onChange(field.value?.filter((value) => value !== item))
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal text-sm">{item}</FormLabel>
                                                    </FormItem>
                                                )}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit">Save Timings</Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {doctor.availableSlots.map(slot => (
                            <Badge key={slot.time} variant={slot.isAvailable ? 'default' : 'secondary'} className="justify-center py-1">
                                {slot.time}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

const DoctorDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "",
      qualifications: "",
      specialties: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // In a real app, you'd fetch the doctor profile linked to the UID
        // For mock, we'll assume the doctor is the first one with a matching email pattern.
        const mockDoctorId = 'doc-1'; // Hardcoding for demo
        const doctorProfile = await getDoctorById(mockDoctorId);
        
        if (doctorProfile) {
            setDoctor(doctorProfile);
            const doctorAppointments = await getAppointmentsForDoctor(mockDoctorId);
            setAppointments(doctorAppointments);

            profileForm.reset({
                bio: doctorProfile.bio,
                qualifications: doctorProfile.qualifications.join(', '),
                specialties: doctorProfile.specialty
            });

            // Fetch associated clinics
            const clinicData = await getClinicById(doctorProfile.clinicId);
            if (clinicData) {
                setClinics([clinicData]);
            }
        }
      } else {
        setUser(null);
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
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4"/>
            Go to Login
          </Link>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                         <h4 className="font-semibold">Profile Picture</h4>
                         <div className="relative w-40 h-40 mx-auto">
                            <Image
                                src={doctor.imageUrl}
                                alt={doctor.name}
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
                    </div>
                </div>
            </CardContent>
           </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Manage Your Availability</CardTitle>
                    <CardDescription>View and edit your available time slots at your practice locations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {clinics.map(clinic => (
                        <LocationCard key={clinic.id} clinic={clinic} doctor={doctor} />
                    ))}
                     <Card className="border-dashed">
                        <CardContent className="p-6 text-center">
                            <Button variant="outline">
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

    