

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
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  AuthErrorCodes
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Image from "next/image";
import { createUserInFirestore, getUserProfile } from "@/lib/data";

const roleEnum = z.enum(["customer", "doctor", "clinic", "hospital", "diagnostics_centres"]);
export type Role = z.infer<typeof roleEnum>;

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const baseSignUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const customerSignUpSchema = baseSignUpSchema.extend({
    fullName: z.string().min(2, "Name is required."),
    phone: z.string().min(10, "A valid phone number is required."),
});

const doctorSignUpSchema = baseSignUpSchema.extend({
    name: z.string().min(2, "Name is required."),
    address: z.string().min(5, "Address is required."),
    phone: z.string().min(10, "A valid phone number is required."),
    qualifications: z.string().min(2, "Qualifications are required."),
});

const clinicSignUpSchema = baseSignUpSchema.extend({
    name: z.string().min(2, "Clinic name is required."),
    address: z.string().min(5, "Address is required."),
    officePhone: z.string().min(10, "A valid office phone number is required."),
    ownerPhone: z.string().min(10, "A valid owner phone number is required."),
});

const hospitalSignUpSchema = baseSignUpSchema.extend({
    name: z.string().min(2, "Hospital name is required."),
    address: z.string().min(5, "Address is required."),
    officePhone: z.string().min(10, "A valid office phone number is required."),
    ownerPhone: z.string().min(10, "A valid owner phone number is required."),
});

const diagnosticsSignUpSchema = baseSignUpSchema.extend({
    name: z.string().min(2, "Center name is required."),
    address: z.string().min(5, "Address is required."),
    officePhone: z.string().min(10, "A valid office phone number is required."),
    ownerPhone: z.string().min(10, "A valid owner phone number is required."),
});


const SignUpForm = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(baseSignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
            name: "",
            address: "",
            phone: "",
            qualifications: "",
            officePhone: "",
            ownerPhone: "",
        },
    });

    const getSignUpSchema = (role: Role | null) => {
        switch (role) {
            case 'customer': return customerSignUpSchema;
            case 'doctor': return doctorSignUpSchema;
            case 'clinic': return clinicSignUpSchema;
            case 'hospital': return hospitalSignUpSchema;
            case 'diagnostics_centres': return diagnosticsSignUpSchema;
            default: return baseSignUpSchema;
        }
    };


    const handleSignUp = async (values: any) => {
        setIsLoading(true);
        
        if (!selectedRole) {
            toast({
                title: "Sign Up Failed",
                description: "A role must be selected.",
                variant: "destructive"
            });
            setIsLoading(false);
            return;
        }
        
        const schema = getSignUpSchema(selectedRole);
        
        // **THE FIX**: Create a clean data object with only the fields relevant to the selected role.
        const relevantFields = Object.keys(schema.shape);
        const cleanValues: Record<string, any> = {};
        for (const key of relevantFields) {
            if (values[key] !== undefined) {
                cleanValues[key] = values[key];
            }
        }
        
        const validationResult = schema.safeParse(cleanValues);

        if (!validationResult.success) {
             toast({
                title: "Sign Up Failed",
                description: "Please fill all required fields correctly.",
                variant: "destructive"
            });
            // This can be enhanced to show errors on specific fields
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, validationResult.data.email, validationResult.data.password);
            
            // Save user details to Firestore
            await createUserInFirestore(userCredential.user, selectedRole, validationResult.data);

            // Sign the user out immediately after creation so they have to log in.
            await signOut(auth);

            toast({
                title: "Account Created Successfully",
                description: "Welcome! Please sign in to continue.",
            });
            form.reset();
            setSelectedRole(null);

        } catch (error: any) {
            let description = "An unknown error occurred. Please try again.";
            if (error.code === AuthErrorCodes.EMAIL_EXISTS || error.code === 'auth/email-already-in-use') {
                description = "An account with this email already exists. Please sign in instead.";
            } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
                description = "The password is too weak. Please use at least 6 characters.";
            } else if (error.code === 'auth/invalid-email') {
                description = "The email address is not valid. Please check and try again.";
            }
            toast({
                title: "Sign Up Failed",
                description: description,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedRole) {
        return (
            <div className="space-y-4 pt-4">
                <Select onValueChange={(value) => setSelectedRole(value as Role)}>
                    <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="First, select your role..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="diagnostics_centres">Diagnostics Centre</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-sm text-muted-foreground text-center">Select a role to see the required sign-up form.</p>
            </div>
        );
    }
    
    const roleTitles: Record<Role, string> = {
        customer: 'Customer',
        doctor: 'Doctor',
        clinic: 'Clinic',
        hospital: 'Hospital',
        diagnostics_centres: 'Diagnostics Centre',
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRole(null)}><ArrowLeft/></Button>
                    <h3 className="font-semibold text-lg text-foreground">Registering as a {roleTitles[selectedRole]}</h3>
                </div>
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="Choose a strong password" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                {selectedRole === 'customer' && (
                     <>
                         <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="Your contact number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}

                {selectedRole === 'doctor' && (
                    <>
                         <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Dr. John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Medical Lane" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="Your personal phone number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="qualifications" render={({ field }) => (
                            <FormItem><FormLabel>Qualifications</FormLabel><FormControl><Input placeholder="MD, MBBS, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}
                
                {(selectedRole === 'clinic' || selectedRole === 'hospital' || selectedRole === 'diagnostics_centres') && (
                     <>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>{roleTitles[selectedRole]} Name</FormLabel><FormControl><Input placeholder={`Name of your ${roleTitles[selectedRole]}`} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="Official Address" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="officePhone" render={({ field }) => (
                            <FormItem><FormLabel>Office Phone</FormLabel><FormControl><Input placeholder="Reception / Office number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                            <FormItem><FormLabel>Owner's Phone</FormLabel><FormControl><Input placeholder="Contact person's number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
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
    // If a user is already logged in when they visit this page, log them out.
    if (auth.currentUser) {
      signOut(auth).then(() => {
        toast({
          title: "You Have Been Logged Out",
          description: "Please log in again to continue.",
        });
      });
    }
  }, [toast]);

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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        toast({
          title: "Sign In Failed",
          description: "Could not find a user profile for this account. Please sign up or contact support.",
          variant: "destructive",
        });
        await signOut(auth);
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Signed In Successfully",
        description: "Welcome back! Redirecting you now...",
      });
      handleAuthSuccess(profile.role);
      
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
