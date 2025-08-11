
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  // In a real app, you'd fetch details based on these params
  const doctorId = searchParams.get('doctorId');
  const slot = searchParams.get('slot');

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { cardNumber: "", cardName: "", expiryDate: "", cvv: "" },
  });

  const upiForm = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: { upiId: "" },
  });

  const handlePayment = async (paymentMethod: "card" | "upi", values: any) => {
    setIsLoading(true);
    console.log(`Processing ${paymentMethod} payment with values:`, values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast({
      title: "Payment Successful!",
      description: "Your appointment has been booked. You will receive a token shortly.",
      variant: "default",
    });
    // Redirect to appointments page or confirmation page
    window.location.href = '/appointments';
  };

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
                  <span className="font-medium">Dr. Emily Carter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium">{slot || 'Not Selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span className="font-medium">₹500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span className="font-medium">₹50.00</span>
                </div>
                <div className="border-t border-dashed my-2"></div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total Payable:</span>
                  <span className="text-primary">₹550.00</span>
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
                      <form onSubmit={upiForm.handleSubmit((values) => handlePayment("upi", values))} className="w-full space-y-4">
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
                    <form onSubmit={cardForm.handleSubmit((values) => handlePayment("card", values))} className="space-y-4">
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
                         Pay ₹550.00
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
