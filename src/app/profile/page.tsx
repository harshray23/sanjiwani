
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, User as UserIcon, Save, ArrowRight, ShieldCheck, Mail, Briefcase, Hash } from "lucide-react";
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
import { updateUserProfile } from '@/lib/data';
import type { User as AppUser } from '@/lib/types';
import { cn } from '@/lib/utils';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number." }),
  age: z.coerce.number().min(1, "Age must be a positive number").max(120, "Age must be valid"),
});

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      age: 0,
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if(storedUser) {
      const profile = JSON.parse(storedUser);
      setUserProfile(profile);
      form.reset({
          name: profile.name || "",
          phone: profile.phone || "",
          age: profile.age || 0,
      });
    }
    setIsLoading(false);
  }, [form]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!userProfile) {
        toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    try {
        await updateUserProfile(userProfile.uid, values);

        const updatedProfile = { ...userProfile, ...values };
        setUserProfile(updatedProfile);
        localStorage.setItem('mockUser', JSON.stringify(updatedProfile));

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

  if (!userProfile) {
    return (
       <div className="py-12 w-full text-center">
         <Card className="w-full max-w-md mx-auto glass-morphism p-8">
            <p className="text-white/60 mb-6 font-medium">
                Please log in to view and manage your profile.
            </p>
            <Button asChild className="btn-gradient-orange rounded-full">
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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      
      {/* Background Atmosphere Text */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none opacity-20 text-center select-none space-y-24">
        <p className="text-2xl font-black text-white max-w-4xl px-10 blur-[1px]">
          Verified Health Vault data anchored to the **Avalanche Blockchain**...
        </p>
        <p className="text-xl font-medium text-white max-w-2xl px-10 italic">
          Health is the supreme foundation of Dharma (righteousness), Artha (prosperity), Karma (pleasure...
        </p>
      </div>

      {/* Profile Card Assembly */}
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700">
        
        {/* Animated Avatar Hub */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
            <div className="absolute inset-0 border-t-4 border-accent rounded-full animate-spin duration-[3s]" />
            <div className="absolute inset-2 border-2 border-white/10 rounded-full" />
            <div className="absolute inset-2 border-b-2 border-accent/60 rounded-full animate-spin duration-[5s] reverse" />
            
            {/* Central Icon Container */}
            <div className="relative w-24 h-24 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)]">
              <UserIcon className="h-12 w-12 text-white/80" />
            </div>
          </div>
        </div>

        <Card className="bg-[#0a0f1d]/80 backdrop-blur-2xl border-none shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] pt-20 pb-10 px-8 relative overflow-hidden group">
          {/* Subtle Inner Glow Border */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-accent/30 pointer-events-none shadow-[inset_0_0_20px_rgba(0,242,255,0.05)]" />
          
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-headline drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              My Profile
            </h1>
            <p className="text-sm font-bold tracking-wider text-white/40 uppercase">Keep your personal information up to date</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Row 1: Read-only Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      value={userProfile.email} 
                      disabled 
                      className="h-12 bg-white/5 border-accent/20 text-white/40 pl-12 rounded-2xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-accent ml-4">Your Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      value={userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)} 
                      disabled 
                      className="h-12 bg-white/5 border-accent/20 text-white/40 pl-12 rounded-2xl capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-accent ml-4">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Full Name" 
                        {...field} 
                        className="h-14 bg-white/5 border-accent/40 text-white text-lg rounded-2xl focus:bg-white/[0.08] focus:neon-glow-cyan transition-all"
                      />
                    </FormControl>
                    <FormMessage className="ml-4 text-xs font-bold" />
                  </FormItem>
                )}
              />

              {/* Row 3: Phone & Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-accent ml-4">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Phone Number" 
                          {...field} 
                          className="h-14 bg-white/5 border-accent/40 text-white rounded-2xl focus:neon-glow-cyan"
                        />
                      </FormControl>
                      <FormMessage className="ml-4 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-accent ml-4">Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Age" 
                          {...field} 
                          className="h-14 bg-white/5 border-accent/40 text-white rounded-2xl focus:neon-glow-cyan"
                        />
                      </FormControl>
                      <FormMessage className="ml-4 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            
              <Button 
                type="submit" 
                className="w-full h-16 rounded-full text-xl font-black text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)] border-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <div className="flex items-center gap-3">
                    <Save className="h-6 w-6" />
                    Save Changes
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {currentDashboard && (
             <div className="mt-8 flex justify-center">
                <Button asChild variant="outline" className="rounded-full h-12 px-10 border-white/10 glass-morphism text-white/60 hover:text-white hover:border-accent/50 hover:neon-glow-cyan transition-all">
                    <Link href={currentDashboard.href}>
                        {currentDashboard.label}
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
             </div>
          )}

        </Card>
      </div>

      {/* Decorative Flare */}
      <div className="fixed bottom-10 right-10 z-0 pointer-events-none opacity-20">
        <ShieldCheck className="h-32 w-32 text-accent blur-md animate-pulse" />
      </div>
    </div>
  );
}
