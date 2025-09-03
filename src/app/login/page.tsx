
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound, UserPlus } from "lucide-react";
import { useState } from "react";
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthErrorCodes
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Image from "next/image";

const roleEnum = z.enum(["customer", "doctor", "clinic", "hospital", "diagnostics_centres", "admin"]);

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  role: roleEnum.refine(val => val !== undefined, { message: "Role is required" }),
});

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: roleEnum.refine(val => val !== undefined, { message: "Role is required" }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", role: "customer" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", role: "customer" },
  });

  const handleAuthSuccess = (role: string) => {
    switch (role) {
      case 'doctor':
        router.push('/dashboard/doctor');
        break;
      case 'clinic':
        router.push('/dashboard/clinic');
        break;
      case 'hospital':
        router.push('/dashboard/hospital');
        break;
      case 'admin':
        router.push('/dashboard/admin');
        break;
      default:
        router.push('/');
        break;
    }
  }

  async function onSignIn(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Signed In Successfully",
        description: "Welcome back! Redirecting you now...",
      });
      handleAuthSuccess(values.role);
    } catch (error: any) {
       let description = "An unknown error occurred. Please try again.";
       if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
           description = "Invalid email or password. Please check your credentials and try again.";
       }
       toast({
          title: "Sign In Failed",
          description: description,
          variant: "destructive",
       });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignUp(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Account Created Successfully",
        description: "Welcome! Please sign in to continue.",
      });
      // Redirect to signin so they can log in with their new account
      router.push('/login'); 
    } catch (error: any) {
        let description = "An unknown error occurred. Please try again.";
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
            description = "An account with this email already exists. Please sign in instead.";
        }
        toast({
          title: "Sign Up Failed",
          description: description,
          variant: "destructive",
       });
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = async () => {
    const email = signInForm.getValues("email");
    if (!email) {
      signInForm.setError("email", { type: "manual", message: "Please enter your email to reset the password." });
      return;
    }
    
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
        signInForm.setError("email", { type: "manual", message: "Please enter a valid email address." });
        return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${email}, a password reset link has been sent to it.`,
      });
    } catch (error) {
      toast({
        title: "Error Sending Reset Email",
        description: "Could not send password reset email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center p-4 bg-muted">
        <div className="w-full grid md:grid-cols-2 max-w-4xl mx-auto bg-card shadow-2xl rounded-2xl overflow-hidden">
             <div className="hidden md:flex flex-col items-center justify-center p-8 bg-accent/10 text-accent-foreground relative">
                <Image
                    src="https://picsum.photos/seed/login-art/800/1200"
                    alt="Healthcare professionals"
                    fill
                    objectFit="cover"
                    className="opacity-20"
                    data-ai-hint="doctors nurses team"
                />
                 <div className="relative z-10 text-center">
                    <Logo className="h-24 w-24 text-accent mx-auto"/>
                    <h2 className="text-3xl font-bold font-headline mt-4 text-accent">Welcome to Sanjiwani</h2>
                    <p className="mt-2 text-center text-foreground/80">Your trusted partner in health. Find doctors, book appointments, and manage your care seamlessly.</p>
                </div>
            </div>

            <div className="p-6 md:p-8">
                <Card className="border-0 shadow-none">
                    <CardHeader className="text-center p-0 mb-6">
                        <CardTitle className="text-3xl font-headline text-accent">
                            Get Started
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                    <Tabs defaultValue="signin">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin"><KeyRound className="mr-2 h-4 w-4"/> Sign In</TabsTrigger>
                        <TabsTrigger value="signup"><UserPlus className="mr-2 h-4 w-4"/> Sign Up</TabsTrigger>
                        </TabsList>
                        
                        {/* Sign In Tab */}
                        <TabsContent value="signin" className="pt-4">
                        <Form {...signInForm}>
                            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                            <FormField
                                control={signInForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={signInForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={signInForm.control}
                                name="role"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sign in as</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="clinic">Clinic</SelectItem>
                                        <SelectItem value="hospital">Hospital</SelectItem>
                                        <SelectItem value="diagnostics_centres">Diagnostics Centre</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <div className="text-center">
                                    <Button type="button" variant="link" onClick={handleForgotPassword} disabled={isLoading} className="text-sm h-auto p-0">
                                        Forgot Password?
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        </TabsContent>

                        {/* Sign Up Tab */}
                        <TabsContent value="signup" className="pt-4">
                        <Form {...signUpForm}>
                            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                            <FormField
                                control={signUpForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={signUpForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="Choose a strong password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={signUpForm.control}
                                name="role"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sign up as</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="clinic">Clinic</SelectItem>
                                        <SelectItem value="hospital">Hospital</SelectItem>
                                        <SelectItem value="diagnostics_centres">Diagnostics Centre</SelectItem>
                                         <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                            </form>
                        </Form>
                        </TabsContent>
                    </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
