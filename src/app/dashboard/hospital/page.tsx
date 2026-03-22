"use client";

import { useEffect, useState } from 'react';
import { searchHospitals, updateHospitalBloodInventory } from '@/lib/data';
import type { Hospital, User as AppUser, BloodInventory, DoctorDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Droplet, Users, LogIn, Trash2, Pencil, Upload, ShieldAlert, ShieldCheck, Link as LinkIcon, Loader2, ExternalLink, Activity, Save, UserPlus, Search, GraduationCap } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import axios from 'axios';

// Mock initial staff for the demo
const MOCK_STAFF: (DoctorDetails & { role: string })[] = [
  { id: 'st-1', userId: 'doc-101', name: 'Dr. Sarah Ahmed', email: 'sarah.a@hospital.com', specialization: 'Cardiology', licenseNo: 'MC-99281', consultationFee: 1200, availability: [], role: 'Doctor', imageUrl: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'st-2', userId: 'doc-102', name: 'Dr. Robert Chen', email: 'robert.c@hospital.com', specialization: 'Neurology', licenseNo: 'MC-88273', consultationFee: 1500, availability: [], role: 'Doctor', imageUrl: 'https://i.pravatar.cc/150?u=robert' },
  { id: 'st-3', userId: 'ns-101', name: 'Nurse Priya Wilson', email: 'priya.w@hospital.com', specialization: 'Emergency Care', licenseNo: 'NS-1122', consultationFee: 0, availability: [], role: 'Nurse', imageUrl: 'https://i.pravatar.cc/150?u=priya' },
];

const HospitalDashboard = () => {
  const [userProfile, setUserProfile] = useState<AppUser | null | undefined>(undefined);
  const [hospital, setHospital] = useState<Hospital | null | undefined>(undefined);
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const { toast } = useToast();

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Doctor',
    specialization: '',
    licenseNo: '',
    email: '',
    phone: '',
  });

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

  const handleAddStaff = () => {
    const member = {
      ...newStaff,
      id: `st-${Date.now()}`,
      userId: `user-${Date.now()}`,
      consultationFee: newStaff.role === 'Doctor' ? 800 : 0,
      availability: [],
      imageUrl: `https://i.pravatar.cc/150?u=${newStaff.name}`,
    };
    setStaff([...staff, member as any]);
    setIsAddingStaff(false);
    toast({
      title: "Member Added",
      description: `${newStaff.name} has been added to the hospital directory.`,
    });
    setNewStaff({ name: '', role: 'Doctor', specialization: '', licenseNo: '', email: '', phone: '' });
  };

  const handleAvalancheVerify = async () => {
    if (!hospital) return;

    setIsVerifying(true);
    try {
      const anchorData = {
        beds: hospital.beds,
        blood: hospital.bloodInventory,
        staffCount: staff.length,
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
    <div className="py-12 w-full max-w-6xl mx-auto space-y-8">
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
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="font-headline">Personnel Management</CardTitle>
                      <CardDescription>Manage doctors, nurses, and administrative staff.</CardDescription>
                    </div>
                    <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Staff Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add New Personnel</DialogTitle>
                          <DialogDescription>
                            Enter the professional details of the new staff member.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Full Name</Label>
                            <Input id="name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <Select value={newStaff.role} onValueChange={v => setNewStaff({...newStaff, role: v})}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Doctor">Doctor</SelectItem>
                                <SelectItem value="Nurse">Nurse</SelectItem>
                                <SelectItem value="Technician">Technician</SelectItem>
                                <SelectItem value="Administrator">Administrator</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {newStaff.role === 'Doctor' && (
                            <>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="spec" className="text-right">Specialty</Label>
                                <Input id="spec" value={newStaff.specialization} onChange={e => setNewStaff({...newStaff, specialization: e.target.value})} className="col-span-3" placeholder="e.g. Cardiology" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lic" className="text-right">License No</Label>
                                <Input id="lic" value={newStaff.licenseNo} onChange={e => setNewStaff({...newStaff, licenseNo: e.target.value})} className="col-span-3" />
                              </div>
                            </>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddingStaff(false)}>Cancel</Button>
                          <Button onClick={handleAddStaff} disabled={!newStaff.name || !newStaff.email}>Add Member</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Credentials</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staff.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.imageUrl} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm leading-tight">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-medium">{member.role}</Badge>
                            </TableCell>
                            <TableCell>{member.specialization || '-'}</TableCell>
                            <TableCell>
                              <div className="text-xs space-y-0.5">
                                <p className="font-mono text-muted-foreground">{member.licenseNo}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                            <div className="space-y-2">
                              <Label>Hospital Name</Label>
                              <Input defaultValue={hospital.name} />
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Number</Label>
                              <Input defaultValue={hospital.contact} />
                            </div>
                            <div className="space-y-2">
                              <Label>Specialties (Comma separated)</Label>
                              <Textarea defaultValue={hospital.specialties.join(', ')} />
                            </div>
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
