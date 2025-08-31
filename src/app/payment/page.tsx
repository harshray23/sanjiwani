
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, QrCode, ShieldCheck, BadgePercent, Upload, Video } from "lucide-react";
import Lottie from "lottie-react";
import { getDoctorById } from '@/lib/mock-data';
import type { Doctor } from '@/lib/types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createAppointment, createVideoConsultationAppointment } from '@/lib/mock-data';
import { createVideoConsultation } from '@/ai/flows/create-video-consult-flow';
import comingSoonAnimation from '@/assets/animations/coming_soon.json';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import Link from 'next/link';

const cardFormSchema = z.object({
  cardNumber: z.string().regex(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/, "Invalid card number"),
  cardName: z.string().min(2, "Name on card is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^[0-9]{3,4}$/, "Invalid CVV"),
});

const upiFormSchema = z.object({
  upiId: z.string().regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID"),
});

function PaymentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  
  const doctorId = searchParams.get('doctorId');
  const selectedSlot = searchParams.get('slot');
  const consultationType = searchParams.get('type') || 'clinic';
  
  const platformFee = consultationType === 'video' ? 100 : 50;
  const totalFee = (doctor?.consultationFee ?? 0) + platformFee;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (!currentUser) {
         router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        toast({ title: "Missing Information", description: "Doctor ID not provided.", variant: "destructive" });
        router.push('/');
        return;
      }
      setIsDataLoading(true);
      const doctorData = await getDoctorById(doctorId);
      if (doctorData) {
        setDoctor(doctorData);
        if (selectedSlot) {
            setSlot(selectedSlot);
        }
      } else {
        toast({ title: "Doctor Not Found", description: "The selected doctor could not be found.", variant: "destructive" });
        router.push('/search');
      }
      setIsDataLoading(false);
    }
    fetchDoctor();
  }, [doctorId, selectedSlot, router, toast]);

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { cardNumber: "", cardName: "", expiryDate: "", cvv: "" },
  });

  const upiForm = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: { upiId: "" },
  });

  const handlePayment = async () => {
    if (!user || !doctorId || !doctor) return;

    if (consultationType === 'clinic' && !slot) {
        toast({ title: "Booking Failed", description: "Time slot not selected for clinic visit.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment gateway
      
      let appointment;

      if (consultationType === 'video') {
        const videoConsultDetails = await createVideoConsultation({
            patientName: user.displayName || 'Anonymous User',
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty
        });
        appointment = await createVideoConsultationAppointment(user.uid, user.displayName || 'Anonymous User', doctorId, videoConsultDetails);
      } else {
        appointment = await createAppointment(user.uid, user.displayName || "Anonymous User", doctorId, slot!);
      }
      
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been booked.",
        variant: "default",
      });
      
      router.push(`/appointments/confirmed?id=${appointment.id}`);

    } catch (error) {
      console.error("Payment/Booking Error:", error);
      toast({
        title: "Booking Failed",
        description: "We could not complete your booking. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleUpiPayment = () => {
      toast({
          title: "Feature Coming Soon",
          description: "UPI/QR Code payments are not yet available. Please use a card.",
          variant: "default",
      });
  }

  const getCashbackAmount = () => {
      return consultationType === 'video' ? 40 : 25;
  }

  if (isAuthLoading || isDataLoading) {
    return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
  }

  if (consultationType === 'clinic') {
    return (
       <div className="py-12 w-full">
        <Card className="w-full max-w-lg mx-auto shadow-xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Feature Coming Soon!</CardTitle>
                <CardDescription>In-clinic payment processing is currently under development. Please check back later.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-64 h-64">
                    {comingSoonAnimation ? (
                        <Lottie animationData={comingSoonAnimation} loop={true} />
                    ) : <p>Loading animation...</p>}
                </div>
                <Button asChild className="mt-8" onClick={() => router.back()}>
                    <Link href="#">
                        Go Back
                    </Link>
                </Button>
            </CardContent>
        </Card>
        </div>
    )
  }

  return (
    <div className="py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Complete Your Payment</CardTitle>
          <CardDescription>Securely pay to confirm your appointment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{doctor?.name}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize flex items-center gap-2">
                    {consultationType === 'video' && <Video className="h-4 w-4"/>}
                    {consultationType} Consultation
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium">{slot || (consultationType === 'video' ? 'Flexible' : 'Not Selected')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span className="font-medium">₹{doctor?.consultationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span className="font-medium">₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed my-2"></div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total Payable:</span>
                  <span className="text-primary">₹{totalFee.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/20 text-primary rounded-lg p-3 text-sm font-medium flex items-center justify-center gap-2">
                 <BadgePercent className="h-5 w-5" />
                 <span>Get up to ₹{getCashbackAmount()} cashback!</span>
              </div>
               <p className="text-xs text-muted-foreground text-center">
                    <Upload className="inline-block h-3 w-3 mr-1"/>
                    Upload a valid doctor's prescription post-consultation to receive your cashback.
                </p>
            </div>

            {/* Payment Options */}
            <div>
              <Tabs defaultValue="card">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upi"><QrCode className="mr-2 h-4 w-4"/> UPI / QR Code</TabsTrigger>
                  <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/> Credit/Debit Card</TabsTrigger>
                </TabsList>
                
                {/* UPI Tab */}
                <TabsContent value="upi" className="pt-4">
                  <div className="flex flex-col items-center text-center">
                    {comingSoonAnimation ? (
                        <Lottie animationData={comingSoonAnimation} loop={true} className="w-48 h-48" />
                    ): <p>Loading animation...</p>}
                    <h3 className="font-semibold text-lg mt-2">Coming Soon!</h3>
                    <p className="text-sm text-muted-foreground">
                      UPI and QR Code payments will be available shortly.
                      Please select another payment method.
                    </p>
                  </div>
                </TabsContent>

                {/* Card Tab */}
                <TabsContent value="card" className="pt-4">
                  <Form {...cardForm}>
                    <form onSubmit={cardForm.handleSubmit(handlePayment)} className="space-y-4">
                      <FormField
                        control={cardForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={cardForm.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={cardForm.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry (MM/YY)</FormLabel>
                              <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={cardForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl><Input placeholder="123" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         Pay ₹{totalFee.toFixed(2)}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
               <p className="text-xs text-muted-foreground text-center mt-4">
                All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>}>
            <PaymentForm />
        </Suspense>
    )
}

    