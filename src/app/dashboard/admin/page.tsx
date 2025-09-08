
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getClinics, getDoctors, getHospitals, getAppointments, getUsers } from '@/lib/mock-data';
import type { Clinic, Doctor, Hospital, Appointment, User as AppUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, Shield, Users, Stethoscope, Building, Hospital as HospitalIcon, Pencil, Trash2, Calendar, CheckCircle, UserPlus, Activity, FlaskConical } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type AdminData = {
    doctors: Doctor[];
    clinics: Clinic[];
    hospitals: Hospital[];
    appointments: Appointment[];
    users: AppUser[];
};

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AdminData>({
    doctors: [],
    clinics: [],
    hospitals: [],
    appointments: [],
    users: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (!currentUser.email?.startsWith('admin@')) {
          setIsLoading(false);
          return;
        }
        
        try {
          const [doctors, clinics, hospitals, appointments, users] = await Promise.all([
            getDoctors(),
            getClinics(),
            getHospitals(),
            getAppointments(),
            getUsers()
          ]);
          setData({ doctors, clinics, hospitals, appointments, users });
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
        <h2 className="text-2xl font-bold font-headline text-destructive">Access Denied</h2>
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

  const kpiCards = [
      { title: "Total Users", value: data.users.length, icon: <Users/>, description: "All registered users" },
      { title: "Total Doctors", value: data.doctors.length, icon: <Stethoscope/>, description: "Verified doctors on platform" },
      { title: "Total Appointments", value: data.appointments.length, icon: <Calendar/>, description: "Booked across all clinics" },
      { title: "Partner Clinics", value: data.clinics.length, icon: <Building/>, description: "Clinics onboarded" }
  ]

  return (
    <div className="py-12 w-full max-w-7xl mx-auto space-y-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold font-headline text-accent">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome, {user.email}. Monitor and manage the platform here.</p>
      </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map(kpi => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <div className="text-muted-foreground">{kpi.icon}</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Activity/>Recent Activity</CardTitle>
                    <CardDescription>A log of recent important events happening on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {data.appointments.slice(0, 3).map(app => (
                        <div key={app.id} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${app.patientId}`} />
                                <AvatarFallback>{app.patientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-sm">
                                <p><span className="font-semibold">{app.patientName}</span> booked an appointment with <span className="font-semibold">{app.doctor.name}</span>.</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(app.date), 'PPpp')}</p>
                            </div>
                        </div>
                     ))}
                      {data.users.slice(0, 2).map(usr => (
                        <div key={usr.uid} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-green-500 text-white"><UserPlus/></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-sm">
                                <p><span className="font-semibold">{usr.email}</span> registered as a new {usr.role}.</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(), 'PPpp')}</p>
                            </div>
                        </div>
                     ))}
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">System Health</CardTitle>
                    <CardDescription>Real-time status of platform services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center flex flex-col items-center justify-center h-full pb-16">
                     <CheckCircle className="h-24 w-24 text-green-500"/>
                     <h3 className="text-xl font-bold">All Systems Operational</h3>
                     <p className="text-sm text-muted-foreground">Website, Database, and API services are running smoothly.</p>
                </CardContent>
            </Card>
        </div>


       <Tabs defaultValue="doctors">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users ({data.users.length})</TabsTrigger>
          <TabsTrigger value="doctors">Doctors ({data.doctors.length})</TabsTrigger>
          <TabsTrigger value="clinics">Clinics ({data.clinics.length})</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals ({data.hospitals.length})</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
            <Card>
                <CardHeader><CardTitle className="font-headline">Manage Users</CardTitle></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.users.map(u => (
                                <TableRow key={u.uid}>
                                    <TableCell className="font-medium">{u.email}</TableCell>
                                    <TableCell className="capitalize">{u.role}</TableCell>
                                    <TableCell>{format(new Date(), "PP")}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemove('user', u.uid)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="doctors">
            <Card>
                <CardHeader><CardTitle className="font-headline">Manage Doctors</CardTitle></CardHeader>
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
                <CardHeader><CardTitle className="font-headline">Manage Clinics</CardTitle></CardHeader>
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
                <CardHeader><CardTitle className="font-headline">Manage Hospitals</CardTitle></CardHeader>
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
         <TabsContent value="diagnostics">
            <Card>
                <CardHeader><CardTitle className="font-headline">Manage Diagnostics</CardTitle></CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                    <FlaskConical className="h-12 w-12 mx-auto mb-4"/>
                    <p>Diagnostics center management feature coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

    