
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getClinics, getDoctors, getHospitals } from '@/lib/mock-data';
import type { Clinic, Doctor, Hospital } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, Shield, Users, Stethoscope, Building, Hospital as HospitalIcon, Pencil, Trash2 } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{ doctors: Doctor[], clinics: Clinic[], hospitals: Hospital[] }>({
    doctors: [],
    clinics: [],
    hospitals: []
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Mock role check - in a real app, this would use custom claims
        if (!currentUser.email?.startsWith('admin@')) {
          setIsLoading(false);
          return;
        }
        
        try {
          const [doctors, clinics, hospitals] = await Promise.all([
            getDoctors(),
            getClinics(),
            getHospitals()
          ]);
          setData({ doctors, clinics, hospitals });
        } catch (error) {
          console.error("Failed to load admin data", error);
          toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive" });
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);
  
  const handleRemove = (type: string, id: string) => {
    toast({
        title: "Action Mocked",
        description: `This would remove the ${type} with ID: ${id}.`,
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!user || !user.email?.startsWith('admin@')) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">
          You must be logged in as an administrator to view this page.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">
             <LogIn className="mr-2"/>
             Go to Login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 w-full max-w-7xl mx-auto">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.email}. Manage your platform here.</p>
      </div>

       <Tabs defaultValue="doctors">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="doctors">Doctors ({data.doctors.length})</TabsTrigger>
          <TabsTrigger value="clinics">Clinics ({data.clinics.length})</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals ({data.hospitals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
            <Card>
                <CardHeader><CardTitle>Manage Users</CardTitle></CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4"/>
                    <p>User management feature coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="doctors">
            <Card>
                <CardHeader><CardTitle>Manage Doctors</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Specialty</TableHead>
                                <TableHead>Clinic</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.doctors.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={doc.imageUrl}/>
                                            <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{doc.specialty}</TableCell>
                                    <TableCell>{data.clinics.find(c => c.id === doc.clinicId)?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemove('doctor', doc.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="clinics">
             <Card>
                <CardHeader><CardTitle>Manage Clinics</CardTitle></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Doctors</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.clinics.map(clinic => (
                                <TableRow key={clinic.id}>
                                    <TableCell className="font-medium">{clinic.name}</TableCell>
                                    <TableCell>{clinic.location}</TableCell>
                                    <TableCell>{clinic.doctors.length}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemove('clinic', clinic.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="hospitals">
            <Card>
                <CardHeader><CardTitle>Manage Hospitals</CardTitle></CardHeader>
                <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Emergency</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.hospitals.map(hosp => (
                                <TableRow key={hosp.id}>
                                    <TableCell className="font-medium">{hosp.name}</TableCell>
                                    <TableCell>{hosp.location.address}</TableCell>
                                    <TableCell>{hosp.emergencyAvailable ? "Yes" : "No"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemove('hospital', hosp.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
