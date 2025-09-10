

"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, User as UserIcon, Save, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { getUserProfile, updateUserProfile } from '@/lib/data';
import type { User as AppUser } from '@/lib/types';


const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number." }),
});

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if(currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
        if (profile) {
            form.reset({
                name: profile.name || "",
                phone: profile.phone || ""
            });
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    try {
        // This function now only needs to update the /users collection.
        // Your security rules allow this.
        await updateUserProfile(user.uid, values);
        toast({
            title: "Profile Updated",
            description: "Your information has been saved successfully.",
        });
    } catch(error) {
        console.error("Profile update failed:", error);
        toast({ title: "Update Failed", description: "Could not save your changes. Please try again.", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const dashboardLink = {
      doctor: { href: "/dashboard/doctor", label: "Go to Doctor Dashboard"},
      clinic: { href: "/dashboard/clinic", label: "Go to Clinic Dashboard"},
      diagnostics_centres: { href: "/dashboard/diagnostics", label: "Go to Diagnostics Dashboard"},
      hospital: { href: "/dashboard/hospital", label: "Go to Hospital Dashboard"},
      admin: { href: "/dashboard/admin", label: "Go to Admin Dashboard"},
      patient: {href: "/appointments", label: "View My Appointments"}
  }
  
  const currentDashboard = userProfile ? dashboardLink[userProfile.role as keyof typeof dashboardLink] : null;


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Your Profile...</p>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
       <div className="py-12 w-full text-center">
         <Card className="w-full max-w-md mx-auto shadow-xl p-8">
            <p className="text-muted-foreground mb-6">
                Please log in to view and manage your profile.
            </p>
            <Button asChild>
                <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Go to Login
                </Link>
            </Button>
         </Card>
      </div>
    );
  }

  return (
    <div className="py-12 w-full">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
                <UserIcon className="h-10 w-10 text-accent" />
            </div>
          <CardTitle className="text-3xl font-headline text-accent">My Profile</CardTitle>
          <CardDescription>Keep your personal information up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel>Email Address</FormLabel>
                <Input value={userProfile.email} disabled />
                 <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
              </div>

               <div className="space-y-2">
                <FormLabel>Your Role</FormLabel>
                <Input value={userProfile.role} disabled className="capitalize"/>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name / Organisation Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </form>
          </Form>

          {currentDashboard && (
             <div className="mt-8 border-t pt-6 text-center">
                <Button asChild variant="outline">
                    <Link href={currentDashboard.href}>
                        {currentDashboard.label}
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
             </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
