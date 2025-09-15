

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
import { Loader2, KeyRound, UserPlus, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Image from "next/image";
import { createUserInFirestore, getUserProfile, mockUsers } from "@/lib/data";
import type { User } from "@/lib/types";

const roleEnum = z.enum(["patient", "doctor", "clinic", "diag_centre", "admin"]);
export type Role = z.infer<typeof roleEnum>;

const emailValidation = z.string().refine(
    (email) => email.includes('@') && email.includes('.com'),
    { message: "Please enter a valid email address containing '@' and '.com'." }
);

const signInSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, { message: "Password is required." }),
});

// Base schema for all users, goes into /users collection
const baseUserSchema = z.object({
    name: z.string().min(2, "Name is required."),
    email: emailValidation,
    phone: z.string().min(1, "A phone number is required."),
    password: z.string().min(1, { message: "Password is required." }),
});

// Schema for doctor-specific details, goes into /doctors collection
const doctorDetailsSchema = z.object({
    specialization: z.string().min(2, "Specialization is required."),
    licenseNo: z.string().min(5, "A valid license number is required."),
});

// Schema for clinic-specific details, goes into /clinics collection
const clinicDetailsSchema = z.object({
    address: z.string().min(10, "A valid address is required."),
    licenseNo: z.string().min(5, "A valid license number is required."),
});

// Schema for diagnostics center-specific details, goes into /diagnosisCentres collection
const diagCentreDetailsSchema = z.object({
    address: z.string().min(10, "A valid address is required."),
    licenseNo: z.string().min(5, "A valid license number is required."),
    servicesOffered: z.string().min(5, "Please list at least one service."),
});


const SignUpForm = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
     const router = useRouter();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            specialization: "",
            licenseNo: "",
            address: "",
            servicesOffered: "",
        },
    });

    const handleAuthSuccess = (role: string) => {
        switch (role) {
            case 'doctor': router.push('/dashboard/doctor'); break;
            case 'clinic': router.push('/dashboard/clinic'); break;
            case 'hospital': router.push('/dashboard/hospital'); break;
            case 'diagnostics_centres': router.push('/dashboard/diagnostics'); break;
            case 'admin': router.push('/dashboard/admin'); break;
            default: router.push('/'); break;
        }
    }

    const handleSignUp = async (values: any) => {
        setIsLoading(true);
        
        if (!selectedRole) {
            toast({ title: "Sign Up Failed", description: "A role must be selected.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // MOCK SIGN-UP: Assume any valid-looking email/password is fine
        const newUser: User = {
            uid: `user-${Date.now()}`,
            name: values.name || 'New User',
            email: values.email,
            phone: values.phone || 'N/A',
            role: selectedRole,
            verified: true, // Auto-verify for mock purposes
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
        };

        localStorage.setItem('mockUser', JSON.stringify(newUser));
        window.dispatchEvent(new Event('authChange'));

        toast({ title: "Account Created & Signed In", description: "Welcome! Redirecting you now..." });
        handleAuthSuccess(newUser.role);

        setIsLoading(false);
    };

    if (!selectedRole) {
        return (
            <div className="space-y-4 pt-4">
                <Select onValueChange={(value) => setSelectedRole(value as Role)}>
                    <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="First, select your role..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="diag_centre">Diagnostics Centre</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-sm text-muted-foreground text-center">Select a role to see the required sign-up form.</p>
            </div>
        );
    }
    
    const roleTitles: Record<Role, string> = {
        patient: 'Patient',
        doctor: 'Doctor',
        clinic: 'Clinic',
        diag_centre: 'Diagnostics Centre',
        admin: 'Admin'
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRole(null)}><ArrowLeft/></Button>
                    <h3 className="font-semibold text-lg text-foreground">Registering as a {roleTitles[selectedRole]}</h3>
                </div>
                 <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name / Organisation Name</FormLabel><FormControl><Input placeholder="John Doe or City Hospital" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input placeholder="Your contact number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Choose any password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <hr className="my-4"/>

                {selectedRole === 'doctor' && (
                     <>
                        <FormField control={form.control} name="specialization" render={({ field }) => (
                            <FormItem><FormLabel>Specialization</FormLabel><FormControl><Input placeholder="e.g. Cardiology" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="licenseNo" render={({ field }) => (
                            <FormItem><FormLabel>Medical License Number</FormLabel><FormControl><Input placeholder="Your license number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}

                {selectedRole === 'clinic' && (
                     <>
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="Clinic's full address" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="licenseNo" render={({ field }) => (
                            <FormItem><FormLabel>Clinic License Number</FormLabel><FormControl><Input placeholder="Clinic's license number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}

                {selectedRole === 'diag_centre' && (
                     <>
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="Centre's full address" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="licenseNo" render={({ field }) => (
                            <FormItem><FormLabel>Centre License Number</FormLabel><FormControl><Input placeholder="Centre's license number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="servicesOffered" render={({ field }) => (
                            <FormItem><FormLabel>Services Offered (comma-separated)</FormLabel><FormControl><Input placeholder="Blood Test, X-Ray, MRI" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account & Sign In
                </Button>
            </form>
        </Form>
    );
};


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: ""},
  });

  useEffect(() => {
    localStorage.removeItem('mockUser');
    window.dispatchEvent(new Event('authChange')); 
  }, []);

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
       case 'diagnostics_centres':
        router.push('/dashboard/diagnostics');
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // MOCK AUTH: Check if user exists, otherwise create a temporary one.
    let user = mockUsers.find(u => u.email === values.email);
    
    if (!user) {
        // Create a temporary new user if email is not found
        user = {
            uid: `user-${Date.now()}`,
            name: 'New User',
            email: values.email,
            phone: 'N/A',
            role: 'patient',
            verified: true,
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
        };
        toast({
            title: "New User",
            description: "Creating a temporary patient session for you.",
        });
    }

    localStorage.setItem('mockUser', JSON.stringify(user));
    window.dispatchEvent(new Event('authChange'));

    toast({
        title: "Signed In Successfully",
        description: "Welcome! Redirecting you now...",
    });
    handleAuthSuccess(user.role);
  }


  const handleForgotPassword = async () => {
    const email = signInForm.getValues("email");
    if (!email) {
      signInForm.setError("email", { type: "manual", message: "Please enter your email to reset the password." });
      return;
    }
    
    const emailValidationResult = z.string().email().safeParse(email);
    if (!emailValidationResult.success) {
        signInForm.setError("email", { type: "manual", message: "Please enter a valid email address." });
        return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    toast({
      title: "Password Reset Email Sent",
      description: `If an account exists for ${email}, a password reset link has been sent to it. (This is a mock response)`,
    });
    setIsLoading(false);
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
                                    <FormControl><Input type="password" placeholder="any password" {...field} /></FormControl>
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

                        <TabsContent value="signup">
                            <SignUpForm />
                        </TabsContent>
                    </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

    