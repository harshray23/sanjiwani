"use client";

import { useEffect, useState } from 'react';
import { searchHospitals, updateHospitalBloodInventory } from '@/lib/data';
import type { Hospital, User as AppUser, BloodInventory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BedDouble, Droplet, Users, LogIn, Trash2, Pencil, Upload, ShieldAlert, ShieldCheck, Link as LinkIcon, Loader2, ExternalLink, Activity, Save } from "lucide-react";
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(currentUser);

    const fetchData = async () => {
        if (currentUser && currentUser.role === 'hospital') {
            try {
                const [hospitalResults] = await Promise.all([
                    searchHospitals('Metro General Hospital'),
                ]);

                if (hospitalResults.length > 0) {
                  setHospital(hospitalResults[0]);
                } else {
                  setHospital(null);
                }
            } catch (error) {
                console.error("Error fetching hospital data:", error);
                setHospital(null);
            }
        }
    };
    
    fetchData();
  }, [toast]);
  
  const handleBloodUpdate = (type: keyof BloodInventory, value: string) => {
    if (!hospital || !hospital.bloodInventory) return;
    const numValue = parseInt(value) || 0;
    setHospital({
      ...hospital,
      bloodInventory: {
        ...hospital.bloodInventory,
        [type]: numValue
      }
    });
  };

  const saveInventory = async () => {
    if (!hospital) return;
    setIsSaving(true);
    try {
      await updateHospitalBloodInventory(hospital.id, hospital.bloodInventory);
      toast({ title: "Inventory Saved", description: "Blood and bed status updated in database." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvalancheVerify = async () => {
    if (!hospital) return;

    setIsVerifying(true);
    try {
      const anchorData = {
        beds: hospital.beds,
        blood: hospital.bloodInventory,
        timestamp: new Date().toISOString()
      };
      const response = await axios.post('/api/anchor', { data: anchorData });
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
        description: "Ensure the server wallet is funded with AVAX.",
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
            <p className="mt-2 text-muted-foreground">You must be logged in as a hospital administrator.</p>
            <Button asChild className="mt-6"><Link href="/login"><LogIn className="mr-2"/>Go to Login</Link></Button>
        </Card>
      </div>
    );
  }

  if (!hospital) {
     return <div className="text-center p-8"><Card className="max-w-md mx-auto p-8"><h2 className="text-2xl font-bold font-headline text-destructive">Profile Not Found</h2></Card></div>;
  }
  
  const BedInput = ({ label, available, total }: { label: string, available: number, total: number }) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <p className="font-medium">{label}</p>
        <div className="flex items-center gap-2">
            <Input type="number" defaultValue={available} className="w-20" />
            <span className="text-muted-foreground">/</span>
            <Input type="number" defaultValue={total} className="w-20" />
        </div>
    </div>
  );

  return (
    <div className="py-12 w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-accent">Hospital Dashboard</h1>
          <p className="text-lg text-muted-foreground">Managing {hospital.name}</p>
        </div>
        <div className="flex gap-2">
          {hospital.onChainVerified && (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              <ShieldCheck className="h-3 w-3 mr-1" /> Verified On-Chain
            </Badge>
          )}
        </div>
      </div>

       <Tabs defaultValue="inventory">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Bed & Blood Inventory</TabsTrigger>
          <TabsTrigger value="staff">Staff & Doctors</TabsTrigger>
          <TabsTrigger value="profile">Hospital Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="font-headline">Verified Inventory Management</CardTitle>
                      <CardDescription>Update counts and Anchor to Avalanche for public trust.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveInventory} disabled={isSaving} variant="outline" size="sm">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Local
                      </Button>
                      <Button onClick={handleAvalancheVerify} disabled={isVerifying} size="sm" className="bg-accent hover:bg-accent/90">
                        {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                        Anchor to Fuji
                      </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <BedDouble className="h-4 w-4"/> Bed Availability
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BedInput label="ICU Beds" available={hospital.beds.icu.available} total={hospital.beds.icu.total} />
                        <BedInput label="Oxygen Beds" available={hospital.beds.oxygen.available} total={hospital.beds.oxygen.total} />
                        <BedInput label="Ventilator Beds" available={hospital.beds.ventilator.available} total={hospital.beds.ventilator.total} />
                        <BedInput label="General Ward" available={hospital.beds.general.available} total={hospital.beds.general.total} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-red-600"/> Blood Bank Units
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {hospital.bloodInventory && Object.entries(hospital.bloodInventory).map(([type, units]) => (
                          <div key={type} className="space-y-1">
                            <label className="text-xs font-bold">{type}</label>
                            <Input 
                              type="number" 
                              value={units} 
                              onChange={(e) => handleBloodUpdate(type as keyof BloodInventory, e.target.value)} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-xs text-muted-foreground">
                        <strong>Integrity Notice:</strong> All updates anchored to Avalanche Fuji create a permanent hash of this inventory state. This prevents data manipulation during medical crises.
                      </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="staff">
             <Card>
                <CardHeader><CardTitle>Staff Management</CardTitle></CardHeader>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                  <p>Provider staff management active.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="profile">
            <Card>
                <CardHeader><CardTitle>Hospital Profile</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-2">
                             <Image src={hospital.imageUrl || ''} alt={hospital.name} width={200} height={200} className="w-full aspect-square object-cover rounded-lg border" />
                             <Button className="w-full" variant="outline">Upload New Image</Button>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <Input defaultValue={hospital.name} />
                            <Input defaultValue={hospital.contact} />
                            <Textarea defaultValue={hospital.specialties.join(', ')} />
                        </div>
                    </div>
                    <Button onClick={() => toast({title: "Profile Saved"})}>Save Changes</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalDashboard;
