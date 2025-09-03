
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

const roleEnum = z.enum(["customer", "doctor", "clinic", "hospital", "diagnostics_centres"]);

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  role: roleEnum,
});

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: roleEnum,
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSignIn(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      console.log("Signing in with values:", values);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Signed In Successfully",
        description: "Welcome back! Redirecting you now...",
      });
      router.push('/');
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
      console.log("Signing up with values:", values);
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Account Created Successfully",
        description: "Welcome! Redirecting you to the homepage...",
      });
       router.push('/');
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
    
    // Validate email format before sending
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
    <div className="py-12 w-full">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">
              Welcome
          </CardTitle>
          <CardDescription>
             Sign in to your account or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        <FormLabel>Role</FormLabel>
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
                        <FormLabel>Role</FormLabel>
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
  );
}
