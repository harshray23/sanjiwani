
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
import { Loader2, LogIn, Mail, KeyRound, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { actionCodeSettings } from "@/lib/firebase";

const passwordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'passwordless'>('password');
  const [isSignUp, setIsSignUp] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
      resolver: zodResolver(emailFormSchema),
      defaultValues: { email: ""},
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
            break;
    }

    toast({ title, description, variant: "destructive" });
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true);
    
    try {
        if (isSignUp) {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            toast({
                title: "Account Created!",
                description: "You have been successfully signed up and logged in.",
            });
        } else {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast({ title: "Login Successful!", description: "Welcome back!" });
        }
        router.push('/');
    } catch (error) {
       handleAuthError(error as AuthError);
    } finally {
        setIsLoading(false);
    }
  }

  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
      setIsLoading(true);
      try {
          await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
          // Save the email locally to use when the user returns.
          window.localStorage.setItem('emailForSignIn', values.email);
          toast({
              title: "Check your email",
              description: `A sign-in link has been sent to ${values.email}.`,
          });
          emailForm.reset();
      } catch (error) {
          handleAuthError(error as AuthError);
      } finally {
          setIsLoading(false);
      }
  }
  
  const renderPasswordForm = () => (
     <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
            <FormField
            control={passwordForm.control}
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
            control={passwordForm.control}
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
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isSignUp ? 'Sign Up' : 'Login'}
            </Button>
             <div className="mt-6 text-center text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => {setIsSignUp(!isSignUp); passwordForm.reset();}}>
                    {isSignUp ? "Log in here" : "Sign up here"}
                </Button>
            </div>
             <div className="mt-2 text-center text-sm">
                or{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => setAuthMode('passwordless')}>
                    Sign in with Email Link
                </Button>
            </div>
        </form>
    </Form>
  );

  const renderEmailForm = () => (
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
            <FormField
            control={emailForm.control}
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Login Link'}
            </Button>
            <div className="mt-6 text-center text-sm">
                <Button variant="link" className="p-0 h-auto" onClick={() => setAuthMode('password')}>
                   Back to password login
                </Button>
            </div>
        </form>
    </Form>
  )

  const titles = {
      password: {
          login: "Welcome Back!",
          signup: "Create an Account"
      },
      passwordless: "Passwordless Sign-In"
  }
  const descriptions = {
      password: {
          login: "Log in to manage your appointments.",
          signup: "Enter your details to create a new account."
      },
      passwordless: "Enter your email to receive a secure sign-in link."
  }

  return (
    <div className="py-12">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            {authMode === 'password' ? <LogIn className="h-10 w-10 text-primary" /> : <LinkIcon className="h-10 w-10 text-primary" />}
          </div>
          <CardTitle className="text-3xl font-headline">
              {authMode === 'password' ? (isSignUp ? titles.password.signup : titles.password.login) : titles.passwordless}
          </CardTitle>
          <CardDescription>
             {authMode === 'password' ? (isSignUp ? descriptions.password.signup : descriptions.password.login) : descriptions.passwordless}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {authMode === 'password' ? renderPasswordForm() : renderEmailForm()}
        </CardContent>
      </Card>
    </div>
  );
}

    