
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
import { Loader2, CreditCard, QrCode, ShieldCheck } from "lucide-react";
import Image from 'next/image';
import { getDoctorById } from '@/lib/mock-data';
import type { Doctor } from '@/lib/types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createAppointment } from '@/lib/mock-data';

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
  
  const platformFee = 50;
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
      if (!doctorId || !selectedSlot) {
        toast({ title: "Missing Information", description: "Doctor ID or slot not provided.", variant: "destructive" });
        router.push('/');
        return;
      }
      setIsDataLoading(true);
      const doctorData = await getDoctorById(doctorId);
      if (doctorData) {
        setDoctor(doctorData);
        setSlot(selectedSlot);
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
    if (!user || !doctorId || !slot) return;

    setIsLoading(true);
    
    // In a real app, this would talk to a payment gateway.
    // Here we simulate the process and then create the appointment.
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // On successful payment, create the appointment
      const appointment = await createAppointment(user.uid, user.displayName || "Anonymous User", doctorId, slot);
      
      toast({
        title: "Payment Successful!",
        description: "Your appointment has been booked.",
        variant: "default",
      });
      
      // Redirect to the confirmation page
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

  if (isAuthLoading || isDataLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
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
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{doctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium">{slot || 'Not Selected'}</span>
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
            </div>

            {/* Payment Options */}
            <div>
              <Tabs defaultValue="upi">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upi"><QrCode className="mr-2 h-4 w-4"/> UPI / QR Code</TabsTrigger>
                  <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/> Credit/Debit Card</TabsTrigger>
                </TabsList>
                
                {/* UPI Tab */}
                <TabsContent value="upi" className="pt-4">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-4">Scan the QR code with any UPI app</p>
                    <Image src="https://placehold.co/200x200.png" alt="UPI QR Code" width={200} height={200} data-ai-hint="qr code" />
                     <div className="w-full my-4 flex items-center text-xs text-muted-foreground">
                        <div className="flex-grow border-t"></div>
                        <span className="flex-shrink mx-4">OR</span>
                        <div className="flex-grow border-t"></div>
                      </div>
                    <Form {...upiForm}>
                      <form onSubmit={upiForm.handleSubmit(handlePayment)} className="w-full space-y-4">
                        <FormField
                          control={upiForm.control}
                          name="upiId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter UPI ID</FormLabel>
                              <FormControl>
                                <Input placeholder="yourname@bank" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Pay with UPI
                        </Button>
                      </form>
                    </Form>
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
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <PaymentForm />
        </Suspense>
    )
}
