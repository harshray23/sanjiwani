
"use client";

import { Suspense, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, BadgePercent, Upload, Video } from "lucide-react";
import Lottie from "lottie-react";
import { getDoctorById } from '@/lib/data';
import type { DoctorProfile, User } from '@/lib/types';
import { createAppointment } from '@/lib/data';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

// Define a type for the Razorpay window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  
  const doctorId = searchParams.get('doctorId');
  const clinicId = searchParams.get('clinicId');
  const selectedSlot = searchParams.get('slot');
  const consultationType = (searchParams.get('type') || 'clinic') as 'clinic' | 'video';
  
  const consultationFee = doctor?.consultationFee || 500;
  const platformFee = 0;
  const totalFee = consultationFee + platformFee;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    } else {
        toast({ title: "Login Required", description: "Please log in to book an appointment.", variant: "default" });
        router.push('/login');
        return;
    }

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

 const makePayment = async () => {
    if (!user || !doctor) {
      toast({ title: "Error", description: "User or Doctor details missing." });
      return;
    }
    setIsLoading(true);

    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: totalFee }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to create order:", error);
      toast({
        title: "Payment Error",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { orderId, keyId } = await res.json();

    const options = {
      key: keyId,
      amount: totalFee * 100, // Amount in paise
      currency: "INR",
      name: "Sanjiwani Health",
      description: `Appointment with Dr. ${doctor.name}`,
      image: "/logo.jpg", 
      order_id: orderId,
      handler: async function (response: any) {
        
        // Verify payment on the backend
        const verificationRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
            }),
        });

        const verificationData = await verificationRes.json();

        if (verificationData.status === 'success') {
             try {
              const appointment = await createAppointment(
                user.uid,
                doctor.uid,
                clinicId!,
                slot!,
                consultationType
              );

              toast({
                title: "Payment Successful & Verified!",
                description: "Your appointment has been booked.",
                variant: "default",
              });

              router.push(`/appointments/confirmed?id=${appointment.id}`);
            } catch (error) {
              console.error("Booking Error:", error);
              toast({
                title: "Booking Failed",
                description: "We could not complete your booking after payment. Please contact support.",
                variant: "destructive",
              });
              setIsLoading(false);
            }
        } else {
            toast({
                title: "Payment Verification Failed",
                description: "Your payment could not be verified. Please contact support.",
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
      notes: {
        address: "Sanjiwani Health Corporate Office",
      },
      theme: {
        color: "#f97316", // Orange color
      },
    };

    const razor = new window.Razorpay(options);
    razor.on('payment.failed', function (response: any){
            toast({
                title: "Payment Failed or Cancelled",
                description: response.error.description || "You can try again.",
                variant: "destructive",
            });
            setIsLoading(false);
    });
    razor.open();
  };

  if (isDataLoading) {
    return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
  }

  return (
    <div className="py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-accent">Complete Your Payment</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Securely pay to confirm your appointment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold font-headline text-accent">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">Dr. {doctor?.name}</span>
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
                  <span className="font-medium">₹{consultationFee.toFixed(2)}</span>
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
                 <span>Get up to ₹{consultationType === 'video' ? 40 : 25} cashback!</span>
              </div>
               <p className="text-xs text-muted-foreground text-center">
                    <Upload className="inline-block h-3 w-3 mr-1"/>
                    Upload a valid doctor's prescription post-consultation to receive your cashback.
                </p>
            </div>

            {/* Payment Options */}
            <div className="flex flex-col justify-center items-center p-6">
               <h3 className="text-lg font-bold font-headline text-accent mb-4">Proceed to Payment</h3>
               <p className="text-muted-foreground text-center mb-6">You will be redirected to Razorpay's secure payment gateway to complete your transaction.</p>
                <Button onClick={makePayment} disabled={isLoading} className="w-full h-12 text-lg">
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


export default function PaymentPage() {
    return (
      <>
        <Head>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </Head>
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>}>
            <PaymentForm />
        </Suspense>
      </>
    )
}
