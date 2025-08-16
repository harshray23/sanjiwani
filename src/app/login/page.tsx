
"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Phone, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

const loginFormSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  otp: z.string().min(6, { message: "OTP must be 6 digits." }).optional(),
});

// This type is needed to augment the window object
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
      otp: "",
    },
  });
  
  // Set up reCAPTCHA on component mount
  const setupRecaptcha = () => {
    if (!auth) {
        console.error("Firebase auth is not initialized.");
        return;
    }
     // Ensure the container is empty before rendering
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
        recaptchaContainer.innerHTML = "";
    } else {
        const container = document.createElement('div');
        container.id = 'recaptcha-container';
        document.body.appendChild(container);
    }
    
    try {
        // Set language for reCAPTCHA and SMS message
        auth.useDeviceLanguage();
        
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log("reCAPTCHA verified");
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log("reCAPTCHA expired, please try again.");
            toast({
                title: "reCAPTCHA Expired",
                description: "Please try sending the OTP again.",
                variant: "destructive"
            })
          }
        });
        // Render the reCAPTCHA
        window.recaptchaVerifier.render();

      } catch (error) {
        console.error("reCAPTCHA rendering error:", error);
         toast({
            title: "reCAPTCHA Error",
            description: "Could not initialize reCAPTCHA. Please refresh and try again.",
            variant: "destructive"
        });
      }
  }

  useEffect(() => {
    // This effect should only run once on the client
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      setupRecaptcha();
    }
  }, []);


  const handleSendOtp = async () => {
    const phoneValid = await form.trigger("phone");
    if (!phoneValid) return;

    setIsLoading(true);
    const phoneNumber = "+91" + form.getValues("phone");
    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
        setIsLoading(false);
        toast({
            title: "reCAPTCHA Error",
            description: "reCAPTCHA is not ready. Please refresh the page.",
            variant: "destructive"
        });
        return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsLoading(false);
      setIsOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: `An OTP has been sent to ${phoneNumber}.`,
      });
    } catch (error: any) {
       setIsLoading(false);
       console.error("Error sending OTP: ", error);
       // Reset reCAPTCHA if it fails
       window.recaptchaVerifier?.clear();
       setupRecaptcha(); // Re-initialize
       toast({
        title: "Error Sending OTP",
        description: error.message || "Could not send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (!values.otp) {
        form.setError("otp", { type: "manual", message: "Please enter the OTP."});
        return;
    }
    setIsLoading(true);
    
    try {
      const result = await window.confirmationResult?.confirm(values.otp);
      if (result?.user) {
        setIsLoading(false);
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
          variant: "default",
        });
        router.push('/');
      } else {
        throw new Error("User data not found after confirmation.");
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error verifying OTP: ", error);
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
       form.setError("otp", { type: "manual", message: "Invalid OTP." });
    }
  }

  return (
    <div className="py-12">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Login</CardTitle>
          <CardDescription>Enter your phone number to receive a login OTP.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <div className="flex items-center">
                           <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground">
                            +91
                           </span>
                           <Input 
                             type="tel" 
                             placeholder="9876543210" 
                             {...field} 
                             className="rounded-l-none"
                             disabled={isOtpSent}
                           />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isOtpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password (OTP)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter 6-digit OTP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            
              {!isOtpSent ? (
                 <Button type="button" onClick={handleSendOtp} className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Phone className="mr-2 h-4 w-4" />
                    )}
                    Send OTP
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    Login with OTP
                </Button>
              )}
               {isOtpSent && (
                  <Button variant="link" size="sm" className="w-full" onClick={() => {setIsOtpSent(false); form.reset();}}>
                    Use a different number?
                  </Button>
               )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
