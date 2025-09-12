

"use client";

import { useEffect, useState } from 'react';
import { getDoctorById, getClinicById } from '@/lib/data';
import type { DoctorProfile, ClinicProfile, User } from '@/lib/types';
import Image from 'next/image';
import { Loader2, Star, Briefcase, GraduationCap, Calendar, Clock, Sparkles, IndianRupee, Medal, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [clinic, setClinic] = useState<ClinicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDoctorInfo = async () => {
      setIsLoading(true);
      const doctorData = await getDoctorById(id);
      if (doctorData) {
        setDoctor(doctorData);
        if (doctorData.clinicId) {
            const clinicData = await getClinicById(doctorData.clinicId);
            setClinic(clinicData ?? null);
        }
      }
      setIsLoading(false);
    };
    fetchDoctorInfo();
  }, [id]);

  const handleBookAppointment = (type: 'clinic' | 'video') => {
    if (type === 'video') {
      router.push('/coming-soon');
      return;
    }
    
    if (type === 'clinic' && !selectedSlot) {
      toast({
          title: "Select a time slot",
          description: "Please choose an available time slot to proceed.",
          variant: "destructive"
      });
      return;
    }

    if (user && doctor) {
        const queryParams = new URLSearchParams({
            doctorId: doctor.uid,
            type: type
        });
        if (selectedSlot) {
            queryParams.set('slot', selectedSlot);
        }
        if(doctor.clinicId) {
            queryParams.set('clinicId', doctor.clinicId);
        }
        router.push(`/payment?${queryParams.toString()}`);
    } else {
        toast({
            title: "Login Required",
            description: "Please log in to book an appointment.",
        });
        router.push('/login');
    }
  }

  if (isLoading || isAuthLoading) {
    return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
  }

  if (!doctor) {
    return <div className="text-center py-12">Doctor not found.</div>;
  }
  
  const consultationFee = doctor.consultationFee || 500;
  const platformFee = 50;
  const totalFee = consultationFee + platformFee;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Doctor Profile Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <Image
                    src={doctor.imageUrl || `https://i.pravatar.cc/150?u=${doctor.uid}`}
                    alt={doctor.name || 'Doctor profile picture'}
                    width={150}
                    height={150}
                    className="rounded-lg border-4 border-primary/20 object-cover w-32 h-32 sm:w-[150px] sm:h-[150px]"
                />
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold font-headline text-accent">{doctor.name}</h1>
                    <p className="text-lg text-primary">{doctor.specialization}</p>
                    {clinic && <Link href={`/clinics/${clinic.id}`} className="text-md text-muted-foreground hover:underline">{clinic.name}</Link>}
                    
                    <div className="mt-4 text-sm text-muted-foreground space-y-2">
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                            <GraduationCap className="h-4 w-4 shrink-0" />
                            <span>License: {doctor.licenseNo}</span>
                        </p>
                        <p className="flex items-center justify-center sm:justify-start gap-2">
                            <Briefcase className="h-4 w-4 shrink-0" />
                            <span>{doctor.phone}</span>
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>
          
        </div>

        {/* Booking Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-center font-headline text-accent">Book an Appointment</CardTitle>
              <CardDescription className="text-center">Book in just 2 clicks!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="text-3xl font-bold text-primary">₹{consultationFee}</p>
                </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-accent"><Calendar className="h-5 w-5 text-primary" /> In-Clinic Appointment</h4>
                <p className="text-sm text-muted-foreground text-center font-semibold">Select Date & Time (Today)</p>
                <div className="grid grid-cols-3 gap-2">
                    {doctor.availability && doctor.availability.length > 0 ? (
                        doctor.availability.map(slot => (
                            <Button 
                                key={slot}
                                variant={selectedSlot === slot ? 'default' : 'outline'}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {slot}
                            </Button>
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-sm text-muted-foreground">No slots available.</p>
                    )}
                </div>
              </div>

                <Button 
                onClick={() => handleBookAppointment('clinic')}
                className="w-full"
                disabled={isAuthLoading || !doctor.availability || doctor.availability.length === 0}
              >
                  Book In-Clinic Visit
              </Button>
              
              <Separator className="my-4"/>

                <div className="space-y-3 text-center">
                  <h4 className="font-semibold flex items-center justify-center gap-2 text-accent"><Video className="h-5 w-5 text-primary" /> Video Consultation</h4>
                  <p className="text-sm text-muted-foreground">Consult from the comfort of your home.</p>
                  <Button 
                    onClick={() => handleBookAppointment('video')}
                    className="w-full" 
                    variant="outline"
                >
                    Request Video Consultation
                </Button>
                </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span>₹{consultationFee.toFixed(2)}</span>
                </div>
                  <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-foreground">Total Payable:</span>
                  <span className="text-primary">₹{totalFee.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
