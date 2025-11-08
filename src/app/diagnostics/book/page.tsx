
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Microscope } from "lucide-react";
import Lottie from "lottie-react";
import { getDiagnosticsCentreById, getTestById, createTestAppointment } from '@/lib/data';
import type { DiagnosticsCentre, DiagnosticTest, User } from '@/lib/types';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function handlePayment(
  totalFee: number, 
  user: User, 
  centre: DiagnosticsCentre, 
  test: DiagnosticTest, 
  toast: ReturnType<typeof useToast>['toast'], 
  router: ReturnType<typeof useRouter>,
  setIsLoading: (isLoading: boolean) => void
) {
  try {
    const { data: order } = await axios.post('/api/razorpay', { amount: totalFee });

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Sanjiwani Health",
      description: `Test booking for ${test.name} at ${centre.name}`,
      order_id: order.orderId,
      handler: async function (response: any) {
        const { data } = await axios.post('/api/razorpay/verify', {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (data.status === 'success') {
          const appointment = await createTestAppointment(user.uid, centre.id, test.id);
          toast({
            title: "Payment Successful!",
            description: "Your test has been booked.",
          });
          router.push(`/diagnostics/confirmed?id=${appointment.id}`);
        } else {
          toast({
            title: "Payment Verification Failed",
            description: "Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: "#f97316",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
        toast({
            title: "Payment Failed or Cancelled",
            description: response.error.description || "You can try again.",
            variant: "destructive",
        });
        setIsLoading(false);
    });
    rzp1.open();
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to initiate payment.",
      variant: "destructive",
    });
    setIsLoading(false);
  }
}

function TestPaymentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [user, setUser] = useState<User | null>(null);
  const [centre, setCentre] = useState<DiagnosticsCentre | null>(null);
  const [test, setTest] = useState<DiagnosticTest | null>(null);
  
  const centreId = searchParams.get('centreId');
  const testId = searchParams.get('testId');
  
  const totalFee = test?.price || 0;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

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
  
  const onPay = async () => {
      if(user && centre && test) {
        setIsLoading(true);
        await handlePayment(totalFee, user, centre, test, toast, router, setIsLoading);
      } else {
        toast({ title: "Booking details incomplete", variant: "destructive"})
      }
  }


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
            <div className="flex flex-col justify-center items-center p-6">
               <h3 className="text-lg font-bold font-headline text-accent mb-4">Proceed to Payment</h3>
               <p className="text-muted-foreground text-center mb-6">You will be redirected to Razorpay's secure payment gateway to complete your transaction.</p>
                <Button onClick={onPay} disabled={isLoading} className="w-full h-12 text-lg">
                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : null}
                    Pay ₹{totalFee.toFixed(2)} Now
                </Button>
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
