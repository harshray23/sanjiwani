
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';


const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function FinishLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'requiresEmail' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('An unknown error occurred.');

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const finishSignIn = async (email: string) => {
      setStatus('loading');
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        setStatus('success');
        toast({ title: 'Successfully Signed In!', description: 'Welcome to Sanjiwani Health.' });
        router.push('/');
      } catch (error: any) {
        console.error("Sign in error:", error);
        setStatus('error');
        if(error.code === 'auth/invalid-action-code') {
             setErrorMessage('The sign-in link is invalid or has expired. Please try again.');
        } else {
             setErrorMessage('Could not complete sign-in. Please try sending a new link.');
        }
      }
  };

  useEffect(() => {
    if (!auth) return;
    
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the email again.
        setStatus('requiresEmail');
        // Try to pre-fill from query params if available (e.g. from some email clients)
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromParam = urlParams.get('email');
        if (emailFromParam) {
            form.setValue('email', emailFromParam);
        }
      } else {
        finishSignIn(email);
      }
    } else {
        setStatus('error');
        setErrorMessage("This is not a valid sign-in link.");
    }
  }, [auth]);

  const onEmailSubmit = (values: z.infer<typeof emailFormSchema>) => {
    finishSignIn(values.email);
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Finalizing your sign-in...</p>
          </div>
        );
      case 'requiresEmail':
        return (
            <>
                <CardHeader className="text-center">
                    <CardTitle>Confirm Your Email</CardTitle>
                    <CardDescription>To complete sign-in, please provide your email address again.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
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
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </>
        );
      case 'error':
        return (
          <div className="text-center p-8">
            <CardTitle className="text-2xl text-destructive">Sign-In Failed</CardTitle>
            <CardDescription className="mt-2">{errorMessage}</CardDescription>
            <Button asChild className="mt-6">
              <a href="/login">Back to Login</a>
            </Button>
          </div>
        );
        case 'success':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Success! Redirecting...</p>
          </div>
        );
      default:
        return null;
    }
  }


  return (
    <div className="py-12">
        <Card className="w-full max-w-md mx-auto shadow-xl">
            {renderContent()}
        </Card>
    </div>
  );
}

    