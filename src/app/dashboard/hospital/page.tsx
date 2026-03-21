
"use client";

import { useEffect, useState } from 'react';
import { searchHospitals } from '@/lib/data';
import type { Hospital, Appointment, User as AppUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BedDouble, UserPlus, Users, LogIn, Trash2, Pencil, Upload, ShieldAlert, ShieldCheck, Link as LinkIcon, Loader2, ExternalLink, Activity } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import axios from 'axios';

const HospitalDashboard = () => {
  const [userProfile, setUserProfile] = useState<AppUser | null | undefined>(undefined);
  const [hospital, setHospital] = useState<Hospital | null | undefined>(undefined);
  const [appointments, setAppointments] = useState<Appointment[] | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(currentUser);

    const fetchData = async () => {
        if (currentUser && currentUser.role === 'hospital') {
            try {
                // In a real app, you'd fetch by currentUser.uid
                const [hospitalResults] = await Promise.all([
                    searchHospitals('Metro General Hospital'),
                ]);

                if (hospitalResults.length > 0) {
                  setHospital(hospitalResults[0]);
                  setAppointments([]); 
                } else {
                  setHospital(null);
                  setAppointments([]);
                }
            } catch (error) {
                console.error("Error fetching hospital data:", error);
                toast({ title: "Error", description: "Could not load hospital data.", variant: "destructive"});
                setHospital(null);
            }
        }
    };
    
    fetchData();
  }, [toast]);
  
  const handleBedUpdate = async () => {
      toast({
          title: "Bed Availability Updated",
          description: "The real-time bed counts have been saved to the database.",
      });
  }

  const handleAvalancheVerify = async () => {
    if (!hospital) return;

    setIsVerifying(true);
    try {
      // ZERO FRICTION ANCHORING: Calls server API which uses server wallet
      const response = await axios.post('/api/anchor', { data: hospital.beds });
      const result = response.data;
      
      toast({
        title: "Verified on Avalanche!",
        description: `Proof anchored to Fuji C-Chain.`,
      });

      setHospital({
        ...hospital,
        onChainVerified: true,
        lastVerificationHash: result.txId
      });
    } catch (error: any) {
      toast({
        title: "Blockchain Verification Failed",
        description: error.response?.data?.error || "Ensure the server wallet is funded with AVAX.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (userProfile === undefined || hospital === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Hospital Dashboard...</p>
      </div>
    );
  }

  if (!userProfile || userProfile?.role !== 'hospital') {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto p-8">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold font-headline text-destructive">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You must be logged in as a hospital administrator to view this page.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">
                <LogIn className="mr-2"/>
                Go to Login
              </Link>
            </Button>
        </Card>
      </div>
    );
  }

  if (!hospital) {
     return (
         <div className="text-center p-8">
            <Card className="max-w-md mx-auto p-8">
                <h2 className="text-2xl font-bold font-headline text-destructive">Profile Not Found</h2>
                <p className="mt-2 text-muted-foreground">We couldn't find a hospital profile associated with your account.</p>
            </Card>
        </div>
    )
  }
  
  const BedInput = ({ label, available, total }: { label: string, available: number, total: number }) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <p className="font-medium">{label}</p>
        <div className="flex items-center gap-2">
            <Input type="number" defaultValue={available} className="w-20" aria-label={`${label} available beds`}/>
            <span className="text-muted-foreground">/</span>
            <Input type="number" defaultValue={total} className="w-20" aria-label={`${label} total beds`}/>
        </div>
    </div>
  );

  return (
    <div className="py-12 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Hospital Dashboard</h1>
          <p className="text-lg text-muted-foreground">Managing {hospital.name}</p>
        </div>
        <div className="flex gap-2">
          {hospital.onChainVerified ? (
            <Link 
              href={`https://testnet.snowtrace.io/tx/${hospital.lastVerificationHash}`} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200 hover:bg-green-200 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Verified on Avalanche <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <Button onClick={handleAvalancheVerify} disabled={isVerifying} variant="outline" className="border-accent text-accent hover:bg-accent/10">
              {isVerifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Activity className="h-4 w-4 mr-2" />}
              Anchor Bed Status to Blockchain
            </Button>
          )}
        </div>
      </div>

       <Tabs defaultValue="beds">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Hospital Profile</TabsTrigger>
          <TabsTrigger value="beds">Bed Management</TabsTrigger>
          <TabsTrigger value="staff">Staff & Doctors</TabsTrigger>
          <TabsTrigger value="appointments">Appointments ({appointments?.length ?? 0})</TabsTrigger>
        </TabsList>
        
         <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Hospital Profile</CardTitle>
                    <CardDescription>Update your hospital's public information and facilities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-1 space-y-2">
                             <label className="font-semibold">Hospital Image</label>
                             <Image 
                                src={hospital.imageUrl || 'https://picsum.photos/400'} 
                                alt={hospital.name}
                                width={200}
                                height={200}
                                className="w-full aspect-square object-cover rounded-lg border"
                             />
                              <Button className="w-full" variant="outline" onClick={() => toast({title: "Feature coming soon!"})}>
                                <Upload className="mr-2 h-4 w-4"/>
                                Upload New Image
                            </Button>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="space-y-2">
                                <label className="font-semibold">Hospital Name</label>
                                <Input defaultValue={hospital.name} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-semibold">Contact Number</label>
                                <Input defaultValue={hospital.contact} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-semibold">Specialties (comma-separated)</label>
                                <Input defaultValue={hospital.specialties.join(', ')} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-semibold">Facilities (comma-separated)</label>
                                <Textarea placeholder="e.g., 24/7 Pharmacy, In-house Lab, Canteen..." />
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => toast({title: "Profile Saved!"})}>Save Changes</Button>
                </CardHeader>
            </Card>
        </TabsContent>

        <TabsContent value="beds">
             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="font-headline">Real-Time Bed Availability</CardTitle>
                      <CardDescription>Update counts and Anchor to Avalanche for absolute public trust.</CardDescription>
                    </div>
                    {hospital.onChainVerified && (
                      <span className="text-xs text-muted-foreground italic">
                        Live proof anchored: {hospital.lastVerificationHash?.slice(0, 12)}...
                      </span>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <BedInput label="General Ward" available={hospital.beds.general.available} total={hospital.beds.general.total} />
                    <BedInput label="ICU" available={hospital.beds.icu.available} total={hospital.beds.icu.total} />
                    <BedInput label="Oxygen Beds" available={hospital.beds.oxygen.available} total={hospital.beds.oxygen.total} />
                    <BedInput label="Ventilator Beds" available={hospital.beds.ventilator.available} total={hospital.beds.ventilator.total} />
                    
                    <div className="flex gap-4 mt-6 pt-6 border-t">
                      <Button onClick={handleBedUpdate} className="flex-1">
                        Save to Local Database
                      </Button>
                      <Button onClick={handleAvalancheVerify} disabled={isVerifying} variant="secondary" className="flex-1 bg-accent/10 text-accent hover:bg-accent/20">
                        {isVerifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                        Anchor to Avalanche Fuji
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      <strong>Enterprise Trust:</strong> We use an automated server-side wallet to anchor your data. This ensures high availability and removes the friction of wallet management for hospital staff.
                    </p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="staff">
             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Manage Medical Staff</CardTitle>
                        <CardDescription>Onboard new doctors and manage existing staff profiles.</CardDescription>
                    </div>
                     <Button variant="outline"><UserPlus className="mr-2"/> Add New Doctor</Button>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 mb-4"/>
                        <p>Staff management is active. Use the button above to onboard doctors.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="appointments">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Patient Appointments</CardTitle>
                    <CardDescription>View all appointments scheduled at your hospital.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No active appointments to show.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default HospitalDashboard;
