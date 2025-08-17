
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
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

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

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) must be
    // in the Firebase Console's Authorized Domains list.
    url: `${window.location.origin}/auth/callback`,
    // This must be true.
    handleCodeInApp: true,
  };

  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    setEmail(values.email);
    try {
      await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', values.email);
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: `A sign-in link has been sent to ${values.email}.`,
      });
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      toast({
        title: "Error Sending Link",
        description: error.message,
        variant: "destructive",
      });
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
