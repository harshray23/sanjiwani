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
import { useUser } from "@/firebase";
import { mockUsers } from "@/lib/data";
import type { User } from "@/lib/types";

const roleEnum = z.enum(["patient", "doctor", "clinic", "hospital", "diagnostics_centres", "admin"]);
export type Role = z.infer<typeof roleEnum>;

const emailValidation = z.string().refine(
    (email) => email.includes('@') && email.includes('.com'),
    { message: "Please enter a valid email address containing '@' and '.com'." }
);

const signInSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, { message: "Password is required." }),
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
        const newUser: User = {
            uid: `user-${Date.now()}`,
            name: values.name || 'New User',
            email: values.email,
            phone: values.phone || 'N/A',
            role: selectedRole,
            verified: true,
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
        };

        localStorage.setItem('mockUser', JSON.stringify(newUser));
        window.dispatchEvent(new Event('authChange'));
        toast({ title: "Account Created (Mock)", description: "Welcome! Redirecting..." });
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
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="diagnostics_centres">Diagnostics Centre</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRole(null)}><ArrowLeft/></Button>
                    <h3 className="font-semibold text-lg">Registering as a {selectedRole}</h3>
                </div>
                 <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Mock Account
                </Button>
            </form>
        </Form>
    );
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { loginWithGoogle, user: firebaseUser } = useUser();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: ""},
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({ title: "Signed In Successfully", description: "Welcome to Sanjiwani!" });
      router.push('/');
    } catch (error: any) {
      console.error("Google Login Error:", error);
      let description = error.message;
      if (error.code === 'auth/unauthorized-domain') {
        description = "This domain is not authorized in Firebase. Please add it to 'Authorized domains' in the Firebase Console (Authentication > Settings).";
      }
      toast({ title: "Login Failed", description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSignIn(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    let user = mockUsers.find(u => u.email === values.email);
    if (!user) {
        user = {
            uid: `user-${Date.now()}`,
            name: 'New User',
            email: values.email,
            phone: 'N/A',
            role: 'patient',
            verified: true,
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
        };
    }
    localStorage.setItem('mockUser', JSON.stringify(user));
    window.dispatchEvent(new Event('authChange'));
    toast({ title: "Signed In (Mock)", description: "Welcome!" });
    handleAuthSuccess(user.role);
    setIsLoading(false);
  }

  return (
    <div className="w-full flex-grow flex items-center justify-center p-4 bg-muted">
        <div className="w-full grid md:grid-cols-2 max-w-4xl mx-auto bg-card shadow-2xl rounded-2xl overflow-hidden">
             <div className="hidden md:flex flex-col items-center justify-center p-8 bg-accent/10 text-accent-foreground relative">
                <Image src="https://picsum.photos/seed/login-art/800/1200" alt="Healthcare" fill objectFit="cover" className="opacity-20"/>
                 <div className="relative z-10 text-center">
                    <Logo className="text-6xl text-accent mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold font-headline mt-4 text-accent">Welcome to Sanjiwani</h2>
                    <p className="mt-2 text-foreground/80">Your trusted partner in health verification.</p>
                </div>
            </div>

            <div className="p-6 md:p-8">
                <Card className="border-0 shadow-none">
                    <CardHeader className="text-center p-0 mb-6">
                        <CardTitle className="text-3xl font-headline text-accent">Get Started</CardTitle>
                        <CardDescription>Sign in to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                    <Button variant="outline" className="w-full h-12" onClick={handleGoogleLogin} disabled={isLoading}>
                        <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} height={20} className="mr-2"/>
                        Continue with Google
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                    </div>

                    <Tabs defaultValue="signin">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="signin" className="pt-4">
                        <Form {...signInForm}>
                            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                            <FormField control={signInForm.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={signInForm.control} name="password" render={({ field }) => (
                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="password" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In (Mock)
                            </Button>
                            </form>
                        </Form>
                        </TabsContent>
                        <TabsContent value="signup"><SignUpForm /></TabsContent>
                    </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
