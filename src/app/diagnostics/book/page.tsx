
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
import { Loader2, CreditCard, QrCode, ShieldCheck, Microscope } from "lucide-react";
import Lottie from "lottie-react";
import { getDiagnosticsCentreById, getTestById, createTestAppointment } from '@/lib/data';
import type { DiagnosticsCentre, DiagnosticTest, User } from '@/lib/types';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

const cardFormSchema = z.object({
  cardNumber: z.string().regex(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/, "Invalid card number"),
  cardName: z.string().min(2, "Name on card is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^[0-9]{3,4}$/, "Invalid CVV"),
});

function TestPaymentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [user, setUser] = useState<User | null>(null);
  const [centre, setCentre] = useState<DiagnosticsCentre | null>(null);
  const [test, setTest] = useState<DiagnosticTest | null>(null);
  const [comingSoonAnimation, setComingSoonAnimation] = useState(null);
  
  const centreId = searchParams.get('centreId');
  const testId = searchParams.get('testId');
  
  const totalFee = test?.price || 0;

  useEffect(() => {
    fetch('/Coming.json')
      .then(response => response.json())
      .then(data => setComingSoonAnimation(data))
      .catch(error => console.error("Error fetching animation:", error));

    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    } else {
        toast({ title: "Login Required", description: "Please log in to book a test.", variant: "default" });
        router.push('/login');
        return;
    }

    const fetchData = async () => {
      if (!centreId || !testId) {
        toast({ title: "Missing Information", description: "Centre or Test ID not provided.", variant: "destructive" });
        router.push('/diagnostics');
        return;
      }
      setIsDataLoading(true);
      const [centreData, testData] = await Promise.all([
          getDiagnosticsCentreById(centreId),
          getTestById(testId)
      ]);
      
      if (centreData) setCentre(centreData);
      else toast({ title: "Centre Not Found", variant: "destructive" });
      
      if (testData) setTest(testData);
      else toast({ title: "Test Not Found", variant: "destructive" });

      if (!centreData || !testData) router.push('/diagnostics');

      setIsDataLoading(false);
    }
    fetchData();
  }, [centreId, testId, router, toast]);

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { cardNumber: "", cardName: "", expiryDate: "", cvv: "" },
  });

  const handlePayment = async () => {
    if (!user || !centreId || !testId) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment gateway
      
      const appointment = await createTestAppointment(user.uid, centreId, testId);
      
      toast({
        title: "Payment Successful!",
        description: "Your test has been booked.",
        variant: "default",
      });
      
      router.push(`/diagnostics/confirmed?id=${appointment.id}`);

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

  if (isDataLoading) {
    return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
  }
  
  if (!centre || !test) {
      return (
          <div className="text-center py-12">
              <CardTitle>Error</CardTitle>
              <CardDescription>Could not load booking details. Please go back and try again.</CardDescription>
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
          <CardTitle className="text-3xl font-headline text-accent">Book Diagnostic Test</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Securely pay to confirm your test appointment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold font-headline text-accent">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Centre:</span>
                  <span className="font-medium">{centre?.name}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Test:</span>
                  <span className="font-medium flex items-center gap-2">
                    <Microscope className="h-4 w-4"/>
                    {test?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{test?.category}</span>
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
              <Tabs defaultValue="card">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upi"><QrCode className="mr-2 h-4 w-4"/> UPI / QR</TabsTrigger>
                  <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/> Card</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upi" className="pt-4">
                  <div className="flex flex-col items-center text-center">
                    {comingSoonAnimation ? (
                      <Lottie animationData={comingSoonAnimation} loop={true} className="w-48 h-48" />
                    ): <p>Loading animation...</p>}
                    <h3 className="font-semibold text-lg mt-2 font-headline">Coming Soon!</h3>
                    <p className="text-sm text-muted-foreground">
                      UPI and QR Code payments will be available shortly.
                    </p>
                  </div>
                </TabsContent>

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


export default function DiagnosticsBookingPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>}>
            <TestPaymentForm />
        </Suspense>
    )
}

    

    