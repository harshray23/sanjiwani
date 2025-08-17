
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
import { Loader2, LogIn, Mail, KeyRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthError = (error: AuthError) => {
    console.error("Firebase Auth Error:", error);
    let title = "An error occurred";
    let description = error.message;

    switch (error.code) {
        case 'auth/invalid-email':
            title = 'Invalid Email';
            description = 'Please enter a valid email address.';
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
             title = 'Login Failed';
             description = 'The email or password you entered is incorrect.';
             break;
        case 'auth/email-already-in-use':
            title = 'Sign Up Failed';
            description = 'An account with this email address already exists.';
            break;
        case 'auth/weak-password':
            title = 'Weak Password';
            description = 'The password must be at least 6 characters long.';
            break;
        default:
            // Keep generic error for other cases
            break;
    }

    toast({ title, description, variant: "destructive" });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (!auth) {
        setIsLoading(false);
        toast({ title: "Authentication Error", description: "Firebase is not configured. Please contact support.", variant: "destructive"});
        return;
    }
    
    try {
        if (isSignUp) {
            // Handle Sign Up
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            toast({
                title: "Account Created!",
                description: "You have been successfully signed up and logged in.",
                variant: "default",
            });
        } else {
            // Handle Login
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast({
                title: "Login Successful!",
                description: "Welcome back!",
                variant: "default",
            });
        }
        router.push('/');
    } catch (error) {
       handleAuthError(error as AuthError);
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
          <CardTitle className="text-3xl font-headline">{isSignUp ? 'Create an Account' : 'Welcome Back!'}</CardTitle>
          <CardDescription>{isSignUp ? 'Enter your details to create a new account.' : 'Log in to manage your appointments.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  isSignUp ? 'Sign Up' : 'Login'
                )}
              </Button>
            </form>
          </Form>
           <div className="mt-6 text-center text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => {setIsSignUp(!isSignUp); form.reset();}}>
                    {isSignUp ? "Log in here" : "Sign up here"}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
