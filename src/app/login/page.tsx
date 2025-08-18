
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
import { Loader2, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';
import { sendSignInLinkToEmail } from "firebase/auth";

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    setEmail(values.email);

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.error("Firebase Project ID is not defined in environment variables.");
      toast({
        title: "Configuration Error",
        description: "The application is not configured correctly to send emails.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const actionCodeSettings = {
      url: `https://${projectId}.web.app/auth/callback`,
      handleCodeInApp: true,
    };
    
    try {
      await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', values.email);
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: `A sign-in link has been sent to ${values.email}.`,
      });
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      if (error.code === 'auth/quota-exceeded') {
         toast({
            title: "Daily Limit Exceeded",
            description: "We've sent too many emails today. Please try again tomorrow.",
            variant: "destructive",
         });
      } else {
         toast({
            title: "Error Sending Link",
            description: "Could not send sign-in link. Please try again later.",
            variant: "destructive",
         });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-12">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
              {emailSent ? "Check Your Inbox" : "Login or Sign Up"}
          </CardTitle>
          <CardDescription>
             {emailSent 
                ? `We sent a magic sign-in link to ${email}. Click the link to continue.` 
                : "Enter your email to receive a secure sign-in link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {!emailSent ? (
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="your@email.com" {...field} className="pl-10" />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Sign-in Link'}
                        </Button>
                    </form>
                </Form>
            ) : (
                <div className="text-center">
                    <p className="text-muted-foreground">Waiting for you to click the link...</p>
                    <Button variant="link" className="mt-4" onClick={() => setEmailSent(false)}>
                        Use a different email
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
