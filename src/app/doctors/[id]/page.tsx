
"use client";

import { useEffect, useState } from 'react';
import { getDoctorById, getClinicById } from '@/lib/mock-data';
import type { Doctor, Clinic } from '@/lib/types';
import Image from 'next/image';
import { Loader2, Star, Briefcase, GraduationCap, Calendar, Clock, Sparkles, IndianRupee, Medal, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDoctorInfo = async () => {
      setIsLoading(true);
      const doctorData = await getDoctorById(id);
      if (doctorData) {
        setDoctor(doctorData);
        const clinicData = await getClinicById(doctorData.clinicId);
        if (clinicData) {
          setClinic(clinicData);
        }
      }
      setIsLoading(false);
    };
    fetchDoctorInfo();
  }, [id]);

  const handleBookAppointment = (type: 'clinic' | 'video') => {
    if (!selectedSlot && type === 'clinic') {
        toast({
            title: "Select a time slot",
            description: "Please choose an available time slot to proceed.",
            variant: "destructive"
        });
        return;
    }

    if (user) {
        const queryParams = new URLSearchParams({
            doctorId: doctor!.id,
            type: type
        });
        if (selectedSlot) {
            queryParams.set('slot', selectedSlot);
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
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!doctor) {
    return <div className="text-center py-12">Doctor not found.</div>;
  }
  
  const platformFee = 50;
  const totalFee = doctor.consultationFee + platformFee;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Doctor Profile Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                <Image
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    width={150}
                    height={150}
                    className="rounded-lg border-4 border-primary/20 object-cover"
                    data-ai-hint={doctor.dataAiHint}
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold font-headline">{doctor.name}</h1>
                    <p className="text-lg text-primary">{doctor.specialty}</p>
                    {clinic && <Link href={`/clinics/${clinic.id}`} className="text-md text-muted-foreground hover:underline">{clinic.name}</Link>}
                    
                    <div className="flex items-center gap-4 mt-2">
                        <Badge variant="default" className="flex items-center gap-1 text-base p-2">
                            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300"/> {doctor.rating}
                        </Badge>
                        <span className="text-sm text-muted-foreground">({doctor.reviewCount} reviews)</span>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground space-y-2">
                        <p className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 shrink-0" />
                            <span>{doctor.qualifications.join(', ')}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 shrink-0" />
                            <span>{doctor.experience} years of experience</span>
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          {/* Bio Card */}
          <Card>
            <CardHeader><CardTitle>About Dr. {doctor.name.split(' ').pop()}</CardTitle></CardHeader>
            <CardContent>
                <p className="text-foreground/80">{doctor.bio}</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-center">Book an Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="text-center">
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="text-3xl font-bold text-primary">₹{doctor.consultationFee}</p>
               </div>

                <Card className="bg-primary/5 border-primary/20 p-3">
                  <CardHeader className="p-0 text-center mb-2">
                      <CardTitle className="text-base text-primary flex items-center justify-center gap-2"><Sparkles className="w-4 h-4"/>Exclusive Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-sm text-primary/90 space-y-1 text-center">
                      <p className="flex items-center justify-center gap-1"><Medal className="w-4 h-4" /> Priority Token (No long waits)</p>
                      <p>+ 10-15% discount on medicines</p>
                  </CardContent>
                </Card>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> In-Clinic Appointment</h4>
                <p className="text-sm text-muted-foreground text-center font-semibold">Select Date & Time (Today)</p>
                <div className="grid grid-cols-3 gap-2">
                    {doctor.availableSlots.map(slot => (
                        <Button 
                            key={slot.time}
                            variant={slot.isAvailable ? (selectedSlot === slot.time ? 'default' : 'outline') : 'secondary'}
                            disabled={!slot.isAvailable}
                            onClick={() => slot.isAvailable && setSelectedSlot(slot.time)}
                        >
                            {slot.time}
                        </Button>
                    ))}
                </div>
              </div>

               <Button 
                onClick={() => handleBookAppointment('clinic')}
                className="w-full" 
                disabled={!selectedSlot || isAuthLoading}
              >
                  Book In-Clinic Visit
              </Button>
              
              <Separator className="my-4"/>

               <div className="space-y-3 text-center">
                 <h4 className="font-semibold flex items-center justify-center gap-2"><Video className="h-5 w-5 text-primary" /> Video Consultation</h4>
                 <p className="text-sm text-muted-foreground">Consult from the comfort of your home.</p>
                 <Button 
                    onClick={() => handleBookAppointment('video')}
                    className="w-full" 
                    variant="outline"
                    disabled={isAuthLoading}
                >
                    Request Video Consultation
                </Button>
               </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span>₹{doctor.consultationFee.toFixed(2)}</span>
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
